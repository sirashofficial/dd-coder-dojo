// Simple SVG to PNG icon generator for PWA manifest
const fs = require('fs');
const path = require('path');

function createSVGIcon(size) {
    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
        <text x="50%" y="40%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold">DD</text>
        <text x="50%" y="70%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.15}">DOJO</text>
    </svg>`;
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = './images/icons/';

sizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    const filename = `icon-${size}x${size}.svg`;
    fs.writeFileSync(path.join(iconsDir, filename), svgContent);
    console.log(`Created ${filename}`);
});

console.log('Icon generation complete! Convert SVG files to PNG using online tools or ImageMagick.');
