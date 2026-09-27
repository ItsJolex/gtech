# 🎯 PLAN DE IMPLEMENTACIÓN PARA OPENCODE: CORRECCIONES VISUALES DE TARJETAS DE PRODUCTOS Y BOTONES (SIM & ESPECIFICACIONES)

**Proyecto:** G-TECH.US (`/home/joel/Proyectos/G-Tech/GTech.us`)  
**Archivo principal a modificar:** `src/main.ts`  
**Archivos de apoyo / traducciones:** `src/i18n.ts`  
**Objetivo:** Solucionar los defectos visuales en las tarjetas del catálogo (`#systems`), reparar el recorte de antenas de radios, y posicionar de forma destacada, accesible y ergonómica los dos botones requeridos: **Tarjeta SIM (abajo a la izquierda)** y **Especificaciones Profundas (abajo a la derecha)**.

---

## 🔎 1. DIAGNÓSTICO DETALLADO Y AUDITORÍA VISUAL (VÍA BROWSER)

Tras la inspección con el agente de navegación web en la versión desplegada (`https://g-technology.vercel.app/#systems`) en resoluciones Desktop (1440px) y Mobile (390px), se identificaron las siguientes causas raíz:

### 1.1. Camuflaje e invisibilidad de los botones SIM y Especificaciones
- **Ubicación actual defectuosa:** Los botones están dentro del contenedor de la foto (`aspect-square relative overflow-hidden`), flotando en las esquinas inferiores con `absolute bottom-2 left-2` y `absolute bottom-2 right-2`.
- **Efecto camuflaje oscuro sobre oscuro:** Los botones usan `bg-navy-900/85` y las fotos de estudio de los radios PoC tienen pedestales negros, sombras profundas y fondos oscuros. Un botón azul oscuro sobre sombra negra resulta **100% invisible para el ojo humano**.
- **Iconografía errónea (Signo de interrogación `?`):** El botón de especificaciones técnicas actualmente usa el icono Lucide `help-circle` (un signo de interrogación `?`), dando la impresión de ser un botón de "Ayuda", "FAQ" o "Soporte", en lugar de la **Ficha Técnica / Especificaciones Profundas**.
- **Falta de etiquetas de texto:** Los botones son diminutos cuadros de 28px (`w-7 h-7`) sin texto. En móviles es imposible saber qué hacen sin tocarlos.
- **Error de toque en móvil (WCAG 2.5.5):** Al medir solo 28×28px, al intentar pulsarlos en pantallas táctiles, el usuario pulsa sin querer la tarjeta entera, disparando `openModal()` en vez de abrir las tarifas SIM o el dossier técnico.

### 1.2. Antenas y chasis de radios cortados por `object-cover`
- Las fotos de radios PoC (`G-889`, `G-H28`, `G-510`, `G-F1`, `WA0064`, etc.) son verticales y tienen antenas de látigo extendidas.
- Al usar `object-cover` en un contenedor cuadrado, el navegador hace zoom y **recorta brutalmente el 20-30% superior del radio**, decapitando las antenas y cortando la base de los equipos.

### 1.3. Desalineación vertical de tarjetas en la cuadrícula
- Títulos de 1 línea vs 2 líneas dejan espacios en blanco asimétricos.
- Las descripciones varían entre 3 y 7 líneas de texto.
- Los botones "COTIZAR" y "WhatsApp" quedan a diferentes alturas en tarjetas vecinas.

### 1.4. Borde de tarjeta invisible
- `border-gray-100` sobre el fondo de la página `bg-gray-50` se difumina y hace que las tarjetas parezcan cajas de texto flotantes sin definición nítida ni empaque táctico militar.

---

## 🛠️ 2. ESPECIFICACIÓN DE LA SOLUCIÓN REQUERIDA

