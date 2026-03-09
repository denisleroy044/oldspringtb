const fs = require('fs');
const path = require('path');

// Define all expected image paths
const images = [
  { path: 'public/images/logo/logo.png', type: 'logo' },
  { path: 'public/images/logo/favicon.png', type: 'favicon' },
  { path: 'public/images/3d/glasssafe.png', type: '3d' },
  { path: 'public/images/3d/glassaccount.png', type: '3d' },
  { path: 'public/images/3d/glasscreditcard.png', type: '3d' },
  { path: 'public/images/3d/glasssecure.png', type: '3d' },
  { path: 'public/images/3d/glassbusiness.png', type: '3d' },
  { path: 'public/images/3d/moneybag.png', type: '3d' },
  { path: 'public/images/3d/routing.png', type: '3d' },
  { path: 'public/images/3d/time.png', type: '3d' },
  { path: 'public/images/3d/email.png', type: '3d' },
  { path: 'public/images/3d/location.png', type: '3d' },
  { path: 'public/images/licenses/us-fdic.png', type: 'license' },
  { path: 'public/images/licenses/ncua-cert.png', type: 'license' },
  { path: 'public/images/licenses/ncua-lender.png', type: 'license' },
];

console.log('🔍 Checking images...\n');

let missingCount = 0;
let validCount = 0;

// Create directories if they don't exist
const dirs = [
  'public/images/logo',
  'public/images/3d',
  'public/images/licenses'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Check each image
images.forEach(img => {
  const fullPath = path.join(process.cwd(), img.path);
  
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const fileSizeInKB = stats.size / 1024;
    
    if (stats.size > 0) {
      console.log(`✅ ${img.path} - OK (${fileSizeInKB.toFixed(2)} KB)`);
      validCount++;
    } else {
      console.log(`⚠️ ${img.path} - File exists but is empty (0 KB)`);
      missingCount++;
    }
  } else {
    console.log(`❌ ${img.path} - MISSING`);
    missingCount++;
  }
});

console.log(`\n📊 Summary: ${validCount} valid, ${missingCount} missing/empty`);

// Create placeholder images for missing ones
if (missingCount > 0) {
  console.log('\n🛠️ Creating placeholder images for missing files...');
  
  // Create a simple 1x1 transparent PNG as base64
  const transparentPixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  
  // SVG placeholders for different image types
  const placeholders = {
    logo: `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="60" fill="#0A5C5E"/><text x="20" y="38" font-family="Arial" font-size="20" fill="white">Oldspring</text></svg>`,
    favicon: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#0A5C5E"/><text x="8" y="22" font-family="Arial" font-size="16" fill="white">O</text></svg>`,
    '3d': `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="60" fill="#E8B86C" fill-opacity="0.2"/><circle cx="30" cy="30" r="20" fill="#0A5C5E"/><text x="30" y="40" font-family="Arial" font-size="20" fill="white" text-anchor="middle">3D</text></svg>`,
    license: `<svg width="100" height="40" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="40" fill="#7C9A6E"/><text x="10" y="26" font-family="Arial" font-size="14" fill="white">License</text></svg>`
  };
  
  images.forEach(img => {
    const fullPath = path.join(process.cwd(), img.path);
    
    if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size === 0) {
      try {
        // Create SVG placeholder based on type
        const placeholder = placeholders[img.type] || placeholders['3d'];
        fs.writeFileSync(fullPath.replace('.png', '.svg'), placeholder);
        
        // Also create a simple PNG placeholder (just copy the transparent pixel)
        fs.writeFileSync(fullPath, transparentPixel);
        
        console.log(`  ✓ Created placeholder for ${img.path}`);
      } catch (err) {
        console.log(`  ✗ Failed to create placeholder for ${img.path}: ${err.message}`);
      }
    }
  });
  
  console.log('\n✅ Placeholder images created. Replace them with your actual images later.');
}

// Create a simple HTML report
const report = `
<!DOCTYPE html>
<html>
<head>
  <title>Image Check Report</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #f5f5f5; }
    .report { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
    .good { color: green; }
    .bad { color: red; }
    .warning { color: orange; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f0f0f0; }
    img { max-width: 50px; max-height: 50px; }
  </style>
</head>
<body>
  <div class="report">
    <h1>Image Check Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Summary: <span class="good">${validCount} valid</span>, <span class="bad">${missingCount} missing/empty</span></p>
    
    <table>
      <tr>
        <th>Image</th>
        <th>Status</th>
        <th>Preview</th>
      </tr>
      ${images.map(img => {
        const exists = fs.existsSync(path.join(process.cwd(), img.path));
        const size = exists ? fs.statSync(path.join(process.cwd(), img.path)).size : 0;
        const status = exists && size > 0 ? '✅ OK' : exists ? '⚠️ Empty' : '❌ Missing';
        const statusClass = exists && size > 0 ? 'good' : 'bad';
        
        return `
        <tr>
          <td>${img.path}</td>
          <td class="${statusClass}">${status}</td>
          <td><img src="/${img.path}" onerror="this.style.display='none'"></td>
        </tr>
        `;
      }).join('')}
    </table>
    
    <p>Note: Missing images have been replaced with placeholders. Replace them with your actual images.</p>
  </div>
</body>
</html>
`;

fs.writeFileSync('public/image-report.html', report);
console.log('\n📊 Report generated: public/image-report.html');
console.log('   Open http://localhost:3000/image-report.html to view');

