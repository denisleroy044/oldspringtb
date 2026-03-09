const { Client } = require('pg');

// Your connection string
const connectionString = 'postgresql://neondb_owner:npg_l5tqF7ETxWni@ep-ancient-breeze-ab7hwkm5.eu-west-2.aws.neon.tech/neondb?sslmode=require';

async function inspectDatabase() {
    const client = new Client({ connectionString });
    
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected successfully!\n');

        // Get all tables
        console.log('📋 TABLES IN DATABASE:');
        console.log('=====================');
        
        const tablesRes = await client.query(`
            SELECT 
                table_name,
                table_schema
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);

        if (tablesRes.rows.length === 0) {
            console.log('No tables found in database');
        } else {
            for (const table of tablesRes.rows) {
                console.log(`\n📌 Table: ${table.table_name}`);
                console.log(`   Schema: ${table.table_schema}`);
                
                // Get columns for this table
                const columnsRes = await client.query(`
                    SELECT 
                        column_name,
                        data_type,
                        is_nullable,
                        column_default
                    FROM information_schema.columns
                    WHERE table_name = $1
                    ORDER BY ordinal_position
                `, [table.table_name]);
                
                console.log('   Columns:');
                columnsRes.rows.forEach(col => {
                    const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
                    const defaultValue = col.column_default ? ` DEFAULT ${col.column_default}` : '';
                    console.log(`     • ${col.column_name} (${col.data_type}) ${nullable}${defaultValue}`);
                });

                // Get foreign keys
                const fkRes = await client.query(`
                    SELECT
                        kcu.column_name,
                        ccu.table_name AS foreign_table_name,
                        ccu.column_name AS foreign_column_name
                    FROM information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu
                        ON tc.constraint_name = kcu.constraint_name
                    JOIN information_schema.constraint_column_usage AS ccu
                        ON ccu.constraint_name = tc.constraint_name
                    WHERE tc.constraint_type = 'FOREIGN KEY'
                        AND tc.table_name = $1
                `, [table.table_name]);

                if (fkRes.rows.length > 0) {
                    console.log('   Foreign Keys:');
                    fkRes.rows.forEach(fk => {
                        console.log(`     • ${fk.column_name} -> ${fk.foreign_table_name}(${fk.foreign_column_name})`);
                    });
                }

                // Get row count
                const countRes = await client.query(`SELECT COUNT(*) FROM "${table.table_name}"`);
                console.log(`   Row count: ${countRes.rows[0].count}`);
            }
        }

        // Check for specific tables we need
        console.log('\n🔍 LOOKING FOR REQUIRED TABLES:');
        console.log('==============================');
        
        const requiredTables = ['users', 'accounts', 'transactions', 'loans', 'grants'];
        
        for (const tableName of requiredTables) {
            const exists = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = $1
                )
            `, [tableName]);
            
            if (exists.rows[0].exists) {
                console.log(`✅ ${tableName} table exists`);
                
                // Show sample data
                const sampleRes = await client.query(`SELECT * FROM "${tableName}" LIMIT 3`);
                if (sampleRes.rows.length > 0) {
                    console.log(`   Sample data (${sampleRes.rows.length} rows):`);
                    console.log('   ', JSON.stringify(sampleRes.rows[0], null, 2).split('\n').map(l => '   ' + l).join('\n'));
                }
            } else {
                console.log(`❌ ${tableName} table does not exist`);
            }
        }

        // Check your auth service's user table
        console.log('\n👤 CHECKING AUTH SERVICE TABLES:');
        console.log('===============================');
        
        // Look for tables that might contain user data
        const userTablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_name LIKE '%user%'
               OR table_name LIKE '%account%'
               OR table_name LIKE '%profile%'
            ORDER BY table_name
        `);
        
        if (userTablesRes.rows.length > 0) {
            console.log('Found user-related tables:');
            userTablesRes.rows.forEach(row => {
                console.log(`   • ${row.table_name}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

inspectDatabase().catch(console.error);
