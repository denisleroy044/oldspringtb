#!/bin/bash

# Database Inspector - See what tables and data you actually have

set -e

echo "🔍 DATABASE INSPECTOR"
echo "====================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() { echo -e "${BLUE}📁 $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ️ $1${NC}"; }

# ============================================
# Check for database configuration
# ============================================
print_header "Checking for database configuration..."

# Check for .env file
if [ -f ".env" ]; then
    print_success "Found .env file"
    echo "📄 .env contains:"
    grep -E "DATABASE|MONGODB|POSTGRES|MYSQL|DB_" .env | sed 's/\(.*password=\)\([^@]*\)\(.*\)/\1******\3/g' || true
elif [ -f ".env.local" ]; then
    print_success "Found .env.local file"
    echo "📄 .env.local contains:"
    grep -E "DATABASE|MONGODB|POSTGRES|MYSQL|DB_" .env.local | sed 's/\(.*password=\)\([^@]*\)\(.*\)/\1******\3/g' || true
else
    print_error "No .env or .env.local file found"
fi

echo ""

# ============================================
# Check for Prisma
# ============================================
print_header "Checking for Prisma..."

if [ -f "prisma/schema.prisma" ]; then
    print_success "Found Prisma schema"
    echo "📄 Prisma schema contains:"
    cat prisma/schema.prisma | grep -E "model|id|email|balance|user" | head -20
    
    # Check if prisma client is installed
    if [ -d "node_modules/.prisma" ]; then
        print_success "Prisma client is installed"
    else
        print_info "Prisma client not installed. Run: npm install @prisma/client"
    fi
    
    # Try to introspect the database
    echo ""
    print_info "Attempting to introspect database..."
    if command -v npx &> /dev/null; then
        npx prisma db pull --print > /tmp/prisma-introspect.txt 2>&1 || true
        if [ -s /tmp/prisma-introspect.txt ]; then
            echo "📊 Database schema from introspection:"
            cat /tmp/prisma-introspect.txt | grep -E "model|id|email|balance|transaction" | head -30
        fi
    fi
else
    print_info "No Prisma schema found"
fi

echo ""

# ============================================
# Check for MongoDB
# ============================================
print_header "Checking for MongoDB..."

if [ -f "node_modules/mongoose/package.json" ]; then
    print_success "Found Mongoose installed"
    
    # Look for mongoose models
    echo "🔍 Looking for Mongoose models..."
    find src -name "*.model.ts" -o -name "*.model.js" -o -name "models/*.ts" -o -name "models/*.js" 2>/dev/null | head -10 || true
fi

echo ""

# ============================================
# Check for SQL databases
# ============================================
print_header "Checking for SQL databases..."

if [ -f "node_modules/pg/package.json" ]; then
    print_success "Found PostgreSQL client (pg) installed"
fi

if [ -f "node_modules/mysql2/package.json" ]; then
    print_success "Found MySQL client (mysql2) installed"
fi

if [ -f "node_modules/sqlite3/package.json" ]; then
    print_success "Found SQLite3 installed"
    
    # Look for SQLite database files
    echo "🔍 Looking for SQLite database files..."
    find . -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" 2>/dev/null | head -10 || true
fi

echo ""

# ============================================
# Check your auth service for user structure
# ============================================
print_header "Checking your auth service..."

if [ -f "src/lib/auth/authService.ts" ]; then
    print_success "Found auth service"
    echo "📄 Auth service exports:"
    grep -E "^export (const|function|class|let|var)" src/lib/auth/authService.ts | sed 's/^/   /'
    
    echo ""
    echo "📄 User interface/type in auth service:"
    grep -E "interface User|type User|export type User|export interface User" -A 10 src/lib/auth/authService.ts || true
    
    echo ""
    echo "📄 Sample user data structure:"
    grep -E "const users|let users|users =|user:" -A 5 src/lib/auth/authService.ts | head -20 || true
fi

echo ""

# ============================================
# Check your existing database files
# ============================================
print_header "Checking for existing database files..."

# Look for any database configuration files
find . -name "db.ts" -o -name "database.ts" -o -name "schema.ts" -o -name "models.ts" 2>/dev/null | while read -r file; do
    echo "📄 Found: $file"
    echo "   Contains:"
    grep -E "export|interface|type|const|database|connection" "$file" | head -10 | sed 's/^/   /'
    echo ""
done

# ============================================
# Check package.json for database dependencies
# ============================================
print_header "Database dependencies in package.json..."

if [ -f "package.json" ]; then
    echo "📦 Database-related packages:"
    node -e "
    const pkg = require('./package.json');
    const deps = {...pkg.dependencies, ...pkg.devDependencies};
    const dbPackages = [];
    for (const [name, version] of Object.entries(deps)) {
        if (name.includes('prisma') || name.includes('mongo') || 
            name.includes('postgres') || name.includes('mysql') || 
            name.includes('sqlite') || name.includes('typeorm') ||
            name.includes('sequelize') || name.includes('database')) {
            dbPackages.push({name, version});
        }
    }
    if (dbPackages.length === 0) {
        console.log('   No database packages found');
    } else {
        dbPackages.forEach(p => console.log('   • ' + p.name + ': ' + p.version));
    }
    " 2>/dev/null || echo "   Could not parse package.json"
