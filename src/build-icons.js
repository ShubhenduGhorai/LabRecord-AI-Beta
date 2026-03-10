const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#2563eb" />
  <text x="50%" y="55%" font-family="Arial, Helvetica, sans-serif" font-size="280" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">LR</text>
</svg>
`;

async function build() {
    const dir = path.join(__dirname, '../public');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(dir, 'icon.png'));
    await sharp(Buffer.from(svg)).resize(180, 180).png().toFile(path.join(dir, 'apple-icon.png'));
    await sharp(Buffer.from(svg)).resize(32, 32).png().toFile(path.join(dir, 'favicon.ico'));

    // Also put manifest.json in public/
    const manifest = {
        name: "LabRecord AI",
        short_name: "LabRecord",
        icons: [
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png"
            }
        ],
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone"
    };
    fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2));
}

build().catch(console.error);
