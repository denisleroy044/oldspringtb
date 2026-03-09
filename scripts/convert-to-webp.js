const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '../public/images/illustrations');
const outputDir = path.join(__dirname, '../public/images/illustrations/webp');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert all SVG files to WebP
fs.readdirSync(svgDir).forEach(file => {
  if (file.endsWith('.svg')) {
    const inputPath = path.join(svgDir, file);
    const outputPath = path.join(outputDir, file.replace('.svg', '.webp'));
    
    sharp(inputPath)
      .webp({ quality: 92 })
      .toFile(outputPath)
      .then(() => console.log(`✅ Converted ${file} to WebP`))
      .catch(err => console.error(`❌ Error converting ${file}:`, err));
  }
});