fi

echo ""

# ============================================
# Create a simple test script to try database connection
# ============================================
print_header "Creating database connection test script..."

cat > test-db-connection.js << 'EOF'
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
EOF

print_success "Created test-db-connection.js"
chmod +x test-db-connection.js

# ============================================
# Create a schema inspector for your actual database
# ============================================
print_header "Creating database schema inspector..."

cat > inspect-schema.js << 'EOF'
#!/usr/bin/env node

// Database Schema Inspector
// Run with: node inspect-schema.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    try {
        require('dotenv').config();
    } catch (e) {}
}

console.log('\n📊 DATABASE SCHEMA INSPECTOR\n');
console.log('This tool will help identify your actual database schema.\n');

async function inspectPrisma() {
    if (fs.existsSync('prisma/schema.prisma')) {
        console.log('📦 Prisma Schema Found:');
        const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
        
        // Extract models
        const modelRegex = /model (\w+) {([^}]+)}/gs;
        let match;
        while ((match = modelRegex.exec(schema)) !== null) {
            const modelName = match[1];
            const fields = match[2];
            
            console.log(`\n   📋 Model: ${modelName}`);
            console.log('   Fields:');
            
            const fieldLines = fields.split('\n').filter(l => l.trim() && !l.trim().startsWith('@@'));
            fieldLines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed) {
                    console.log(`     • ${trimmed}`);
                }
            });
        }
        
        // Suggest introspection
        console.log('\n   🔍 To see actual database schema, run:');
        console.log('   npx prisma db pull');
    }
}

async function inspectMongoose() {
    // Look for mongoose models
    const findModels = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(findModels(filePath));
            } else if (file.match(/\.(model|schema)\.(ts|js)$/) || filePath.includes('/models/')) {
                results.push(filePath);
            }
        });
        return results;
    };
    
    if (fs.existsSync('src')) {
        const models = findModels('src');
        if (models.length > 0) {
            console.log('\n📦 Mongoose Models Found:');
            models.forEach(model => {
                console.log(`   • ${model}`);
                try {
                    const content = fs.readFileSync(model, 'utf8');
                    const schemaMatch = content.match(/new Schema\(({[^}]+})\)/s);
                    if (schemaMatch) {
                        console.log('     Schema:', schemaMatch[1].substring(0, 200) + '...');
                    }
                } catch (e) {}
            });
        }
    }
}

async function inspectSQL() {
    if (process.env.DATABASE_URL) {
        console.log('\n📦 SQL Database Detected');
        console.log(`   URL: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@')}`);
        
        if (process.env.DATABASE_URL.includes('postgres')) {
            console.log('\n   To inspect PostgreSQL schema, run:');
            console.log('   psql "' + process.env.DATABASE_URL + '" -c "\\dt"');
            console.log('   psql "' + process.env.DATABASE_URL + '" -c "\\d users"');
        } else if (process.env.DATABASE_URL.includes('mysql')) {
            console.log('\n   To inspect MySQL schema, run:');
            console.log('   mysql -e "SHOW TABLES"');
        }
    }
}

async function main() {
    await inspectPrisma();
    await inspectMongoose();
    await inspectSQL();
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Run: node test-db-connection.js');
    console.log('   2. Share the output with me');
    console.log('   3. I\'ll create a custom solution for your exact schema\n');
}

main().catch(console.error);
EOF

print_success "Created inspect-schema.js"
chmod +x inspect-schema.js

# ============================================
# Install dependencies if needed
# ============================================
print_header "Installing dependencies for inspection..."

npm list dotenv >/dev/null 2>&1 || npm install --no-save dotenv >/dev/null 2>&1 &
npm list pg >/dev/null 2>&1 || npm install --no-save pg >/dev/null 2>&1 &
npm list mongodb >/dev/null 2>&1 || npm install --no-save mongodb >/dev/null 2>&1 &
npm list sqlite3 >/dev/null 2>&1 || npm install --no-save sqlite3 >/dev/null 2>&1 &

wait
print_success "Dependencies checked"

# ============================================
# Final Instructions
# ============================================
echo ""
echo "🎉 ==============================================="
echo "🎉 DATABASE INSPECTION TOOLS READY!"
echo "🎉 ==============================================="
echo ""
echo "📊 Run these commands to see your actual database:"
echo ""
echo "   1. Test database connection:"
echo "      ${GREEN}node test-db-connection.js${NC}"
echo ""
echo "   2. Inspect database schema:"
echo "      ${GREEN}node inspect-schema.js${NC}"
echo ""
echo "   3. If you use Prisma, introspect your database:"
echo "      ${GREEN}npx prisma db pull${NC}"
echo ""
echo "   4. Share the output with me and I'll create:"
echo "      • Custom database adapter for YOUR exact schema"
echo "      • Working transactions that update YOUR real data"
echo "      • Proper queries that match YOUR table structure"
echo ""
echo "📋 Please run these commands and share the output!"
echo ""