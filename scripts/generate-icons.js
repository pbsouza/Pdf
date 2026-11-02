import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, pixelFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data with filter byte 0 at start of each scanline
  const rawLineSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rawLineSize);

  for (let y = 0; y < height; y++) {
    const lineStart = y * rawLineSize;
    rawData[lineStart] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const offset = lineStart + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      rawData[offset] = r;
      rawData[offset + 1] = g;
      rawData[offset + 2] = b;
      rawData[offset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Generate PDFpb App Icon
function drawPDFpbIcon(isMaskable = false) {
  return function(x, y, w, h) {
    const nx = x / w;
    const ny = y / h;

    // Background gradient: Crimson red #ba082c to dark wine #75031b
    const grad = ny;
    let r = Math.round(186 * (1 - grad * 0.4) + 117 * (grad * 0.4));
    let g = Math.round(8 * (1 - grad * 0.5) + 3 * (grad * 0.5));
    let b = Math.round(44 * (1 - grad * 0.4) + 27 * (grad * 0.4));
    let a = 255;

    // Corner rounding for regular icons (maskable is full bleed)
    if (!isMaskable) {
      const radius = 0.22;
      const dx = Math.min(nx, 1 - nx);
      const dy = Math.min(ny, 1 - ny);
      if (dx < radius && dy < radius) {
        const cornerDist = Math.hypot(radius - dx, radius - dy);
        if (cornerDist > radius) {
          const aa = Math.max(0, Math.min(1, radius - cornerDist + 1 / (w * 0.5)));
          return [0, 0, 0, Math.round(aa * 255)];
        }
      }
    }

    // Safe zone for icon content
    const scale = isMaskable ? 0.65 : 0.85;
    const cx = 0.5;
    const cy = 0.5;
    const px = (nx - cx) / scale + 0.5;
    const py = (ny - cy) / scale + 0.5;

    // Draw document sheet (white card with fold)
    const cardLeft = 0.22;
    const cardRight = 0.78;
    const cardTop = 0.18;
    const cardBottom = 0.82;
    const foldSize = 0.16;

    if (px >= cardLeft && px <= cardRight && py >= cardTop && py <= cardBottom) {
      // Check top-right fold corner
      const inFoldCorner = (px > cardRight - foldSize) && (py < cardTop + foldSize);
      const isFoldFlap = (px - (cardRight - foldSize)) + (py - cardTop) > foldSize;

      if (!inFoldCorner || !isFoldFlap) {
        // Document Card Body (crisp clean white sheet)
        let cr = 255;
        let cg = 255;
        let cb = 255;

        // Subtle gradient on paper
        const paperShade = (py - cardTop) / (cardBottom - cardTop);
        cr = Math.round(255 - paperShade * 8);
        cg = Math.round(255 - paperShade * 8);
        cb = Math.round(255 - paperShade * 6);

        // Fold corner accent
        if (inFoldCorner && !isFoldFlap) {
          cr = 220;
          cg = 225;
          cb = 230;
        }

        // Inner Red Badge for "PDFpb"
        const badgeLeft = 0.28;
        const badgeRight = 0.72;
        const badgeTop = 0.38;
        const badgeBottom = 0.64;

        if (px >= badgeLeft && px <= badgeRight && py >= badgeTop && py <= badgeBottom) {
          // Crimson badge
          cr = 183;
          cg = 2;
          cb = 40;

          // Horizontal lines inside representing "PDF" text lines
          const lineY = (py - badgeTop) / (badgeBottom - badgeTop);
          if ((lineY >= 0.32 && lineY <= 0.42 && px >= 0.34 && px <= 0.66) ||
              (lineY >= 0.58 && lineY <= 0.68 && px >= 0.34 && px <= 0.58)) {
            cr = 255;
            cg = 255;
            cb = 255;
          }
        }

        // Form checkboxes simulation at bottom of sheet
        const checkY = 0.72;
        if (Math.abs(py - checkY) < 0.03 && px >= 0.30 && px <= 0.36) {
          cr = 183;
          cg = 2;
          cb = 40;
        }
        if (Math.abs(py - checkY) < 0.015 && px >= 0.40 && px <= 0.70) {
          cr = 160;
          cg = 165;
          cb = 175;
        }

        return [cr, cg, cb, 255];
      } else {
        // Fold shadow/flap
        return [200, 205, 215, 255];
      }
    }

    return [r, g, b, a];
  };
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating real PNG icons for PDFpb...');

const sizes = [
  { file: 'pwa-192x192.png', size: 192, maskable: false },
  { file: 'pwa-512x512.png', size: 512, maskable: false },
  { file: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { file: 'apple-touch-icon.png', size: 180, maskable: false },
  { file: 'favicon.png', size: 64, maskable: false },
  { file: 'favicon-32x32.png', size: 32, maskable: false },
];

for (const { file, size, maskable } of sizes) {
  const pngBuf = createPng(size, size, drawPDFpbIcon(maskable));
  const outPath = path.join(publicDir, file);
  fs.writeFileSync(outPath, pngBuf);
  console.log(`Created ${file} (${size}x${size}, ${pngBuf.length} bytes)`);
}

// Copy favicon.png as favicon.ico so browsers looking for .ico find it
fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(publicDir, 'favicon.ico'));
console.log('Created favicon.ico fallback');
console.log('All real PNG icons generated successfully!');
