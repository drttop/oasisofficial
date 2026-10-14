const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateBrandAssets() {
  console.log('🎨 Starting official brand assets & favicon generation...');

  const masterPath = 'public/master_favicon_512.png';
  if (!fs.existsSync(masterPath)) {
    console.error('Master favicon not found:', masterPath);
    return;
  }
  const masterBuf = fs.readFileSync(masterPath);

  // 1. Write vector favicon.svg with embedded high-fidelity asset on pure black
  const base64Png = masterBuf.toString('base64');
  const svgContent = `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="512" height="512" fill="#000000" />
  <image href="data:image/png;base64,${base64Png}" width="512" height="512" />
</svg>`;
  fs.writeFileSync('public/favicon.svg', svgContent, 'utf8');
  console.log('✅ Created public/favicon.svg');

  // 2. Generate PNG favicon variants
  const pngSizes = [
    { file: 'public/favicon-512x512.png', size: 512, sharpen: false },
    { file: 'public/favicon-192x192.png', size: 192, sharpen: false },
    { file: 'public/favicon-144x144.png', size: 144, sharpen: false },
    { file: 'public/favicon-96x96.png', size: 96, sharpen: false },
    { file: 'public/favicon-48x48.png', size: 48, sharpen: true },
    { file: 'public/favicon-32x32.png', size: 32, sharpen: true },
    { file: 'public/favicon-16x16.png', size: 16, sharpen: true },
    { file: 'public/favicon.png', size: 96, sharpen: false },
    { file: 'public/apple-touch-icon.png', size: 180, sharpen: false },
    { file: 'public/ffaaa.png', size: 512, sharpen: false },
  ];

  for (const item of pngSizes) {
    let p = sharp(masterBuf).resize(item.size, item.size, { kernel: 'lanczos3' });
    if (item.sharpen) {
      p = p.sharpen();
    }
    await p.png({ quality: 100, compressionLevel: 9 }).toFile(item.file);
    console.log(`✅ Generated ${item.file} (${item.size}x${item.size})`);
  }

  // 3. Generate multi-resolution ICO file (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of icoSizes) {
    const buf = await sharp(masterBuf).resize(s, s, { kernel: 'lanczos3' }).sharpen().png().toBuffer();
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
