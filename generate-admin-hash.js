const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Hybrid@1234';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nCopy this SQL:');
  console.log(`-- Insert admin user with proper hash
INSERT INTO users (id, email, password, "firstName", "lastName", phone, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::TEXT,
  'hybrid@hth.com',
  '${hash}',
  'Admin',
  'User',
  '+1234567890',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET role = 'admin', password = EXCLUDED.password, "updatedAt" = NOW();`);
}

generateHash();
