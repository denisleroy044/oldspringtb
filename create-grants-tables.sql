-- ============================================
-- GRANTS SYSTEM TABLES
-- ============================================

-- Grant categories table
CREATE TABLE IF NOT EXISTS grant_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default grant categories
INSERT INTO grant_categories (name, description, icon, color, featured) VALUES
  ('Business', 'Grants for startups and small businesses', 'Briefcase', 'blue', true),
  ('Education', 'Scholarships and grants for students and educators', 'GraduationCap', 'green', true),
  ('Research', 'Funding for scientific and academic research', 'Flask', 'purple', true),
  ('Arts & Culture', 'Grants for artists and cultural projects', 'Palette', 'pink', true),
  ('Non-Profit', 'Funding for non-profit organizations', 'Heart', 'red', true),
  ('Technology', 'Tech innovation and development grants', 'Cpu', 'indigo', true),
  ('Healthcare', 'Medical and healthcare research grants', 'Activity', 'teal', true),
  ('Environment', 'Environmental conservation grants', 'Leaf', 'emerald', true),
  ('Community', 'Community development grants', 'Users', 'orange', true),
  ('Women', 'Grants for women entrepreneurs', 'Venus', 'rose', true)
ON CONFLICT (name) DO NOTHING;

-- Grants table
CREATE TABLE IF NOT EXISTS grants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  category_id TEXT REFERENCES grant_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  provider TEXT,
  amount_min DECIMAL(10,2),
  amount_max DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  application_deadline DATE NOT NULL,
  eligibility_criteria TEXT[],
  requirements TEXT[],
  documents_required TEXT[],
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'ACTIVE',
  application_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample grants
INSERT INTO grants (category_id, title, description, short_description, provider, amount_min, amount_max, application_deadline, eligibility_criteria, featured, status) VALUES
  ((SELECT id FROM grant_categories WHERE name = 'Business'), 'Small Business Innovation Grant', 'Funding for innovative small businesses developing new products or services.', 'Supporting small business innovation', 'SBA', 10000, 50000, NOW() + INTERVAL '60 days', ARRAY['Small business owner', 'Less than 50 employees', '2+ years in operation'], true, 'ACTIVE'),
  ((SELECT id FROM grant_categories WHERE name = 'Education'), 'STEM Education Grant', 'Supporting STEM education initiatives in schools and communities.', 'Promoting STEM education', 'Department of Education', 5000, 25000, NOW() + INTERVAL '45 days', ARRAY['Educational institution', 'Non-profit status', 'STEM-focused program'], true, 'ACTIVE'),
  ((SELECT id FROM grant_categories WHERE name = 'Research'), 'Medical Research Grant', 'Funding for innovative medical research projects.', 'Advancing medical research', 'NIH', 25000, 100000, NOW() + INTERVAL '90 days', ARRAY['Research institution', 'Qualified researchers', 'IRB approval'], true, 'ACTIVE'),
  ((SELECT id FROM grant_categories WHERE name = 'Technology'), 'Tech Innovation Fund', 'Supporting cutting-edge technology innovations.', 'Fueling tech innovation', 'Tech Foundation', 15000, 75000, NOW() + INTERVAL '30 days', ARRAY['Tech startups', 'Innovative technology', 'Scalable solution'], true, 'ACTIVE'),
  ((SELECT id FROM grant_categories WHERE name = 'Environment'), 'Green Energy Initiative', 'Funding for renewable energy and sustainability projects.', 'Promoting clean energy', 'Environmental Agency', 10000, 50000, NOW() + INTERVAL '75 days', ARRAY['Environmental focus', 'Renewable energy', 'Sustainability'], false, 'ACTIVE')
ON CONFLICT DO NOTHING;

-- Grant applications table
CREATE TABLE IF NOT EXISTS grant_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  grant_id TEXT REFERENCES grants(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  organization_name TEXT,
  organization_type TEXT,
  contact_first_name TEXT NOT NULL,
  contact_last_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  requested_amount DECIMAL(10,2) NOT NULL,
  total_project_cost DECIMAL(10,2),
  documents JSONB,
  status TEXT DEFAULT 'PENDING',
  admin_notes TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  approved_amount DECIMAL(10,2),
  reference TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    ALTER TABLE grant_applications ADD CONSTRAINT fk_grant_applications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_grants_category ON grants(category_id);
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants(application_deadline);
CREATE INDEX IF NOT EXISTS idx_grant_applications_user ON grant_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_grant_applications_status ON grant_applications(status);

-- Insert sample applications for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  business_grant_id TEXT;
  education_grant_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get grant IDs
  SELECT id INTO business_grant_id FROM grants WHERE title LIKE '%Business%' LIMIT 1;
  SELECT id INTO education_grant_id FROM grants WHERE title LIKE '%STEM%' LIMIT 1;
  
  IF demo_user_id IS NOT NULL THEN
    -- Check if demo user already has applications
    IF NOT EXISTS (SELECT 1 FROM grant_applications WHERE user_id = demo_user_id) THEN
      -- Insert sample applications
      INSERT INTO grant_applications (id, user_id, grant_id, application_number, contact_first_name, contact_last_name, contact_email, project_title, project_description, requested_amount, status, reference, created_at) VALUES
      (gen_random_uuid()::TEXT, demo_user_id, business_grant_id, 'GRANT-2024-001', 'James', 'Donaldson', 'demo@oldspring.com', 'AI-Powered Financial Planning Tool', 'Developing an AI-driven financial planning tool to help small businesses manage cash flow.', 50000, 'UNDER_REVIEW', 'REF-GRANT-001', NOW() - INTERVAL '5 days'),
      (gen_random_uuid()::TEXT, demo_user_id, education_grant_id, 'GRANT-2024-002', 'James', 'Donaldson', 'demo@oldspring.com', 'Financial Literacy Program', 'A comprehensive financial literacy program for high school students.', 25000, 'APPROVED', 'REF-GRANT-002', NOW() - INTERVAL '20 days');
    END IF;
  END IF;
END $$;
