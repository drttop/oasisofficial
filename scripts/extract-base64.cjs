const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function extractBase64() {
  let content = fs.readFileSync('src/data/initialData.ts', 'utf8');
  
  // Ensure directories exist
  fs.mkdirSync('public/images/casinos', { recursive: true });
  fs.mkdirSync('public/images/spots', { recursive: true });
  fs.mkdirSync('public/images/header', { recursive: true });

  const dataUrlRegex = /"data:image\/([a-zA-Z0-9+.-]+);base64,([^"]+)"/g;
  let matches = [...content.matchAll(dataUrlRegex)];
  console.log('Found ' + matches.length + ' base64 data URLs');

  let fileIndex = 0;
  for (const m of matches) {
    fileIndex++;
    const fullMatch = m[0];
    const mimeSub = m[1];
    const base64Str = m[2];
    const buf = Buffer.from(base64Str, 'base64');
    
    // Check context around match to name it nicely
    const idx = m.index;
    const contextBefore = content.slice(Math.max(0, idx - 200), idx);
    let fileName = '';
    
    if (contextBefore.includes('headerLogo')) {
      fileName = 'public/images/header/header_logo.webp';
    } else if (contextBefore.includes('okada-manila') || (contextBefore.includes('initialCasinos') && fileIndex === 2)) {
      fileName = 'public/images/casinos/casino_okada.webp';
    } else if (contextBefore.includes('City of Dreams') || contextBefore.includes('cod-manila')) {
      fileName = 'public/images/casinos/casino_cod.webp';
    } else if (contextBefore.includes('solaire')) {
      fileName = 'public/images/casinos/casino_solaire.webp';
    } else if (contextBefore.includes('newport') || contextBefore.includes('뉴포트')) {
      fileName = 'public/images/casinos/casino_newport.webp';
    } else if (contextBefore.includes('hann') || contextBefore.includes('한 카지노')) {
      fileName = 'public/images/casinos/casino_hann.webp';
    } else if (contextBefore.includes('dheights') || contextBefore.includes('디하이츠') || contextBefore.includes('royce') || contextBefore.includes('로이스') || contextBefore.includes('initialCasinos')) {
      fileName = 'public/images/casinos/casino_resort_' + fileIndex + '.webp';
    } else if (contextBefore.includes('FREE ROOM') || contextBefore.includes('spot-1') || contextBefore.includes('프리룸')) {
      fileName = 'public/images/spots/spot_free_room.webp';
    } else if (contextBefore.includes('spot-2') || contextBefore.includes('PICK UP') || contextBefore.includes('리무진')) {
      fileName = 'public/images/spots/spot_pickup_' + fileIndex + '.webp';
    } else if (contextBefore.includes('EXCHANGE') || contextBefore.includes('환전')) {
      fileName = 'public/images/spots/spot_exchange.webp';
    } else {
      fileName = 'public/images/spots/spot_item_' + fileIndex + '.webp';
    }

    // Convert buffer to WebP with good quality
    await sharp(buf)
      .webp({ quality: 85, effort: 4 })
      .toFile(fileName);

    const stat = fs.statSync(fileName);
    const webPath = '/' + fileName.replace('public/', '');
    console.log('Saved ' + fileName + ' (' + stat.size + ' bytes) -> webPath: ' + webPath);

    // Replace in content
    content = content.replace(fullMatch, '"' + webPath + '"');
  }

  fs.writeFileSync('src/data/initialData.ts', content, 'utf8');
  console.log('src/data/initialData.ts successfully updated! New size: ' + fs.statSync('src/data/initialData.ts').size);
}

extractBase64();
