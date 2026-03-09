const fs = require('fs');
const path = require('path');

const depositsApiPath = 'src/app/api/deposits/route.ts';

console.log('🔧 Applying temporary fix to deposits API...');

try {
  let content = fs.readFileSync(depositsApiPath, 'utf8');
  
  // Replace the table check section to automatically create the table
  const tableCheckRegex = /\/\/ Check if deposits table exists[\s\S]*?catch \(tableError\) \{[\s\S]*?return NextResponse\.json\([\s\S]*?\{[\s\S]*?error: 'Deposits system is being set up[^}]*\}[^}]*\}, { status: 503 \}/;
  
  const replacement = `// Check if deposits table exists and create it if needed
    try {
      await query(\`SELECT 1 FROM deposits LIMIT 1\`)
    } catch (tableError) {
      console.log('Deposits table not found, attempting to create...');
      
      try {
        await query(\`
          CREATE TABLE IF NOT EXISTS deposits (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
            "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            "accountId" TEXT REFERENCES accounts(id) ON DELETE SET NULL,
            amount DECIMAL(10,2) NOT NULL,
            method TEXT NOT NULL,
            currency TEXT DEFAULT 'USD',
            "cryptoCurrency" TEXT,
            "paymentDetails" JSONB,
            "transactionId" TEXT,
            "senderInfo" TEXT,
            "adminNotes" TEXT,
            status TEXT DEFAULT 'PENDING',
            "approvedBy" TEXT,
            "approvedAt" TIMESTAMP,
            "completedAt" TIMESTAMP,
            "createdAt" TIMESTAMP DEFAULT NOW(),
            "updatedAt" TIMESTAMP DEFAULT NOW()
          )
        \`)
        
        await query(\`
          CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits("userId");
          CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
        \`)
        
        console.log('✅ Deposits table created automatically')
      } catch (createError) {
        console.error('Failed to create deposits table:', createError)
        return NextResponse.json({ 
          error: 'Deposits system is being set up. Please try again in a few minutes.',
          code: 'TABLE_NOT_READY'
        }, { status: 503 })
      }
    }`;
  
  content = content.replace(tableCheckRegex, replacement);
  
  fs.writeFileSync(depositsApiPath, content, 'utf8');
  console.log('✅ Deposits API updated with auto-creation feature');
  
} catch (err) {
  console.error('❌ Error:', err.message);
}