Se requiere implementar:
1. **Contenedor de imagen limpio:** `object-contain p-2.5 sm:p-3.5` con fondo claro de estudio `bg-slate-50/80` y borde `border-slate-200/70`. Las antenas completas, pantallas y perillas deben verse 100% íntegras.
2. **Fila táctica dedicada para los 2 botones obligatorios:**
   - **Abajo a la izquierda:** Botón **Tarjeta SIM / Plan SIM** (`openSimPricingModal(product.id)`). Con icono de chip SIM esmeralda y texto claro.
   - **Abajo a la derecha:** Botón **Especificaciones Profundas / Ficha Técnica** (`openDeepDiveModal(product.id, 'from_catalog')`). Con icono de dossier/documento técnico (NO `?`) y texto claro.
3. **Fila de acción primaria (CTA):**
   - Botón `[ 🛒 Cotizar ]` (rojo crimson principal) + Botón WhatsApp verde.
4. **Alineación uniforme en cuadrícula:** `flex flex-col h-full`, `min-h` uniforme en títulos y descripciones, y `mt-auto` en el pie de botones para que todas las tarjetas tengan exactamente la misma altura.

---

## 📝 3. CÓDIGO EXACTO A REEMPLAZAR EN `src/main.ts`

Localizar en `src/main.ts` la función donde se renderizan las tarjetas del catálogo (líneas ~310 a ~430).

