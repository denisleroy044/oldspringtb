require('dotenv').config();
const { Pool } = require('pg');
const dns = require('dns');
const net = require('net');

async function diagnoseConnection() {
  console.log('🔍 Database Connection Diagnostic Tool');
  console.log('=======================================\n');

  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    return;
  }

  // Parse the connection string
  const url = new URL(process.env.DATABASE_URL);
  const host = url.hostname;
  const port = parseInt(url.port) || 5432;
  const database = url.pathname.substring(1);
  const username = url.username;

  console.log('📋 Connection Details:');
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Database: ${database}`);
  console.log(`   User: ${username}`);
  console.log(`   SSL: ${url.searchParams.get('sslmode') || 'require'}`);
  console.log('');

  // Test DNS resolution
  console.log('📡 Testing DNS resolution...');
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.resolve4(host, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
    console.log(`✅ DNS resolved to: ${addresses.join(', ')}`);
  } catch (err) {
    console.error(`❌ DNS resolution failed: ${err.message}`);
  }
  console.log('');

  // Test TCP connection
  console.log('🔌 Testing TCP connection...');
  const socket = new net.Socket();
  
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        socket.destroy();
        reject(new Error('Connection timeout'));
      }, 5000);

      socket.connect(port, host, () => {
        clearTimeout(timeout);
        socket.destroy();
        resolve(true);
      });

      socket.on('error', (err) => {
        clearTimeout(timeout);
        socket.destroy();
        reject(err);
      });
    });
    console.log('✅ TCP connection successful');
  } catch (err) {
    console.error(`❌ TCP connection failed: ${err.message}`);
    console.log('\n🔧 Possible solutions:');
    console.log('   1. Check if your IP is whitelisted in Neon dashboard');
    console.log('   2. Check if the database is paused/sleeping');
    console.log('   3. Try using the connection pooler URL instead');
    console.log('   4. Check firewall/network restrictions');
  }
  console.log('');

  // Test PostgreSQL connection with different SSL modes
  console.log('🔄 Testing PostgreSQL connection with different SSL modes...');
  
  const sslModes = [
    { ssl: { rejectUnauthorized: false }, name: 'rejectUnauthorized: false' },
    { ssl: true, name: 'ssl: true' },
    { ssl: { rejectUnauthorized: true }, name: 'rejectUnauthorized: true' }
  ];

  for (const mode of sslModes) {
    try {
      console.log(`\n   Trying ${mode.name}...`);
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ...mode,
        connectionTimeoutMillis: 5000
      });
      
      const res = await pool.query('SELECT 1 as test');
      console.log(`   ✅ Connection successful with ${mode.name}`);
      await pool.end();
      break;
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }
  }

  // Suggest using connection pooler if direct connection fails
  if (host.includes('neon.tech') && !host.includes('-pooler')) {
    console.log('\n💡 Tip: You might need to use the connection pooler URL:');
    console.log(`   Original: ${host}`);
    console.log(`   Pooler:   ${host.replace('.tech', '-pooler.tech')}`);
    console.log('\n   Add -pooler to the hostname in your DATABASE_URL');
  }
}

diagnoseConnection().catch(console.error);
