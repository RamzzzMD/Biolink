delete process.env.FONTCONFIG_PATH;
delete process.env.FONTCONFIG_FILE;

import sharp from 'sharp';
import axios from 'axios';

// Fungsi untuk mengambil gambar dari URL dan mengubahnya menjadi Buffer
async function loadImageFromURL(url) {
  if (!url) return null;
  if (Buffer.isBuffer(url)) return url;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 4000 });
    return Buffer.from(response.data, 'binary');
  } catch (err) {
    return null;
  }
}

// Fungsi untuk memotong teks jika terlalu panjang
function truncateText(text, maxChars = 20) {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 3).trim() + '...';
}

// Fungsi untuk membuat baris baru (wrap text) agar teks tidak keluar batas kartu
function wrapText(text, maxCharsPerLine = 22) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

// Fungsi untuk menghindari error karakter khusus pada SVG
const escapeXml = (unsafe) => (unsafe || "").replace(/[<>&'"]/g, c => {
  switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
  }
});

// Fungsi utama untuk menggambar Kartu Spotify
export async function drawCardSpotify({ bg, cover, title, artist }) {
  const width = 320;
  const height = 420;
  const cardX = 20;
  const cardY = 20;
  const cardWidth = 280;
  const cardHeight = 380;
  const radius = 20;

  let baseImageBuffer;
  let bgColor = '#222222';

  const coverBuffer = await loadImageFromURL(cover);
  let dominantColor = bgColor;
  
  // Mencari warna dominan dari cover album untuk dijadikan background jika tidak ada background custom
  if (coverBuffer) {
     try {
       const stats = await sharp(coverBuffer).stats();
       const { r, g, b } = stats.dominant;
       dominantColor = `rgb(${r}, ${g}, ${b})`;
     } catch (e) { }
  }

  // Jika background custom diberikan, gunakan itu
  if (bg) {
    const bgBuffer = await loadImageFromURL(bg);
    if (bgBuffer) {
      baseImageBuffer = await sharp(bgBuffer).resize(width, height, { fit: 'cover' }).toBuffer();
    }
  }
  
  // Jika tidak ada background custom, gunakan warna dominan dari cover
  if (!baseImageBuffer && coverBuffer) {
      baseImageBuffer = await sharp({ create: { width, height, channels: 4, background: dominantColor } }).png().toBuffer();
  }
  
  // Fallback jika tidak ada cover & tidak ada background
  if (!baseImageBuffer) {
      baseImageBuffer = await sharp({ create: { width, height, channels: 4, background: bgColor } }).png().toBuffer();
  }

  const composites = [];

  // 1. Gambar kotak background transparan untuk area kartu
  const cardSvg = `<svg width="${width}" height="${height}">
    <rect x="${cardX}" y="${cardY}" width="${cardWidth}" height="${cardHeight}" rx="${radius}" ry="${radius}" fill="rgba(0, 0, 0, 0.7)" />
  </svg>`;
  composites.push({ input: Buffer.from(cardSvg), top: 0, left: 0 });

  // 2. Gambar Cover Album Spotify
  if (coverBuffer) {
    const resizedCover = await sharp(coverBuffer).resize(240, 240, { fit: 'cover' }).toBuffer();
    composites.push({
      input: resizedCover,
      left: cardX + 20,
      top: cardY + 20
    });
  }

  // 3. Persiapkan teks Judul dan Artis
  let titleLines = wrapText(truncateText(title || "", 26), 20);
  let artistLines = wrapText(truncateText(artist || ""), 28);
  
  let currentY = cardY + 282;
  let textSvgStr = `<svg width="${width}" height="${height}">
    <style> 
      .t { font-family: sans-serif; font-weight: bold; font-size: 22px; fill: white; } 
      .a { font-family: sans-serif; font-size: 16px; fill: rgba(255, 255, 255, 0.8); } 
    </style>
  `;

  // Tulis Judul Lagu
  for (const line of titleLines) {
      textSvgStr += `<text x="${cardX + 20}" y="${currentY}" class="t">${escapeXml(line)}</text>`;
      currentY += 26;
  }

  currentY += 2;

  // Tulis Nama Artis
  for (const line of artistLines) {
      textSvgStr += `<text x="${cardX + 20}" y="${currentY}" class="a">${escapeXml(line)}</text>`;
      currentY += 20;
  }

  // Tambahkan Label Logo Spotify
  textSvgStr += `<text x="${cardX + 40}" y="${cardY + 370}" font-family="sans-serif" font-weight="bold" font-size="14px" fill="white">Spotify</text>
  </svg>`;

  composites.push({ input: Buffer.from(textSvgStr), top: 0, left: 0 });

  // 4. Tambahkan Icon / Logo Spotify asli
  const logoUrl = "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White-300x300.png";
  const logoBuffer = await loadImageFromURL(logoUrl);
  if (logoBuffer) {
    const logoResized = await sharp(logoBuffer).resize(20, 20).toBuffer();
    composites.push({ input: logoResized, top: cardY + 354, left: cardX + 14 });
  }

  // Gabungkan semua komponen menjadi satu gambar final
  const finalBuffer = await sharp(baseImageBuffer).composite(composites).png().toBuffer();

  return finalBuffer;
}
