#!/bin/bash

# Quick Fix for Missing Images

set -e

echo "🖼️ Fixing Missing Images"
echo "========================"

# Create public directory if it doesn't exist
mkdir -p public

# Check if templates folder exists in the current directory
if [ -d "templates" ]; then
    echo "📁 Found templates folder, copying to public..."
    cp -r templates public/
    echo "✅ Templates copied to public/templates/"
elif [ -d "../templates" ]; then
    echo "📁 Found templates folder in parent directory, copying..."
    cp -r ../templates public/
    echo "✅ Templates copied to public/templates/"
else
    echo "⚠️  Templates folder not found."
    echo "Please copy your templates folder to: public/templates/"
    echo ""
    echo "Run this command:"
    echo "  cp -r /path/to/your/templates/bank-pro public/templates/"
fi

# Create a simple placeholder image if needed
mkdir -p public/templates/bank-pro/uploads
mkdir -p public/templates/bank-pro/images/assets
mkdir -p public/templates/bank-pro/static-strip-icons
mkdir -p public/templates/bank-pro/prefooter-icons
mkdir -p public/templates/bank-pro/icons/footer-icons
mkdir -p public/templates/bank-pro/footer-images
mkdir -p public/templates/bank-pro/section-links
mkdir -p public/templates/bank-pro/learn-and-plan-images/personal-finance-101
mkdir -p public/templates/bank-pro/homepage-images

# Create a simple SVG placeholder for missing images
cat > public/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png << 'EOF'
<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="60" fill="#1e3a5f" rx="4"/>
  <text x="20" y="38" font-family="Arial" font-size="18" fill="white" font-weight="bold">Oldspring</text>
  <text x="120" y="38" font-family="Arial" font-size="18" fill="#e6a415" font-weight="bold">Trust</text>
</svg>
EOF

# Create placeholder icons
for icon in ico-clock.svg ico-star-circle.svg; do
  cat > "public/templates/bank-pro/images/assets/$icon" << 'EOF'
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="#1e3a5f" stroke-width="2"/>
  <path d="M12 6v6l4 2" stroke="#1e3a5f" stroke-width="2"/>
</svg>
EOF
done

# Create placeholder footer icons
for icon in citadel-credit-union-routing-number.svg call-citadel-credit-union.svg; do
  cat > "public/templates/bank-pro/icons/footer-icons/$icon" << 'EOF'
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="8" width="16" height="12" stroke="white" stroke-width="2"/>
  <circle cx="12" cy="14" r="2" fill="white"/>
</svg>
EOF
done

# Create placeholder for clock icon
cat > "public/templates/bank-pro/static-strip-icons/ico-clock-new.svg" << 'EOF'
<svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" stroke="#1e3a5f" stroke-width="2"/>
  <path d="M12 6v6l4 2" stroke="#1e3a5f" stroke-width="2"/>
</svg>
EOF

# Create placeholder for prefooter icon
cat > "public/templates/bank-pro/prefooter-icons/ico-star-circle.svg" << 'EOF'
<svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#e6a415"/>
</svg>
EOF

# Create placeholder for video icon
cat > "public/templates/bank-pro/footer-images/live-video-call.png" << 'EOF'
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="6" width="16" height="12" rx="2" stroke="white" stroke-width="2"/>
  <path d="M18 10l4-2v8l-4-2" stroke="white" stroke-width="2"/>
</svg>
EOF

# Create placeholder for section links
for icon in ico-check-account.svg ico-credit-cards.svg ico-loans.svg ico-businessbanking.svg ico-invest.svg ico-about.svg; do
  cat > "public/templates/bank-pro/section-links/$icon" << 'EOF'
<svg width="85" height="85" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="#e6e7e9"/>
  <path d="M12 6v6l4 2" stroke="#1e3a5f" stroke-width="2"/>
</svg>
EOF
done

# Create placeholder for homepage feature image
cat > "public/templates/bank-pro/homepage-images/feature.jpg" << 'EOF'
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#1e3a5f"/>
  <text x="200" y="200" font-family="Arial" font-size="24" fill="white" font-weight="bold">€300 Cash Back</text>
</svg>
EOF

# Create placeholder for learn and plan images
cat > "public/templates/bank-pro/learn-and-plan-images/personal-finance-101/unsplash.jpg" << 'EOF'
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f3f4f6"/>
  <text x="300" y="300" font-family="Arial" font-size="24" fill="#1e3a5f">Tax Tips</text>
</svg>
EOF

cat > "public/templates/bank-pro/learn-and-plan-images/personal-finance-101/8554477.jpg" << 'EOF'
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f3f4f6"/>
  <text x="250" y="300" font-family="Arial" font-size="24" fill="#1e3a5f">Checking Account</text>
</svg>
EOF

echo ""
echo "✅ Image placeholders created!"
echo ""
echo "📁 Your images are now available at:"
echo "   http://localhost:3000/templates/bank-pro/uploads/1682584899_6502d067c95383061f4a.png"
echo ""
echo "🚀 To use your real images:"
echo "   1. Copy your actual templates folder to: public/templates/"
echo "   2. Run: cp -r /path/to/your/templates/bank-pro public/templates/"
echo ""
echo "✅ The 404 errors should now be gone!"
EOF

chmod +x scripts/fix_images.sh

echo "Run: ./scripts/fix_images.sh"