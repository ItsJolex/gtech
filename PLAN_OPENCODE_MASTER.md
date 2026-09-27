# 🐺 Manual de Ejecución Técnica para OpenCode: GTech.us

> **Instrucciones para OpenCode:**  
> Este documento contiene el plan exhaustivo y los scripts de implementación para completar las tareas del Panel de Administración, optimización del Avatar en el Hero, la vitrina de Posters de Publicidad y la consolidación del Catálogo de 19 Radios en orden estricto dentro de Turso DB y `products.json`.  
> 
> ⚡ **IMPORTANTE - CORRECCIONES VISUALES DE TARJETAS Y BOTONES (SIM & ESPECIFICACIONES):**  
> Se ha creado el documento especializado [`PLAN_OPENCODE_CARD_FIXES.md`](./PLAN_OPENCODE_CARD_FIXES.md) que contiene el código exacto y el diagnóstico para arreglar el recorte de antenas de radios (`object-contain`), fondo de estudio, y los 2 botones obligatorios en cada tarjeta: **Tarjeta SIM abajo a la izquierda** y **Ficha Técnica / Especificaciones abajo a la derecha**. Ejecútalo prioritariamente en `src/main.ts`.  
> Sigue cada sección en orden y ejecuta los scripts de verificación al finalizar.

---

## 📋 Resumen de Tareas de OpenCode

0. **Tienda Principal: Corrección de Tarjetas de Productos ([Ver PLAN_OPENCODE_CARD_FIXES.md](./PLAN_OPENCODE_CARD_FIXES.md))**
   - Corregir recorte de antenas (`object-cover` -> `object-contain p-2.5 sm:p-3.5`).
   - Ubicar botón **Tarjeta SIM** abajo a la izquierda (`openSimPricingModal`).
   - Ubicar botón **Especificaciones Profundas** abajo a la derecha (`openDeepDiveModal`).
   - Eliminar el camuflaje oscuro y la iconografía errónea (signo de interrogación `?`).

1. **Panel Admin: Precios (ON / OFF)**
   - Toggle global en el header del panel para ocultar o mostrar precios en la tienda.
   - Creación de tabla `system_settings` en Turso DB y endpoints `/api/settings` y `/api/admin/settings`.
   - Condición en `src/main.ts` para respetar el estado del toggle en el storefront.

2. **Panel Admin: Revertir Borrados (Soft Delete & Papelera)**
   - Adición de columnas `is_deleted` y `deleted_at` a la tabla `products` en Turso DB.
   - Actualización de `/api/admin/products.ts` para que `DELETE` marque `is_deleted = 1`.
   - Endpoint de restauración para desmarcar `is_deleted = 0`.
   - Nueva vista "Papelera / Eliminados" en `admin.html` y `src/admin.ts` con botón "Restaurar".

3. **Panel Admin: División por Accesorios**
   - Habilitar la pestaña `#tab-accessories` (remover etiqueta "Fase 2").
   - Filtrar y gestionar accesorios con categoría `accessory`.
   - Adaptar el modal de edición para incluir conector, compatibilidad y categoría de accesorio.

4. **Página: Acomodar Avatar del Inicio ("El Muñeco")**
   - Reubicar los dos badges flotantes ("Multiband Network" y "AES-256 Encrypted") en `index.html` para que no cubran los hombros, rostro ni torso del personaje.
   - Ajustar el padding y el aura radar táctica para dar presencia al avatar en mobile y desktop.

5. **Página: Publicidades (Posters Oficiales)**
   - Convertir los posters ubicados en `/home/joel/Proyectos/G-Tech/Posters/` e `Imagenes nuevas/` a formato WebP optimizado en `public/images/posters/`.
   - Añadir una sección `#tactical-campaigns` en `index.html` con galería interactiva y modal lightbox.

6. **Página & Base de Datos: Catálogo Estricto de 19 Modelos**
   - Asegurar que `G-8900 Pro` y `G5 Plus` estén incluidos, y que `G6 Plus Black` y `G6 Plus Green` figuren como productos independientes.
   - Aplicar el orden estricto de 1 a 19 en `products.json` y sincronizarlo directamente en Turso DB.

