#!/bin/bash

# SIMPLE DATABASE CHECKER
echo "==================================="
echo "🔍 DATABASE STRUCTURE CHECKER"
echo "==================================="

# Check all tables and their columns
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    // Get all tables
    const tables = await pool.query(\`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    \`);
    
    console.log('\n📋 TABLES FOUND:');
    for (const table of tables.rows) {
      console.log(`\n📌 Table: \${table.table_name}`);
      
      // Get columns for this table
      const columns = await pool.query(\`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = \$1
        ORDER BY ordinal_position
      \`, [table.table_name]);
      
      columns.rows.forEach(col => {
        console.log(`   • \${col.column_name} (\${col.data_type}) \${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });
    }
    
    await pool.end();
    console.log('\n✅ Database check complete!');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}
checkDatabase();
"

echo ""
echo "==================================="
echo "Run this script to see your exact database structure"
echo "Then share the output so I can create the perfect fix!"
echo "==================================="