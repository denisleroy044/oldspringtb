// Test database connection
// Run with: node test-db-connection.js

const fs = require('fs');
const path = require('path');

// Try to load environment variables
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    try {
        require('dotenv').config();
    } catch (e) {}
}

console.log('🔍 Testing database connections...\n');

// Check environment variables
console.log('📋 Environment variables:');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Not set');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not set');
console.log('   POSTGRES_URL:', process.env.POSTGRES_URL ? '✓ Set' : '✗ Not set');
console.log('   MYSQL_URL:', process.env.MYSQL_URL ? '✓ Set' : '✗ Not set');
console.log('');

// Try to connect to different databases
async function testConnections() {
    // Test PostgreSQL
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgres')) {
        try {
            const { Pool } = require('pg');
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const res = await pool.query('SELECT NOW()');
            console.log('✅ PostgreSQL: Connected successfully');
            console.log('   Server time:', res.rows[0].now);
            
            // Try to list tables
            try {
                const tables = await pool.query(`
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                `);
                console.log('   Tables:', tables.rows.map(t => t.table_name).join(', '));
            } catch (e) {
                console.log('   Could not list tables');
            }
            
            await pool.end();
        } catch (e) {
            console.log('❌ PostgreSQL:', e.message);
        }
    }

    // Test MongoDB
    if (process.env.MONGODB_URI) {
        try {
            const { MongoClient } = require('mongodb');
            const client = new MongoClient(process.env.MONGODB_URI);
            await client.connect();
            console.log('✅ MongoDB: Connected successfully');
            
            // List databases
            const dbs = await client.db().admin().listDatabases();
            console.log('   Databases:', dbs.databases.map(d => d.name).join(', '));
            
            await client.close();
        } catch (e) {
            console.log('❌ MongoDB:', e.message);
        }
    }

    // Test SQLite
    if (fs.existsSync('./prisma/dev.db') || fs.existsSync('./data.db')) {
        try {
            const sqlite3 = require('sqlite3').verbose();
            const dbFile = fs.existsSync('./prisma/dev.db') ? './prisma/dev.db' : './data.db';
            const db = new sqlite3.Database(dbFile);
            
            db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
                if (err) {
                    console.log('❌ SQLite:', err.message);
                } else {
                    console.log('✅ SQLite: Connected successfully');
                    console.log('   Tables:', tables.map(t => t.name).join(', '));
                }
                db.close();
            });
        } catch (e) {
            console.log('❌ SQLite:', e.message);
        }
    }
}

testConnections().catch(console.error);