---

## 🛠️ SECCIÓN 1: Precios (ON / OFF)

### 1.1 Script de Inicialización de la Tabla de Configuración en Turso DB
Crea y ejecuta el script `scripts/setup_settings_turso.js`:

```javascript
// scripts/setup_settings_turso.js
import { createClient } from '@libsql/client/web';
import fs from 'fs';
import path from 'path';

const env = fs.readFileSync('.env', 'utf-8');
const url = env.match(/TURSO_DATABASE_URL="?([^\s"\n]+)/)[1];
const authToken = env.match(/TURSO_AUTH_TOKEN="?([^\s"\n]+)/)[1];

const client = createClient({ url, authToken });

async function initSettings() {
  console.log('Inicializando tabla system_settings en Turso...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    INSERT OR IGNORE INTO system_settings (key, value)
    VALUES ('show_prices', 'false');
  `);

  console.log('✓ Tabla system_settings configurada correctamente.');
}

initSettings().catch(console.error);
```

### 1.2 Endpoints de API

#### `api/settings.ts` (Lectura Pública)
```typescript
import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    const result = await client.execute({
      sql: 'SELECT value FROM system_settings WHERE key = ?;',
      args: ['show_prices'],
    });

    const showPrices = result.rows.length > 0 ? result.rows[0].value === 'true' : false;
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=30');
    return res.status(200).json({ showPrices });
  } catch (err: any) {
    return res.status(200).json({ showPrices: false });
  }
}
```

#### `api/admin/settings.ts` (Modificación Autenticada)
```typescript
import { createClient } from '@libsql/client/web';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function verifyAuth(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization;
  const secretKey = process.env.ADMIN_SECRET_KEY || 'gtech_admin_2026_tactical';
  if (!authHeader) return false;
  return authHeader.replace(/^Bearer\s+/i, '').trim() === secretKey;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!verifyAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  if (req.method === 'GET') {
    const result = await client.execute('SELECT key, value FROM system_settings;');
    const settings: Record<string, string> = {};
    result.rows.forEach(r => { settings[r.key as string] = r.value as string; });
    return res.status(200).json(settings);
  }

  if (req.method === 'POST') {
    const { key, value } = req.body || {};
    if (!key || value === undefined) return res.status(400).json({ error: 'Missing key or value' });

    await client.execute({
      sql: `
        INSERT INTO system_settings (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP;
      `,
      args: [key, String(value)],
    });

    return res.status(200).json({ ok: true, key, value });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

### 1.3 Integración en `admin.html` y `src/admin.ts`
En el header de `admin.html`:
```html
<div class="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
  <span class="text-xs font-bold text-slate-300 uppercase">Precios en Tienda:</span>
  <button id="toggle-price-display" type="button" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-slate-700">
    <span id="toggle-price-slider" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
  </button>
  <span id="toggle-price-label" class="text-xs font-extrabold text-slate-400">OFF</span>
</div>
```

En `src/admin.ts`:
- Consultar `/api/admin/settings` al iniciar sesión para sincronizar el estado del toggle.
- Al hacer clic en `#toggle-price-display`, invertir el valor y enviar `POST /api/admin/settings`.
- Mostrar toast de confirmación: `"Precios en tienda pública: ACTIVADOS"` o `"Precios en tienda pública: DESACTIVADOS"`.

### 1.4 Consumo en el Catálogo Público (`src/main.ts`)
- Al cargar la página, ejecutar `fetch('/api/settings')`.
- Guardar `window.siteShowPrices = data.showPrices`.
- En `renderCatalog()`:
  ```typescript
  ${window.siteShowPrices && product.discountPrice ? `
    <div class="flex items-baseline gap-2 mb-1.5 flex-wrap">
      <span class="text-sm sm:text-base font-extrabold text-emerald-600">${product.discountPrice}</span>
      ${product.priceEstimate ? `<span class="text-xs text-gray-400 line-through font-semibold">${product.priceEstimate}</span>` : ''}
    </div>
  ` : window.siteShowPrices && product.priceEstimate ? `
    <div class="flex items-baseline gap-2 mb-1.5 flex-wrap">
      <span class="text-xs sm:text-sm font-bold text-navy-900">${product.priceEstimate}</span>
    </div>
  ` : ''}
  ```

---

## 🗄️ SECCIÓN 2: Base de Datos para Revertir Borrados (Papelera)

### 2.1 Migración de Columnas en Turso DB
Crea y ejecuta el script `scripts/add_soft_delete_columns.js`:

```javascript
// scripts/add_soft_delete_columns.js
import { createClient } from '@libsql/client/web';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const url = env.match(/TURSO_DATABASE_URL="?([^\s"\n]+)/)[1];
const authToken = env.match(/TURSO_AUTH_TOKEN="?([^\s"\n]+)/)[1];

const client = createClient({ url, authToken });

async function migrate() {
  console.log('Agregando columnas de soft delete a products...');
  try {
    await client.execute('ALTER TABLE products ADD COLUMN is_deleted INTEGER NOT NULL DEFAULT 0;');
    console.log('✓ Columna is_deleted agregada.');
  } catch (e) {
    console.log('Columna is_deleted ya existía o:', e.message);
  }

  try {
    await client.execute('ALTER TABLE products ADD COLUMN deleted_at TEXT;');
    console.log('✓ Columna deleted_at agregada.');
  } catch (e) {
    console.log('Columna deleted_at ya existía o:', e.message);
  }
}

migrate().catch(console.error);
```

### 2.2 Actualizar `api/admin/products.ts`
1. **Borrado Lógico en `DELETE`:**
   ```typescript
   if (method === 'DELETE') {
     const id = (req.query.id as string) || req.body?.id;
     const permanent = req.query.permanent === 'true';

     if (!id) return res.status(400).json({ error: 'Product ID is required' });

     if (permanent) {
       await client.execute({ sql: 'DELETE FROM products WHERE id = ?;', args: [id] });
       return res.status(200).json({ ok: true, id, message: 'Producto eliminado definitivamente' });
     } else {
       await client.execute({
         sql: 'UPDATE products SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?;',
         args: [id]
       });
       return res.status(200).json({ ok: true, id, message: 'Producto movido a la papelera' });
     }
   }
   ```

2. **Restauración de Productos:**
   Crear `api/admin/restore.ts` o incorporar acción en `POST /api/admin/restore`:
   ```typescript
   // api/admin/restore.ts
   import { createClient } from '@libsql/client/web';
   import type { VercelRequest, VercelResponse } from '@vercel/node';

   export default async function handler(req: VercelRequest, res: VercelResponse) {
     if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
     const { id } = req.body || {};
     if (!id) return res.status(400).json({ error: 'ID is required' });

     const client = createClient({
       url: process.env.TURSO_DATABASE_URL!,
       authToken: process.env.TURSO_AUTH_TOKEN!,
     });

     await client.execute({
       sql: 'UPDATE products SET is_deleted = 0, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
       args: [id],
     });

     return res.status(200).json({ ok: true, message: `Producto ${id} restaurado exitosamente` });
   }
   ```

3. **Excluir Borrados de la API Pública (`api/products.ts`):**
   ```sql
   SELECT ... FROM products 
   WHERE is_visible = 1 AND (is_deleted = 0 OR is_deleted IS NULL) AND category = ?
   ORDER BY sort_order ASC, updated_at DESC;
   ```

4. **Interfaz de la Papelera en `admin.html` y `src/admin.ts`:**
   - Botón de filtro `Papelera (<span id="count-trash">0</span>)`.
   - Cuando se selecciona el filtro papelera, cargar productos con `is_deleted = 1`.
   - Renderizar botones:
     - Botón verde: `data-action="restore"` &rarr; llama a `/api/admin/restore`.
     - Botón rojo: `data-action="permanent-delete"` &rarr; llama a `DELETE /api/admin/products?id=${id}&permanent=true`.

---

## 🎛️ SECCIÓN 3: División por Accesorios en el Panel Admin

1. **En `admin.html`:**
   - Quitar la etiqueta `Fase 2` del botón `#tab-accessories`.
   - Asegurar que el modal de crear/editar producto (`#product-modal`) muestre o adapte campos relevantes cuando `category === 'accessory'` (selector de conector Type-K, Type-C, RJ, y lista de compatibilidad de modelos).

2. **En `src/admin.ts`:**
   - Variable `currentCategory: 'radio' | 'accessory' = 'radio'`.
   - Al hacer clic en `#tab-radios`:
     - Activar estilo de botón de radios y cargar `/api/admin/products?category=radio`.
   - Al hacer clic en `#tab-accessories`:
     - Activar estilo de botón de accesorios y cargar `/api/admin/products?category=accessory`.
   - El botón `#btn-new-product` pre-asignará la categoría correspondiente según la pestaña abierta.

---

## 👤 SECCIÓN 4: Acomodar Avatar del Inicio y Textos Alrededor

### Diagnóstico
En `GTech.us/index.html` (líneas 180–213), las etiquetas flotantes se encuentran solapadas sobre la imagen del avatar:
- Badge 1 (Top-Left): `top-6 -left-2 sm:left-0`
- Badge 2 (Bottom-Right): `bottom-8 -right-2 sm:right-0`

### Solución en `GTech.us/index.html`
Reemplaza el bloque del avatar (aproximadamente líneas 180–213) por el siguiente código limpio con espaciado exterior y soporte responsive:

```html
<!-- Right Column: Avatar Stage with Tactical Aura & Non-Overlapping Telemetry -->
<div class="lg:w-1/2 relative w-full flex items-center justify-center pt-8 sm:pt-0">
  <div class="relative w-full max-w-[340px] sm:max-w-md lg:max-w-lg mx-auto flex items-end justify-center">
    
    <!-- Animated Background Tactical Aura -->
    <div class="absolute inset-0 bg-gradient-to-tr from-navy-800/15 via-crimson-800/10 to-transparent rounded-full filter blur-3xl -z-10 avatar-glow"></div>
    <div class="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-navy-800/10 -z-10 animate-radar-spin"></div>
    <div class="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full -z-10 radar-sweep"></div>
    <div class="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-dashed border-crimson-800/20 -z-10 animate-radar-spin" style="animation-duration: 30s; animation-direction: reverse;"></div>

    <!-- Floating Badge 1: Top Left (Moved safely OUTSIDE the character silhouette) -->
    <div class="absolute -top-3 left-0 sm:-left-8 lg:-left-12 bg-white/95 backdrop-blur-md border border-gray-200/90 px-3.5 py-2 rounded-2xl shadow-xl z-20 flex items-center gap-2.5 transition-transform hover:scale-105 pointer-events-auto">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <div class="text-left">
        <span class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none" data-i18n="hero.badge_network_sub">Multiband Network</span>
        <span class="text-xs font-extrabold text-navy-800" data-i18n="hero.badge_network">4G, 3G, 2G Active</span>
      </div>
    </div>

    <!-- Floating Badge 2: Bottom Right (Moved safely OUTSIDE the character torso) -->
    <div class="absolute bottom-4 right-0 sm:-right-8 lg:-right-12 bg-white/95 backdrop-blur-md border border-gray-200/90 px-3.5 py-2 rounded-2xl shadow-xl z-20 flex items-center gap-2.5 transition-transform hover:scale-105 pointer-events-auto">
      <div class="w-7 h-7 rounded-xl bg-crimson-50 flex items-center justify-center flex-shrink-0">
        <svg class="w-4 h-4 text-crimson-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
      </div>
      <div class="text-left">
        <span class="block text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none" data-i18n="hero.badge_security_sub">Security Protocol</span>
        <span class="text-xs font-extrabold text-navy-800" data-i18n="hero.badge_security">AES-256 Encrypted</span>
      </div>
    </div>

    <!-- Brand Cutout Avatar: Full Unobstructed View -->
    <img src="/images/hero-avatar.webp" 
         alt="G-TECH.US Tactical Communications Expert" 
         class="relative z-10 w-full max-h-[420px] sm:max-h-[480px] object-contain drop-shadow-2xl [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)] select-none pointer-events-none" />
  </div>
</div>
```

---

## 🖼️ SECCIÓN 5: Sección de Publicidades y Posters Oficiales

### 5.1 Conversión de Posters a WebP
Ejecutar el siguiente script en `GTech.us`:

```javascript
// scripts/convert_posters.js
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const targetDir = path.join(process.cwd(), 'public', 'images', 'posters');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const posterFiles = [
  {
    src: '/home/joel/Proyectos/G-Tech/Posters/huracan-season-g-tech-radio-poster.jpeg',
    dest: 'huracan-season-poster.webp',
    title: 'Campaña Oficial Temporada de Huracanes'
  },
  {
    src: '/home/joel/Proyectos/G-Tech/Imagenes nuevas/g-tech-tactical-communication-equipment-poster.jpeg',
    dest: 'tactical-lineup-poster.webp',
    title: 'Despliegue Táctico y Flota Completa G-TECH'
  },
  {
    src: '/home/joel/Proyectos/G-Tech/Posters/IMG-20260922-WA0070.jpg',
    dest: 'bq-k8-bodycam-poster.webp',
    title: 'Terminal Táctico Bodycam 4K BQ-K8'
  },
  {
    src: '/home/joel/Proyectos/G-Tech/Posters/wa0058-vehicle-radio-palm-mic-02.jpeg',
    dest: 'v1-plus-vehicle-poster.webp',
    title: 'Estación Base y Radios Móviles Vehiculares'
  },
  {
    src: '/home/joel/Proyectos/G-Tech/Posters/g-f1-smart-poc-in-hand-01.jpeg',
    dest: 'g-f1-in-hand-poster.webp',
    title: 'G-F1 Smart PoC Despliegue en Terreno'
  }
];

async function convertPosters() {
  console.log('Convirtiendo posters a WebP...');
  for (const item of posterFiles) {
    if (!fs.existsSync(item.src)) {
      console.warn('No existe:', item.src);
      continue;
    }
    const outPath = path.join(targetDir, item.dest);
    await sharp(item.src)
      .resize(1200, 1600, { fit: 'inside' })
      .webp({ quality: 85 })
      .toFile(outPath);
    console.log(`✓ Convertido: ${item.dest}`);
  }
}

convertPosters().catch(console.error);
```

### 5.2 Estructura HTML para la Sección de Posters en `index.html`
Colocar antes del `footer`:

```html
<!-- Tactical Publicities & Field Posters Showcase -->
<section id="campaigns" class="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-950/80 border border-crimson-700/60 text-crimson-400 text-xs font-bold uppercase tracking-widest mb-3">
        <span class="w-2 h-2 rounded-full bg-crimson-500 animate-pulse"></span>
        Material Oficial &amp; Publicidades
      </div>
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Campañas Tácticas &amp; Despliegues</h2>
      <p class="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
        Descarga o consulta el material gráfico oficial utilizado en briefings de seguridad, preparación para emergencias y ferias de telecomunicaciones.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Poster 1: Huracán Season -->
      <div class="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl cursor-pointer hover:border-crimson-600 transition-all duration-300" onclick="window.openPosterLightbox('/images/posters/huracan-season-poster.webp', 'Campaña Oficial Temporada de Huracanes')">
        <div class="aspect-[3/4] overflow-hidden bg-slate-950 flex items-center justify-center">
          <img src="/images/posters/huracan-season-poster.webp" alt="Huracán Season Poster" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        </div>
        <div class="p-4 border-t border-slate-800/80 bg-slate-900/90">
          <span class="text-[10px] font-bold text-crimson-400 uppercase tracking-widest block">Emergencias Críticas</span>
          <h3 class="text-sm font-extrabold text-white mt-1 group-hover:text-crimson-300 transition-colors">Temporada de Huracanes</h3>
        </div>
      </div>

      <!-- Poster 2: Tactical Lineup -->
      <div class="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl cursor-pointer hover:border-crimson-600 transition-all duration-300" onclick="window.openPosterLightbox('/images/posters/tactical-lineup-poster.webp', 'Línea Táctica Completa PoC')">
        <div class="aspect-[3/4] overflow-hidden bg-slate-950 flex items-center justify-center">
          <img src="/images/posters/tactical-lineup-poster.webp" alt="Tactical Lineup Poster" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        </div>
        <div class="p-4 border-t border-slate-800/80 bg-slate-900/90">
          <span class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">Hardware 2026</span>
          <h3 class="text-sm font-extrabold text-white mt-1 group-hover:text-cyan-300 transition-colors">Ecosistema Integral PoC</h3>
        </div>
      </div>

      <!-- Poster 3: Bodycam BQ-K8 -->
      <div class="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl cursor-pointer hover:border-crimson-600 transition-all duration-300" onclick="window.openPosterLightbox('/images/posters/bq-k8-bodycam-poster.webp', 'Terminal Táctico Bodycam 4K')">
        <div class="aspect-[3/4] overflow-hidden bg-slate-950 flex items-center justify-center">
          <img src="/images/posters/bq-k8-bodycam-poster.webp" alt="Bodycam BQ-K8 Poster" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        </div>
        <div class="p-4 border-t border-slate-800/80 bg-slate-900/90">
          <span class="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Seguridad &amp; Custodia</span>
          <h3 class="text-sm font-extrabold text-white mt-1 group-hover:text-amber-300 transition-colors">Bodycam 4K BQ-K8</h3>
        </div>
      </div>

      <!-- Poster 4: Mobile Base Station -->
      <div class="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60 shadow-xl cursor-pointer hover:border-crimson-600 transition-all duration-300" onclick="window.openPosterLightbox('/images/posters/v1-plus-vehicle-poster.webp', 'Estación Base y Radios Móviles')">
        <div class="aspect-[3/4] overflow-hidden bg-slate-950 flex items-center justify-center">
          <img src="/images/posters/v1-plus-vehicle-poster.webp" alt="Vehicle Radio Poster" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
        </div>
        <div class="p-4 border-t border-slate-800/80 bg-slate-900/90">
          <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Flotas y Transporte</span>
          <h3 class="text-sm font-extrabold text-white mt-1 group-hover:text-emerald-300 transition-colors">Transceptores Vehiculares</h3>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 📻 SECCIÓN 6: Catálogo de 19 Modelos en Orden Estricto

### 6.1 Lista Oficial de los 19 Modelos

> **IMPORTANTE:** El orden debe ser exactamente el siguiente:

1. **G-M2** (`Model-G-M2`) &rarr; `/images/Model G-M2.webp`
2. **G-510** (`G-510`) &rarr; `/images/G-510.webp`
3. **G-280** (`G-280-2`) &rarr; `/images/G-280-2.webp`
4. **G-H28** (`G-H28`) &rarr; `/images/G-H28jpg.webp`
5. **G-F1** (`G-F1`) &rarr; `/images/G-F1.webp`
6. **G-889** (`G-889`) &rarr; `/images/G-889.webp`
7. **G-K8** (`WA0069-Bodycam`) &rarr; `/images/IMG-20260922-WA0069.webp`
8. **G-8900 Pro** (`G-8900-Pro`) &rarr; `/images/g-8900-pro.webp`
9. **G0 Plus** (`WA0055-GlobalLTE`) &rarr; `/images/IMG-20260922-WA0055.webp`
10. **G9 Plus** (`WA0057-TacticalField`) &rarr; `/images/IMG-20260922-WA0057.webp`
11. **G6 Plus Black** (`WA0060-Black`) &rarr; `/images/G-6-black.webp`
12. **G6 Plus Green** (`WA0060-Green`) &rarr; `/images/G-6-green.webp`
13. **P0 IP6 Black** (`G-P0-Black`) &rarr; `/images/G-F1-floating-black.webp`
14. **P0 IP6 Blue** (`P0-Ex-Blue`) &rarr; `/images/G-F1-floating-blue.webp`
15. **G5 Plus** (`G5-Plus`) &rarr; `/images/g5-plus.webp`
16. **G8 Plus** (`WA0062-TriMode`) &rarr; `/images/IMG-20260922-WA0062.webp`
17. **5288 Plus** (`WA0064-LongRange`) &rarr; `/images/IMG-20260922-WA0064.webp`
18. **V1 plus** (`WA0058-Vehicle`) &rarr; `/images/IMG-20260922-WA0058.webp`
19. **Alervites AT1 by Baofeng** (`WA0066-Alervites`) &rarr; `/images/G-34181-black.webp`

### 6.2 Script de Sincronización en Turso DB (`scripts/seed_turso_19_products.js`)

```javascript
// scripts/seed_turso_19_products.js
import { createClient } from '@libsql/client/web';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const url = env.match(/TURSO_DATABASE_URL="?([^\s"\n]+)/)[1];
const authToken = env.match(/TURSO_AUTH_TOKEN="?([^\s"\n]+)/)[1];
const client = createClient({ url, authToken });

