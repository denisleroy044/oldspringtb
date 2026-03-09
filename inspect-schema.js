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
