const fs = require('fs');
const path = require('path');

const requiredFiles = [
  // Admin pages
  'src/app/admin/dashboard/page.tsx',
  'src/app/admin/users/page.tsx',
  'src/app/admin/transactions/page.tsx',
  'src/app/admin/loans/page.tsx',
  'src/app/admin/grants/page.tsx',
  'src/app/admin/bills/page.tsx',
  'src/app/admin/tickets/page.tsx',
  'src/app/admin/live-chat/page.tsx',
  'src/app/admin/settings/page.tsx',
  
  // Admin APIs
  'src/app/api/admin/stats/route.ts',
  'src/app/api/admin/notifications/route.ts',
  'src/app/api/admin/users/route.ts',
  'src/app/api/admin/loans/route.ts',
  'src/app/api/admin/grants/route.ts',
  'src/app/api/admin/bills/route.ts',
  'src/app/api/admin/tickets/route.ts',
  'src/app/api/admin/live-chat/route.ts',
  
  // Auth APIs
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/me/route.ts',
  'src/app/api/auth/logout/route.ts',
  
  // Proxy
  'src/proxy.ts'
];

console.log('🔍 Checking admin files...\n');

let missing = [];
let existing = [];

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    existing.push(file);
    console.log(`✅ ${file}`);
  } else {
    missing.push(file);
    console.log(`❌ ${file}`);
  }
});

console.log('\n📊 Summary:');
console.log(`   Existing: ${existing.length}`);
console.log(`   Missing: ${missing.length}`);

if (missing.length > 0) {
  console.log('\n❌ Missing files:');
  missing.forEach(file => console.log(`   - ${file}`));
}

// Check if admin layout exists
const layoutPath = path.join(process.cwd(), 'src/app/admin/layout.tsx');
if (fs.existsSync(layoutPath)) {
  console.log('\n✅ Admin layout exists');
} else {
  console.log('\n❌ Admin layout missing');
}

// Check proxy file
const proxyPath = path.join(process.cwd(), 'src/proxy.ts');
if (fs.existsSync(proxyPath)) {
  console.log('\n✅ Proxy file exists');
} else {
  console.log('\n❌ Proxy file missing');
}

console.log('\n🔧 To fix missing files, run the admin setup script.');
