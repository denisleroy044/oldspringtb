-- Add missing columns to users table if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS "kycStatus" TEXT DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT NOW();

-- Update existing users to have default values
UPDATE users SET "kycStatus" = 'pending' WHERE "kycStatus" IS NULL;
UPDATE users SET "isActive" = true WHERE "isActive" IS NULL;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
