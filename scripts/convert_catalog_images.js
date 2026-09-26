import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const G_TECH_ROOT = '/home/joel/Proyectos/G-Tech';
const SOURCE_DIRS = [
  path.join(G_TECH_ROOT, 'Fotos_Nuevas_Catalogo_GTech'),
  path.join(G_TECH_ROOT, 'Catalogo_Productos_GTech', '00_TODAS_LAS_FOTOS_NUEVAS')
];
const TARGET_DIR = path.join(process.cwd(), 'public', 'images');

const SIZE = 1000;
const QUALITY = 85;

// Orden estricto de los 19 modelos. `sources` son candidatos en orden de
// preferencia: el contenido es identico entre "nueva.jpg" y ".jpg", pero no todos
// los directorios contienen ambas variantes.
const CATALOG = [
  { order: 1, model: 'G-M2', out: 'Model G-M2.webp', sources: ['G-M2 nueva.jpg', 'G-M2.jpg'] },
  { order: 2, model: 'G-510', out: 'G-510.webp', sources: ['G-510 nueva.jpg', 'G-510.jpg'] },
  { order: 3, model: 'G-280', out: 'G-280-2.webp', sources: ['G-280 nueva.jpg', 'G-280.jpg'] },
  { order: 4, model: 'G-H28', out: 'G-H28jpg.webp', sources: ['G-H28 nueva.jpg', 'G-H28.jpg'] },
  { order: 5, model: 'G-F1', out: 'G-F1.webp', sources: ['G-F1 nueva.jpg', 'G-F1.jpg'] },
  { order: 6, model: 'G-889', out: 'G-889.webp', sources: ['G-889 nueva.jpg', 'G-889.jpg'] },
  { order: 7, model: 'G-K8', out: 'IMG-20260922-WA0069.webp', sources: ['G-K8 nueva.jpg', 'G-K8.jpg'] },
  { order: 8, model: 'G-8900 Pro', out: 'g-8900-pro.webp', sources: ['G-8900 Pro nueva.jpg', 'G-8900 Pro.jpg'] },
  { order: 9, model: 'G0 Plus', out: 'IMG-20260922-WA0055.webp', sources: ['G0 Plus nueva.jpg', 'G0 Plus.jpg'] },
  { order: 10, model: 'G9 Plus', out: 'IMG-20260922-WA0057.webp', sources: ['G9 Plus nueva.jpg', 'G9 Plus.jpg'] },
  { order: 11, model: 'G6 Plus Black', out: 'G-6-black.webp', sources: ['G6 Plus Black nueva.jpg', 'G6 Plus Black.jpg'] },
  { order: 12, model: 'G6 Plus Green', out: 'G-6-green.webp', sources: ['G6 Plus Green nueva.jpg', 'G6 Plus Green.jpg'] },
  { order: 13, model: 'P0 IP6 Black', out: 'G-F1-floating-black.webp', sources: ['P0 IP6 Black nueva.jpg', 'P0 IP6 Black.jpg'] },
  { order: 14, model: 'P0 IP6 Blue', out: 'G-F1-floating-blue.webp', sources: ['P0 IP6 Blue nueva.jpg', 'P0 IP6 Blue.jpg'] },
  { order: 15, model: 'G5 Plus', out: 'g5-plus.webp', sources: ['G5 Plus nueva.jpg', 'G5 Plus.jpg'] },
  { order: 16, model: 'G8 Plus', out: 'IMG-20260922-WA0062.webp', sources: ['G8 Plus nueva.jpg', 'G8 Plus.jpg'] },
  { order: 17, model: '5288 Plus', out: 'IMG-20260922-WA0064.webp', sources: ['5288 Plus nueva.jpg', '5288 Plus.jpg'] },
  { order: 18, model: 'V1 plus', out: 'IMG-20260922-WA0058.webp', sources: ['V1 plus nueva.jpg', 'V1 plus.jpg'] },
  {
    order: 19,
    model: 'Alervites AT1 by Baofeng',
    variants: [
      { out: 'G-34181-black.webp', sources: ['Alervites AT1 by Baofeng - Black nueva.jpg', 'Alervites AT1 by Baofeng - Black.jpg', 'Alervites AT1 by Baofeng nueva.jpg', 'Alervites AT1 by Baofeng.jpg'] },
      { out: 'G-34181-grey.webp', sources: ['Alervites AT1 by Baofeng - Grey nueva.jpg', 'Alervites AT1 by Baofeng - Grey.jpg'] },
      { out: 'G-34181-white.webp', sources: ['Alervites AT1 by Baofeng - White nueva.jpg', 'Alervites AT1 by Baofeng - White.jpg'] },
      { out: 'alervites-trio.webp', sources: ['Alervites AT1 by Baofeng - Trio nueva.jpg', 'Alervites AT1 by Baofeng - Trio.jpg'] }
    ]
  }
];

function resolveSource(candidates) {
  for (const dir of SOURCE_DIRS) {
    for (const name of candidates) {
      const full = path.join(dir, name);
      if (fs.existsSync(full)) return full;
    }
  }
  return null;
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function convertOne(label, candidates, outName) {
  const src = resolveSource(candidates);
  if (!src) {
    console.error(`  [FALLO] ${label}: no se encontro ninguna fuente para ${outName}`);
    return { ok: false, out: outName, label };
  }

  const dest = path.join(TARGET_DIR, outName);
  const before = fs.existsSync(dest) ? fs.statSync(dest).size : 0;

  await sharp(src)
    .resize(SIZE, SIZE, { fit: 'inside' })
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(dest);

  const after = fs.statSync(dest).size;
  const meta = await sharp(dest).metadata();
  const delta = before ? ` (antes ${kb(before)})` : ' (nuevo)';

  console.log(
    `  [OK] ${label} -> ${outName}  ${kb(after)}${delta}  ${meta.width}x${meta.height}`
  );
  return { ok: true, out: outName, label, bytes: after, before };
}

async function main() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  console.log(`Convirtiendo catalogo a WebP (${SIZE}x${SIZE}, q=${QUALITY})\n`);

  const results = [];

  for (const entry of CATALOG) {
    const label = `${String(entry.order).padStart(2, '0')}. ${entry.model}`;
    if (entry.variants) {
      console.log(label);
      for (const v of entry.variants) {
        results.push(await convertOne(`   ${v.out}`, v.sources, v.out));
      }
    } else {
      results.push(await convertOne(label, entry.sources, entry.out));
    }
  }

  const failed = results.filter(r => !r.ok);
  const created = results.filter(r => r.ok && r.before === 0);
  const replaced = results.filter(r => r.ok && r.before > 0);
  const total = results.filter(r => r.ok).reduce((sum, r) => sum + r.bytes, 0);

  console.log(`\nResumen: ${results.length - failed.length}/${results.length} OK`);
  console.log(`  ${replaced.length} sobrescritas, ${created.length} nuevas`);
  console.log(`  Peso total: ${kb(total)}  (promedio ${Math.round(total / (results.length - failed.length) / 1024)} KB)`);

  const heavy = results.filter(r => r.ok && r.bytes > 120 * 1024);
  if (heavy.length) {
    console.log(`\n  Aviso: ${heavy.length} imagen(es) superan 120 KB (fuera del rango del plan):`);
    for (const h of heavy) console.log(`    ${h.out}  ${kb(h.bytes)}`);
  }

  if (failed.length) process.exitCode = 1;
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