### 🔴 Código actual a sustituir:
```typescript
    return `
      <div id="catalog-card-${product.id}" class="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-sm hover:shadow-md border border-gray-100 flex flex-col relative group cursor-pointer transition-all duration-200 card-hardware-accel" onclick="openModal('${product.id}')">

        <div class="aspect-square bg-navy-950/10 rounded-xl sm:rounded-2xl mb-2 sm:mb-3 relative overflow-hidden flex items-center justify-center border border-gray-200/70 group/cardimg shadow-xs">
          <img id="card-img-${product.id}" src="${initialCardImg}" alt="${localized.name}" class="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-300" loading="lazy">

          <!-- Top Badges Header -->
          <div class="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
            <span class="bg-navy-900/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-tight truncate max-w-[65%] sm:max-w-[70%]">
              ${localized.badge}
            </span>
            ${product.stockStatus === 'low_stock' && product.inStock ? `
              <span class="bg-amber-600 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider shadow flex-shrink-0">${t('catalog.low_stock')}${product.stockCount ? ` (${product.stockCount})` : ''}</span>
            ` : product.stockStatus === 'in_stock' && product.stockCount !== undefined && product.stockCount > 0 ? `
              <span class="bg-emerald-700/90 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider shadow flex-shrink-0">${product.stockCount} ${lang === 'es' ? 'disp.' : 'avail.'}</span>
            ` : ''}
          </div>

          ${!product.inStock ? `
            <div class="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span class="bg-crimson-800 text-white px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow">${t('catalog.sold_out')}</span>
            </div>
          ` : ''}

          <!-- Color dots for multi-color models -->
          ${product.colors && product.colors.length > 1 ? `
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 pointer-events-auto shadow-md" onclick="event.stopPropagation()">
              ${product.colors.map((c, idx) => `
                <button type="button"
                        onclick="event.stopPropagation(); window.setCardColor('${product.id}', '${c.id}')"
                        id="dot-${product.id}-${c.id}"
                        class="card-color-dot-${product.id} w-3 h-3 rounded-full border border-white/80 transition-all ${idx === currentColorIdx ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}"
                        style="background-color: ${c.hex};"
                        title="${lang === 'es' ? (c.nameEs || c.name) : c.name}"
                        aria-label="Color ${c.name}">
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- BOTTOM-LEFT: Cellular SIM Pricing Button -->
          <button onclick="event.stopPropagation(); window.openSimPricingModal('${product.id}')"
                  class="absolute bottom-2 left-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy-900/85 hover:bg-navy-950 text-white backdrop-blur-sm border border-white/20 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group/sim"
                  title="${t('catalog.sim_rates')}"
                  aria-label="View SIM pricing">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 group-hover/sim:text-emerald-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
              <rect x="8" y="10" width="8" height="8" rx="1"/>
              <path d="M12 10v8M8 14h8"/>
            </svg>
          </button>

          <!-- BOTTOM-RIGHT: Deep-Dive Technical Specs Button -->
          <button onclick="event.stopPropagation(); window.openDeepDiveModal('${product.id}', 'from_catalog')"
                  class="absolute bottom-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-navy-900/85 hover:bg-navy-950 text-white backdrop-blur-sm border border-white/20 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 group/spec"
                  title="${t('catalog.full_specs')}"
                  aria-label="View detailed specifications">
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover/spec:text-amber-200 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </button>
        </div>

        <h3 class="text-xs sm:text-base font-bold text-navy-800 line-clamp-2 leading-snug mb-1 min-h-[2.4rem] sm:min-h-[2.5rem]" title="${localized.name}">
          ${localized.name}
        </h3>

        ${(window as any).siteShowPrices && product.discountPrice ? `
          <div class="flex items-baseline gap-2 mb-1.5 flex-wrap">
            <span class="text-sm sm:text-base font-extrabold text-emerald-600">${product.discountPrice}</span>
            ${product.priceEstimate ? `<span class="text-xs text-gray-400 line-through font-semibold">${product.priceEstimate}</span>` : ''}
            <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wide">${lang === 'es' ? 'OFERTA' : 'SALE'}</span>
          </div>
        ` : (window as any).siteShowPrices && product.priceEstimate ? `
          <div class="flex items-baseline gap-2 mb-1.5 flex-wrap">
            <span class="text-xs sm:text-sm font-bold text-navy-900">${product.priceEstimate}</span>
          </div>
        ` : ''}

        ${product.colors && product.colors.length > 1 ? `
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ${product.colors.length} ${lang === 'es' ? 'colores disponibles' : 'colors available'}
            </span>
          </div>
        ` : ''}

        <p class="hidden sm:block text-gray-500 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
          ${localized.description}
        </p>

        <div class="sm:hidden mb-2 text-[10px] text-gray-500 truncate">
          <span class="text-navy-700 font-semibold">${product.specs?.[0]?.value || '4G LTE PoC'}</span>
        </div>

        <div class="flex items-center gap-1.5 mt-auto pt-2 border-t border-gray-100">
          <button onclick="event.stopPropagation(); addToCart('${product.id}')"
                  class="flex-1 py-1.5 px-2 bg-crimson-800 hover:bg-crimson-900 text-white rounded-lg font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                  title="${t('catalog.quote_btn')}" aria-label="Add to quotation">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span class="truncate">${t('catalog.quote_btn')}</span>
          </button>

          <a href="https://wa.me/14074273356?text=${waQuoteText}"
             target="_blank" onclick="event.stopPropagation()"
             class="w-7 h-7 sm:w-8 sm:h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95"
             title="${t('catalog.whatsapp_direct')}" aria-label="Inquire via WhatsApp">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>

      </div>
    `;
```

---

### 🟢 Código nuevo y optimizado para OpenCode:
```typescript
    const simBtnLabel = lang === 'es' ? 'Tarjeta SIM' : 'SIM Card';
    const specsBtnLabel = lang === 'es' ? 'Ficha Técnica' : 'Deep Specs';
    const quoteBtnLabel = t('catalog.quote_btn') || (lang === 'es' ? 'Cotizar' : 'Quote');

    return `
      <div id="catalog-card-${product.id}" class="bg-white rounded-2xl p-2.5 sm:p-4 shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-crimson-700/40 flex flex-col h-full relative group cursor-pointer transition-all duration-300 card-hardware-accel" onclick="openModal('${product.id}')">

        <!-- 1. IMAGE CONTAINER (Sin recorte de antenas + Fondo limpio) -->
        <div class="aspect-square bg-slate-50/90 rounded-xl mb-2 sm:mb-3 relative overflow-hidden flex items-center justify-center border border-slate-200/70 group/cardimg shadow-2xs">
          <img id="card-img-${product.id}" 
               src="${initialCardImg}" 
               alt="${localized.name}" 
               class="w-full h-full object-contain p-2.5 sm:p-3.5 rounded-xl group-hover:scale-105 transition-transform duration-300" 
               loading="lazy">

          <!-- Top Badges Header -->
          <div class="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
            <span class="bg-navy-900/95 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded shadow-sm tracking-tight truncate max-w-[65%] sm:max-w-[70%]">
              ${localized.badge}
            </span>
            ${product.stockStatus === 'low_stock' && product.inStock ? `
              <span class="bg-amber-600 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider shadow flex-shrink-0">${t('catalog.low_stock')}${product.stockCount ? ` (${product.stockCount})` : ''}</span>
            ` : product.stockStatus === 'in_stock' && product.stockCount !== undefined && product.stockCount > 0 ? `
              <span class="bg-emerald-700/95 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold tracking-wider shadow flex-shrink-0">${product.stockCount} ${lang === 'es' ? 'disp.' : 'avail.'}</span>
            ` : ''}
          </div>

          ${!product.inStock ? `
            <div class="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span class="bg-crimson-800 text-white px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow">${t('catalog.sold_out')}</span>
            </div>
          ` : ''}

          <!-- Color dots for multi-color models (Centrados sin estorbar) -->
          ${product.colors && product.colors.length > 1 ? `
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 pointer-events-auto shadow-md" onclick="event.stopPropagation()">
              ${product.colors.map((c, idx) => `
                <button type="button"
                        onclick="event.stopPropagation(); window.setCardColor('${product.id}', '${c.id}')"
                        id="dot-${product.id}-${c.id}"
                        class="card-color-dot-${product.id} w-3 h-3 rounded-full border border-white/80 transition-all ${idx === currentColorIdx ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'}"
                        style="background-color: ${c.hex};"
                        title="${lang === 'es' ? (c.nameEs || c.name) : c.name}"
                        aria-label="Color ${c.name}">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- 2. PRODUCT TITLE -->
        <h3 class="text-xs sm:text-base font-extrabold text-navy-900 line-clamp-2 leading-snug mb-1 min-h-[2.4rem] sm:min-h-[2.6rem]" title="${localized.name}">
          ${localized.name}
        </h3>

        <!-- 3. PRECIOS (Si están activados en el panel admin) -->
        ${(window as any).siteShowPrices && product.discountPrice ? `
          <div class="flex items-baseline gap-2 mb-1.5 flex-wrap">
            <span class="text-sm sm:text-base font-extrabold text-emerald-600">${product.discountPrice}</span>
            ${product.priceEstimate ? `<span class="text-xs text-gray-400 line-through font-semibold">${product.priceEstimate}</span>` : ''}
            <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wide">${lang === 'es' ? 'OFERTA' : 'SALE'}</span>
          </div>
        ` : (window as any).siteShowPrices && product.priceEstimate ? `
          <div class="flex items-baseline gap-2 mb-1.5 flex-wrap">
            <span class="text-xs sm:text-sm font-bold text-navy-900">${product.priceEstimate}</span>
          </div>
        ` : ''}

        ${product.colors && product.colors.length > 1 ? `
          <div class="flex items-center gap-1.5 mb-1.5">
            <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ${product.colors.length} ${lang === 'es' ? 'colores disponibles' : 'colors available'}
            </span>
          </div>
        ` : ''}

        <!-- 4. DESCRIPCIÓN CON ALTURA MÍNIMA UNIFORME -->
        <p class="hidden sm:block text-slate-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed min-h-[2.4rem]">
          ${localized.description}
        </p>

        <div class="sm:hidden mb-2 text-[10px] text-slate-500 truncate">
          <span class="text-navy-700 font-semibold">${product.specs?.[0]?.value || '4G LTE PoC'}</span>
        </div>

        <!-- 5. FILA DE ACCIONES SECUNDARIAS TÁCTICAS: SIM (IZQUIERDA) & ESPECIFICACIONES (DERECHA) -->
        <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 pt-2 border-t border-slate-100">
          <!-- ABAJO A LA IZQUIERDA: Botón Tarjeta SIM -->
          <button type="button"
                  onclick="event.stopPropagation(); window.openSimPricingModal('${product.id}')"
                  class="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-[10px] sm:text-[11px] font-bold transition-all active:scale-95 shadow-2xs group/sim"
                  title="${t('catalog.sim_rates') || 'Tarifas SIM Globales'}"
                  aria-label="View SIM pricing">
            <svg class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"/>
              <rect x="8" y="10" width="8" height="8" rx="1"/>
              <path d="M12 10v8M8 14h8"/>
            </svg>
            <span class="truncate">${simBtnLabel}</span>
          </button>

          <!-- ABAJO A LA DERECHA: Botón Especificaciones Profundas (Ficha Técnica con icono real de documento, NO '?') -->
          <button type="button"
                  onclick="event.stopPropagation(); window.openDeepDiveModal('${product.id}', 'from_catalog')"
                  class="flex-1 inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 border border-slate-300/80 text-[10px] sm:text-[11px] font-bold transition-all active:scale-95 shadow-2xs group/spec"
                  title="${t('catalog.full_specs') || 'Ficha Técnica Completa'}"
                  aria-label="View detailed specifications">
            <svg class="w-3.5 h-3.5 text-navy-700 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span class="truncate">${specsBtnLabel}</span>
          </button>
        </div>

        <!-- 6. FILA DE ACCIONES PRINCIPALES (COTIZAR + WHATSAPP) FLUSH AL FINAL -->
        <div class="flex items-center gap-1.5 mt-auto">
          <button type="button"
                  onclick="event.stopPropagation(); addToCart('${product.id}')"
                  class="flex-1 py-2 px-2 bg-crimson-800 hover:bg-crimson-900 text-white rounded-lg font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  title="${quoteBtnLabel}" aria-label="Add to quotation">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span class="truncate">${quoteBtnLabel}</span>
          </button>

          <a href="https://wa.me/14074273356?text=${waQuoteText}"
             target="_blank" onclick="event.stopPropagation()"
             class="w-8 h-8 sm:w-9 sm:h-9 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-transform active:scale-95"
             title="${t('catalog.whatsapp_direct')}" aria-label="Inquire via WhatsApp">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>

      </div>
    `;
```

---

## 🌐 4. ACTUALIZACIÓN DE TRADUCCIONES EN `src/i18n.ts`

Verificar que en `src/i18n.ts` existan o agregar las claves para garantizar consistencia bilingüe:

```typescript
  'catalog.sim_rates': { en: 'SIM Coverage Rates', es: 'Tarifas SIM Globales' },
  'catalog.full_specs': { en: 'Full Technical Specs', es: 'Ficha Técnica Completa' },
  'catalog.sim_btn': { en: 'SIM Card', es: 'Tarjeta SIM' },
  'catalog.specs_btn': { en: 'Deep Specs', es: 'Especificaciones' },
```

---

## 🧪 5. LISTA DE VERIFICACIÓN PARA OPENCODE

Una vez realizado el cambio en `src/main.ts`:

1. **Compilación Limpia:**
   ```bash
   cd /home/joel/Proyectos/G-Tech/GTech.us
   npm run build
   ```
   *Debe arrojar `✓ built in ...ms` sin errores de TypeScript ni de empaquetado Vite.*

2. **Verificación Visual en Navegador Desktop (1440px):**
   - Las fotos de radios PoC con antenas largas (`G-889`, `G-280`, `G-510`, `G-H28`) muestran la antena completa de principio a fin, sin cortes.
   - El fondo de la foto es limpio y claro (`bg-slate-50/90`).
   - Abajo a la izquierda de cada tarjeta se aprecia claramente el botón verde esmeralda `[ 📶 Tarjeta SIM ]`.
   - Abajo a la derecha de cada tarjeta se aprecia claramente el botón `[ 📋 Ficha Técnica ]` con icono de hoja de especificaciones (NO un `?`).
   - Al pulsar el botón de Tarjeta SIM, se abre el modal interactivo de planes anuales SIM con tarifas de EE.UU./Can/Mex, LatAm, Brasil, Europa y Global.
   - Al pulsar el botón de Especificaciones Profundas, se abre la ficha técnica del producto.
   - Ambos botones contienen `event.stopPropagation()` para no disparar el modal genérico dos veces.

3. **Verificación Visual en Móvil (375px / 390px):**
   - En cuadrícula de 2 columnas (`grid-cols-2`), los textos de `Tarjeta SIM` y `Ficha Técnica` se leen con total nitidez sin desbordarse.
   - Las tarjetas tienen una altura uniforme y los botones inferiores quedan perfectamente alineados en cada fila.
