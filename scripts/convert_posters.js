import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const targetDir = path.join(process.cwd(), 'public', 'images', 'posters');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const baseAssetsDir = process.env.ASSETS_DIR || path.join(process.cwd(), '..');

const posterFiles = [
  {
    src: path.join(baseAssetsDir, 'Posters', 'huracan-season-g-tech-radio-poster.jpeg'),
    dest: 'huracan-season-poster.webp',
    title: 'Campaña Oficial Temporada de Huracanes'
  },
  {
    src: path.join(baseAssetsDir, 'Imagenes nuevas', 'g-tech-tactical-communication-equipment-poster.jpeg'),
    dest: 'tactical-lineup-poster.webp',
    title: 'Despliegue Táctico y Flota Completa G-TECH'
  },
  {
    src: path.join(baseAssetsDir, 'Posters', 'IMG-20260922-WA0070.jpg'),
    dest: 'bq-k8-bodycam-poster.webp',
    title: 'Terminal Táctico Bodycam 4K BQ-K8'
  },
  {
    src: path.join(baseAssetsDir, 'Posters', 'wa0058-vehicle-radio-palm-mic-02.jpeg'),
    dest: 'v1-plus-vehicle-poster.webp',
    title: 'Estación Base y Radios Móviles Vehiculares'
  },
  {
    src: path.join(baseAssetsDir, 'Posters', 'g-f1-smart-poc-in-hand-01.jpeg'),
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
