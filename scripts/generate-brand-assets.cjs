const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateBrandAssets() {
  console.log('🎨 Starting official brand assets & favicon generation...');

  const svgFavicon = `<svg viewBox="0 0 500 500" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" rx="100" fill="#020617" />
  <defs>
    <linearGradient id="gold-base" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C6934A" />
      <stop offset="20%" stop-color="#E4BA69" />
      <stop offset="40%" stop-color="#FFF2B2" />
      <stop offset="60%" stop-color="#D4A053" />
      <stop offset="80%" stop-color="#8A5A21" />
      <stop offset="100%" stop-color="#E5B54F" />
    </linearGradient>
    <linearGradient id="gold-highlight" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E5B54F" />
      <stop offset="50%" stop-color="#FFECA8" />
      <stop offset="100%" stop-color="#9C6B26" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.5" />
    </filter>
  </defs>
  <g filter="url(#shadow)" transform="scale(1.22) translate(-45, -42)">
    <path
      d="M 250 120 C 160 120, 120 180, 120 240 C 120 300, 160 360, 230 360 C 240 360, 255 358, 265 355 C 255 340, 230 325, 205 320 C 155 310, 150 240, 150 240 C 150 240, 165 150, 250 150 C 330 150, 350 220, 350 240 C 350 255, 345 285, 325 305 C 345 300, 365 280, 375 255 C 385 220, 380 160, 350 135 C 320 115, 280 120, 250 120 Z"
      fill="url(#gold-base)"
    />
    <path
      d="M 180 325 C 230 310, 280 355, 360 330 C 345 345, 320 360, 290 360 C 240 360, 195 340, 180 325 Z"
      fill="url(#gold-highlight)"
    />
    <path
      d="M 230 365 C 280 355, 320 375, 365 350 C 345 375, 310 390, 270 385 C 250 380, 235 375, 230 365 Z"
      fill="url(#gold-base)"
    />
  </g>
</svg>`;

  // 1. Write vector favicon.svg
  fs.writeFileSync('public/favicon.svg', svgFavicon, 'utf8');
  console.log('✅ Created public/favicon.svg');

  const svgBuffer = Buffer.from(svgFavicon);

  // 2. Generate PNG favicon variants
  const pngSizes = [
    { file: 'public/favicon-512x512.png', size: 512 },
    { file: 'public/favicon-192x192.png', size: 192 },
    { file: 'public/favicon-144x144.png', size: 144 },
    { file: 'public/favicon-96x96.png', size: 96 },
    { file: 'public/favicon-48x48.png', size: 48 },
    { file: 'public/favicon-32x32.png', size: 32 },
    { file: 'public/favicon-16x16.png', size: 16 },
    { file: 'public/favicon.png', size: 96 },
    { file: 'public/apple-touch-icon.png', size: 180 },
    { file: 'public/ffaaa.png', size: 512 },
  ];

  for (const item of pngSizes) {
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(item.file);
    console.log(`✅ Generated ${item.file} (${item.size}x${item.size})`);
  }

  // 3. Generate multi-resolution ICO file (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(svgBuffer).resize(s, s).png().toBuffer();
    pngBuffers.push({ size: s, buf });
  }

  const numImages = pngBuffers.length;
  const headerSize = 6 + (16 * numImages);
  let currentOffset = headerSize;

  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(numImages, 4);

  const icoEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 0);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buf.length, 8);
    entry.writeUInt32LE(currentOffset, 12);
    icoEntries.push(entry);
    currentOffset += item.buf.length;
  }

  const icoBuffer = Buffer.concat([
    icoHeader,
    ...icoEntries,
    ...pngBuffers.map(p => p.buf)
  ]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('✅ Generated public/favicon.ico (Multi-size MS Windows icon resource)');

  // 4. Generate official site OG Image: public/logo.jpg and public/logo.webp (1200x630)
  const officialSource = fs.existsSync('public/images/oasis_official_logo.jpg')
    ? 'public/images/oasis_official_logo.jpg'
    : 'src/assets/images/oasis_official_logo.jpg';

  await sharp(officialSource)
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 2, g: 6, b: 23, alpha: 1 } // Luxury deep navy-black #020617
    })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile('public/logo.jpg');
  console.log('✅ Generated public/logo.jpg (1200x630 official OG image)');

  await sharp(officialSource)
    .resize(1200, 630, {
      fit: 'contain',
      background: { r: 2, g: 6, b: 23, alpha: 1 }
    })
    .webp({ quality: 92 })
    .toFile('public/logo.webp');
  console.log('✅ Generated public/logo.webp (1200x630 official webp image)');

  console.log('🎉 Brand assets & favicons successfully upgraded to official Oasis VIP branding!');
}

generateBrandAssets().catch((err) => {
  console.error('❌ Error generating brand assets:', err);
  process.exit(1);
});
