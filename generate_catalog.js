import fs from 'fs';
import path from 'path';

const imgDir = path.join(process.cwd(), 'public', 'images');
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.webp') && !f.includes('logo') && !f.includes('poster') && !f.includes('media_'));

const products = files.map(f => {
    let name = f.replace('.webp', '').replace('jpg', '').replace('Model ', '');
    let price = Math.floor(Math.random() * (250 - 100) + 100);
    
    // Hardcoded known ones
    if (f === 'G-889.webp') price = 220;
    if (f === 'G-F1.webp') price = 185;
    if (f === 'G-280-2.webp') price = 165;
    if (f === 'Model G-M2.webp') price = 115;
    
    let desc = "Professional PoC Radio with nationwide coverage and robust design.";
    if (f.includes('G-M2')) desc = "Ultra-compact wearable PoC Radio with a large central PTT button.";
    if (f.includes('G-889')) desc = "Professional Dual-Antenna PoC Radio with full keypad and large display.";
    if (f.includes('BQ-K8')) desc = "BODYCAM + POC 4G. 1080p Video, Night Vision, SOS Alarm. No distance limits.";
    if (f.includes('G-F1')) desc = "Smart-style PoC Radio featuring a large touchscreen interface.";

    return {
        id: f.replace('.webp', '').replace(/[^a-zA-Z0-9]/g, '-'),
        name: name,
        price: price,
        image: `/images/${f}`,
        description: desc,
        specs: [
            { label: "Network", value: "4G / LTE PoC" },
            { label: "Battery", value: "High Capacity Li-ion" },
            { label: "Waterproof", value: "IP68 Certified" },
            { label: "Encryption", value: "AES-256" }
        ]
    };
});

// Add BQ-K8 explicitly since it's the poster but we also want it as a product maybe? 
// User said "BQ-K8" is the poster. Let's add it to catalog too.
products.unshift({
    id: 'BQ-K8',
    name: 'BQ-K8 Bodycam + PoC',
    price: 299,
    image: '/images/BQ-K8-poster.webp',
    description: "BODYCAM + POC 4G. 1080p Video, Night Vision, SOS Alarm, Team Collaboration. No distance limits.",
    specs: [
        { label: "Resolution", value: "1080p HD" },
        { label: "Network", value: "4G LTE" },
        { label: "Features", value: "Night Vision, GPS" },
        { label: "Storage", value: "SD Card Supported" }
    ]
});

console.log(JSON.stringify(products, null, 2));
