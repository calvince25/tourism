const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const LOGO_PATH = path.join(__dirname, '../logo.jpg');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Function to pack PNG buffers into a single ICO file
function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(count, 4); // Count

  const entries = [];
  let offset = 6 + 16 * count;

  for (let i = 0; i < count; i++) {
    const buf = pngBuffers[i];
    const size = sizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // ColorCount (0)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes (1)
    entry.writeUInt16LE(32, 6); // BitCount (32)
    entry.writeUInt32LE(buf.length, 8); // BytesInRes
    entry.writeUInt32LE(offset, 12); // ImageOffset
    entries.push(entry);
    offset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function run() {
  try {
    console.log('Generating favicons...');

    // 1. Generate individual PNG sizes
    const sizes = [16, 32, 48, 180, 192, 512];
    const pngBuffers = {};

    for (const size of sizes) {
      const buffer = await sharp(LOGO_PATH)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toBuffer();
      
      pngBuffers[size] = buffer;

      // Save individual PNGs
      let filename;
      if (size === 180) {
        filename = 'apple-touch-icon.png';
      } else {
        filename = `favicon-${size}xsize.png`.replace('size', size);
      }
      
      const outputPath = path.join(PUBLIC_DIR, filename);
      fs.writeFileSync(outputPath, buffer);
      console.log(`Generated: ${filename} (${size}x${size})`);
    }

    // 2. Generate favicon.ico (combining 16, 32, and 48 sizes)
    const icoSizes = [16, 32, 48];
    const icoBuffers = icoSizes.map(size => pngBuffers[size]);
    const icoBuffer = createIco(icoBuffers, icoSizes);
    
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
    console.log('Generated: favicon.ico (multi-resolution 16x16, 32x32, 48x48)');

    console.log('Favicon generation completed successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

run();
