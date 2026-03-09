const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/images/3d');
const outputDir = path.join(__dirname, '../public/images/3d/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all PNG files
const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

files.forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);
  
  sharp(inputPath)
    .resize(200, 200, { fit: 'inside' }) // Resize to max 200x200
    .png({ quality: 80, compressionLevel: 9 })
    .toFile(outputPath)
    .then(() => {
      console.log(`✅ Optimized: ${file}`);
    })
    .catch(err => {
      console.error(`❌ Error optimizing ${file}:`, err);
    });
});
