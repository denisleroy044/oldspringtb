const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_l5tqF7ETxWni@ep-ancient-breeze-ab7hwkm5.eu-west-2.aws.neon.tech/neondb?sslmode=require';

async function debug() {
    const client = new Client({ connectionString });
    
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // List all schemas
        console.log('📋 AVAILABLE SCHEMAS:');
        const schemas = await client.query(`
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
            ORDER BY schema_name
        `);
        schemas.rows.forEach(s => console.log(`   • ${s.schema_name}`));
        console.log('');

        // Check neon_auth schema
        console.log('🔍 CHECKING neon_auth SCHEMA:');
        
        // List tables in neon_auth
        const authTables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'neon_auth'
            ORDER BY table_name
        `);
        
        if (authTables.rows.length === 0) {
            console.log('   No tables found in neon_auth schema');
        } else {
            console.log('   Tables in neon_auth:');
            for (const table of authTables.rows) {
                console.log(`   • ${table.table_name}`);
                
                // Get column info
                const columns = await client.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_schema = 'neon_auth' 
                    AND table_name = $1
                    ORDER BY ordinal_position
                `, [table.table_name]);
                
                console.log(`     Columns: ${columns.rows.map(c => c.column_name).join(', ')}`);
                
                // Get row count
                const count = await client.query(`SELECT COUNT(*) FROM neon_auth.${table.table_name}`);
                console.log(`     Rows: ${count.rows[0].count}`);
                
                // Show sample data if any
                if (parseInt(count.rows[0].count) > 0) {
                    const sample = await client.query(`SELECT * FROM neon_auth.${table.table_name} LIMIT 1`);
                    console.log(`     Sample:`, sample.rows[0]);
                }
                console.log('');
            }
        }

        // Check public schema
        console.log('🔍 CHECKING public SCHEMA:');
        
        const publicTables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        
        if (publicTables.rows.length === 0) {
            console.log('   No tables found in public schema');
        } else {
            console.log('   Tables in public:');
            for (const table of publicTables.rows) {
                console.log(`   • ${table.table_name}`);
                
                const count = await client.query(`SELECT COUNT(*) FROM public.${table.table_name}`);
                console.log(`     Rows: ${count.rows[0].count}`);
            }
        }

        // Try to find users anywhere
        console.log('\n🔍 SEARCHING FOR USERS ACROSS ALL TABLES:');
        
        // Search all tables for email columns
        const emailColumns = await client.query(`
            SELECT table_schema, table_name, column_name
            FROM information_schema.columns
            WHERE column_name LIKE '%mail%'
               OR column_name LIKE '%email%'
               OR column_name = 'email'
            ORDER BY table_schema, table_name
        `);
        
        if (emailColumns.rows.length > 0) {
            console.log('   Tables with email columns:');
            for (const col of emailColumns.rows) {
                console.log(`   • ${col.table_schema}.${col.table_name}.${col.column_name}`);
                
                // Check if there's data
                const data = await client.query(
                    `SELECT ${col.column_name} FROM ${col.table_schema}.${col.table_name} LIMIT 3`
                );
                if (data.rows.length > 0) {
                    console.log(`     Sample emails: ${data.rows.map(r => r[col.column_name]).join(', ')}`);
                }
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

debug();