const rawProducts = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

async function syncTurso() {
  console.log(`Sincronizando ${rawProducts.length} productos en Turso DB en orden estricto...`);

  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    const sortOrder = i + 1;

    await client.execute({
      sql: `
        INSERT INTO products (
          id, name, short_name, badge, image, description,
          in_stock, stock_status, stock_count, price_estimate, discount_price,
          is_visible, fallback_similar_id, fallback_reason,
          specs, comparison, tags, colors, category, sort_order, is_deleted, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP
        )
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          short_name = excluded.short_name,
          badge = excluded.badge,
          image = excluded.image,
          description = excluded.description,
          in_stock = excluded.in_stock,
          stock_status = excluded.stock_status,
          stock_count = excluded.stock_count,
          price_estimate = excluded.price_estimate,
          discount_price = excluded.discount_price,
          is_visible = excluded.is_visible,
          fallback_similar_id = excluded.fallback_similar_id,
          fallback_reason = excluded.fallback_reason,
          specs = excluded.specs,
          comparison = excluded.comparison,
          tags = excluded.tags,
          colors = excluded.colors,
          category = 'radio',
          sort_order = excluded.sort_order,
          is_deleted = 0,
          updated_at = CURRENT_TIMESTAMP;
      `,
      args: [
        p.id,
        p.name,
        p.shortName || null,
        p.badge,
        p.image,
        p.description || '',
        p.inStock !== false ? 1 : 0,
        p.stockStatus || 'in_stock',
        p.stockCount ?? null,
        p.priceEstimate || null,
        p.discountPrice || null,
        p.isVisible !== false ? 1 : 0,
        p.fallbackSimilarId || null,
        p.fallbackReason || null,
        JSON.stringify(p.specs || []),
        JSON.stringify(p.comparison || {}),
        JSON.stringify(p.tags || []),
        p.colors ? JSON.stringify(p.colors) : null,
        'radio',
        sortOrder
      ],
    });

    console.log(`✓ [${sortOrder}/19] ${p.id} (${p.name})`);
  }

  console.log('✓ Sincronización con Turso completada exitosamente.');
}

syncTurso().catch(console.error);
```

---

## 🧪 Pruebas de Verificación Final

Ejecuta estos dos comandos al finalizar todas las modificaciones:

```bash
# 1. Compilación TypeScript y Vite sin errores
npm run build

# 2. Comprobar que Turso DB devuelve exactamente los 19 productos en orden
node -e "
import('@libsql/client/web').then(async ({ createClient }) => {
  const fs = await import('fs');
  const env = fs.readFileSync('.env', 'utf-8');
  const url = env.match(/TURSO_DATABASE_URL=\"?([^\s\"\n]+)/)[1];
  const token = env.match(/TURSO_AUTH_TOKEN=\"?([^\s\"\n]+)/)[1];
  const client = createClient({ url, authToken: token });
  const res = await client.execute('SELECT sort_order, id, name FROM products WHERE category=\'radio\' AND (is_deleted=0 OR is_deleted IS NULL) ORDER BY sort_order ASC;');
  console.log('Total radios activos en Turso:', res.rows.length);
  res.rows.forEach(r => console.log(r.sort_order + ': ' + r.id + ' -> ' + r.name));
});
"
```
