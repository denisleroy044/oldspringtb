#!/bin/bash

# Fix Tailwind CSS v4 Configuration

set -e

echo "🔧 Fixing Tailwind CSS v4 Configuration"
echo "======================================"

# ============================================
# UPDATE GLOBAL CSS FOR V4
# ============================================
cat > src/app/globals.css << 'EOF'
@import "tailwindcss";

@theme {
  --color-primary: #1e3a5f;
  --color-primary-dark: #0f2a44;
  --color-primary-light: #2b4c7a;
  --color-accent: #e68a2e;
  --color-accent-light: #f5a344;
  --color-gray-bg: #f8fafc;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
}

@layer base {
  * {
    @apply border-gray-200;
  }
  
  body {
    @apply antialiased;
    color: var(--color-gray-800);
  }
}

@layer components {
  .container-custom {
    max-width: 80rem;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  @media (min-width: 640px) {
    .container-custom {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }
  
  @media (min-width: 1024px) {
    .container-custom {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
  
  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition-property: background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  .btn-primary:hover {
    background-color: var(--color-primary-light);
  }
  
  .btn-outline {
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  .btn-outline:hover {
    background-color: var(--color-primary);
    color: white;
  }
  
  .card {
    background-color: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    transition-property: box-shadow;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
  }
  
  .card:hover {
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  }
  
  .section-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 3rem;
    text-align: center;
  }
  
  @media (min-width: 768px) {
    .section-title {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
  }
}
EOF

# ============================================
# UPDATE POSTCSS CONFIG FOR V4
# ============================================
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
EOF

# ============================================
# UPDATE TAILWIND CONFIG (optional but good to have)
# ============================================
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# ============================================
# UPDATE PACKAGE.JSON TO ENSURE CORRECT DEPENDENCIES
# ============================================
echo "📦 Ensuring correct Tailwind v4 dependencies..."

# Install/update to Tailwind v4
npm install -D @tailwindcss/postcss tailwindcss@next postcss

echo ""
echo "✅ Tailwind CSS v4 Configuration Fixed!"
echo "======================================="
echo ""
echo "The issue was: Using v3 directives (@tailwind) with v4"
echo "The fix: Using v4 syntax (@import \"tailwindcss\")"
echo ""
echo "🚀 Next steps:"
echo "   npm run dev"
echo ""
echo "Your app should now compile without errors!"
EOF

chmod +x scripts/fix_tailwind_v4.sh

echo "Run: ./scripts/fix_tailwind_v4.sh"