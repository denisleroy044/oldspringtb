const fs = require('fs');
const path = require('path');

// List of all dashboard page files to update
const files = [
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/calendar/page.tsx',
  'src/app/dashboard/goals/page.tsx',
  'src/app/dashboard/savings/page.tsx',
  'src/app/dashboard/bills/page.tsx',
  'src/app/dashboard/loans/page.tsx',
  'src/app/dashboard/grants/page.tsx',
  'src/app/dashboard/tax-refund/page.tsx',
  'src/app/dashboard/statements/page.tsx',
  'src/app/dashboard/withdraw/page.tsx',
  'src/app/dashboard/withdrawals/page.tsx',
  'src/app/dashboard/swap/page.tsx',
  'src/app/dashboard/swap/history/page.tsx',
  'src/components/dashboard/Header.tsx',
  'src/components/dashboard/Sidebar.tsx'
];

// Pattern to match gradient button classes
const buttonPatterns = [
  {
    pattern: /className="([^"]*)bg-gradient-to-r from-deep-teal to-sage([^"]*)"/g,
    replacement: 'className="$1bg-gradient-to-r from-deep-teal to-sage btn-shimmer$2"'
  },
  {
    pattern: /className="([^"]*)bg-gradient-to-r from-deep-teal to-sage text-white([^"]*)"/g,
    replacement: 'className="$1bg-gradient-to-r from-deep-teal to-sage text-white btn-shimmer$2"'
  },
  {
    pattern: /className="([^"]*)bg-deep-teal text-white([^"]*)"/g,
    replacement: 'className="$1bg-deep-teal text-white btn-shimmer$2"'
  },
  {
    pattern: /className="([^"]*)bg-soft-gold text-white([^"]*)"/g,
    replacement: 'className="$1bg-soft-gold text-white btn-shimmer$2"'
  },
  {
    pattern: /className="([^"]*)bg-gradient-to-r from-deep-teal to-sage rounded-lg([^"]*)"/g,
    replacement: 'className="$1bg-gradient-to-r from-deep-teal to-sage rounded-lg btn-shimmer$2"'
  },
  // For floating action buttons
  {
    pattern: /className="([^"]*)fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-deep-teal to-sage text-white rounded-full shadow-lg([^"]*)"/g,
    replacement: 'className="$1fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-deep-teal to-sage text-white rounded-full shadow-lg btn-pulse$2"'
  }
];

console.log('🔍 Adding shimmer effect to buttons...\n');

files.forEach(filePath => {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${filePath} (file not found)`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let modified = false;

    buttonPatterns.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
    } else {
      console.log(`📝 No changes needed in ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err.message);
  }
});

console.log('\n🎉 Shimmer effect added to all buttons!');
console.log('📋 Now restart your dev server: npm run dev');
