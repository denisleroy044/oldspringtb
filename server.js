require('dotenv').config()
const { spawn } = require('child_process')

console.log('✅ DATABASE_URL loaded:', process.env.DATABASE_URL ? 'Yes' : 'No')

// Run Next.js dev server
const next = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
})

next.on('close', (code) => {
  process.exit(code)
})
