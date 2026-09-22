import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public', 'images');

async function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (!fs.existsSync(fullPath)) continue;
        
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            await processDir(fullPath);
        } else if (file.match(/\.(jpg|jpeg|png)$/i)) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const webpPath = path.join(dir, `${baseName}.webp`);
            try {
                await sharp(fullPath).webp({ quality: 80 }).toFile(webpPath);
                fs.unlinkSync(fullPath);
                console.log(`Converted ${file} to ${baseName}.webp`);
            } catch (err) {
                console.error(`Failed to convert ${file}:`, err);
            }
        }
    }
}

processDir(publicDir).then(() => console.log('Done'));
