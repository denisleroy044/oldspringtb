-- ============================================
-- COMPLETE LOANS SYSTEM
-- ============================================

-- Loan products table (admin configurable)
CREATE TABLE IF NOT EXISTS loan_products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- personal, business, mortgage, auto, education
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2) NOT NULL,
  min_term INTEGER NOT NULL, -- in months
  max_term INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  processing_fee DECIMAL(5,2) DEFAULT 0,
  late_payment_fee DECIMAL(5,2) DEFAULT 25,
  prepayment_penalty BOOLEAN DEFAULT false,
  collateral_required BOOLEAN DEFAULT false,
  credit_score_min INTEGER DEFAULT 600,
  income_multiplier DECIMAL(3,2) DEFAULT 3.0,
  requirements TEXT[],
  documents_required TEXT[],
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed loan products with categories
INSERT INTO loan_products (name, description, category, min_amount, max_amount, min_term, max_term, interest_rate, processing_fee, credit_score_min, income_multiplier, requirements, documents_required, features) VALUES
  ('Personal Loan', 'Flexible personal loans for any purpose - debt consolidation, home improvement, or unexpected expenses', 'personal', 1000, 50000, 6, 60, 8.5, 1.0, 640, 3.0, 
   ARRAY['Valid ID', 'Proof of income', 'Bank statements (3 months)', 'Credit check authorization'],
   ARRAY['Government ID', 'Pay stubs', 'Bank statements', 'Tax returns'],
   ARRAY['No collateral required', 'Fixed monthly payments', 'No prepayment penalty', 'Funds in 24 hours']),
  
  ('Business Loan', 'Fuel your business growth with working capital, equipment purchase, or expansion', 'business', 5000, 250000, 12, 84, 7.5, 1.5, 680, 4.0,
   ARRAY['Business registration', 'Tax returns (2 years)', 'Financial statements', 'Business plan'],
   ARRAY['Business license', 'Tax returns', 'Profit & loss', 'Balance sheet', 'Business plan'],
   ARRAY['Fast approval', 'Flexible terms', 'No early repayment fees', 'Dedicated account manager']),
  
  ('Mortgage Loan', 'Make your dream home a reality with competitive rates and flexible terms', 'mortgage', 50000, 1000000, 60, 360, 4.5, 2.0, 700, 4.5,
   ARRAY['Property documents', 'Income verification', 'Credit history', 'Down payment proof'],
   ARRAY['Property deed', 'Tax returns', 'Bank statements', 'Employment verification', 'Credit report'],
   ARRAY['30-year fixed available', 'FHA/VA options', 'Rate lock option', 'First-time buyer programs']),
  
  ('Auto Loan', 'Get behind the wheel with competitive auto financing for new or used vehicles', 'auto', 5000, 100000, 12, 72, 6.5, 1.0, 620, 3.5,
   ARRAY['Vehicle details', 'Insurance proof', 'Income verification', 'Driver\'s license'],
   ARRAY['Vehicle title', 'Insurance card', 'Pay stubs', 'License'],
   ARRAY['New & used cars', 'Refinance available', 'Quick approval', 'Competitive rates']),
  
  ('Education Loan', 'Invest in your future with education financing for tuition, books, and living expenses', 'education', 2000, 100000, 6, 120, 5.5, 0.5, 600, 2.5,
   ARRAY['Enrollment proof', 'Fee structure', 'ID proof', 'Academic records'],
   ARRAY['Acceptance letter', 'Fee schedule', 'Transcripts', 'ID proof'],
   ARRAY['Deferred payment options', 'Interest-only while in school', 'Grace period', 'Co-signer release']),
  
  ('Debt Consolidation Loan', 'Combine multiple debts into one manageable payment with lower interest', 'personal', 5000, 100000, 12, 84, 9.0, 1.0, 650, 3.0,
   ARRAY['Debt statements', 'Income proof', 'Credit report', 'Budget plan'],
   ARRAY['Credit card statements', 'Loan statements', 'Pay stubs', 'Credit report'],
   ARRAY['Lower monthly payments', 'Single payment', 'Fixed interest rate', 'Pay off faster']),
  
  ('Home Equity Loan', 'Tap into your home''s equity for renovations, education, or major purchases', 'mortgage', 10000, 500000, 60, 180, 5.0, 1.5, 680, 4.0,
   ARRAY['Home appraisal', 'Income proof', 'Mortgage statements', 'Credit history'],
   ARRAY['Appraisal report', 'Tax returns', 'Mortgage statement', 'Insurance'],
   ARRAY['Fixed rates', 'Tax deductible', 'Lump sum payment', 'Improve home value']),
  
  ('Medical Loan', 'Finance medical procedures, treatments, or elective surgeries', 'personal', 2000, 75000, 6, 60, 7.0, 0.5, 600, 3.0,
   ARRAY['Treatment estimate', 'Insurance info', 'Income proof', 'ID proof'],
   ARRAY['Medical estimate', 'Insurance card', 'Pay stubs', 'ID'],
   ARRAY['Quick funding', 'Flexible terms', 'No medical credit check', 'Direct payment to provider']),
  
  ('Wedding Loan', 'Make your special day perfect with financing for venue, catering, and more', 'personal', 3000, 50000, 6, 48, 8.0, 1.0, 620, 3.0,
   ARRAY['Wedding budget', 'Venue contract', 'Income proof', 'ID proof'],
   ARRAY['Vendor contracts', 'Budget breakdown', 'Pay stubs', 'ID'],
   ARRAY['Fast approval', 'Flexible funding', 'No collateral', 'Pay over time']),
  
  ('Vacation Loan', 'Turn your dream vacation into reality with affordable monthly payments', 'personal', 1000, 25000, 6, 36, 9.0, 0.5, 600, 3.0,
   ARRAY['Travel plans', 'Budget estimate', 'Income proof', 'ID proof'],
   ARRAY['Itinerary', 'Booking estimates', 'Pay stubs', 'ID'],
   ARRAY['Quick funding', 'Fixed payments', 'No travel restrictions', 'Book now, pay later'])
ON CONFLICT DO NOTHING;

-- Loan offers table (admin creates for specific users)
CREATE TABLE IF NOT EXISTS loan_offers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES loan_products(id),
  offer_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  term INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  monthly_payment DECIMAL(10,2),
  total_interest DECIMAL(10,2),
  total_payment DECIMAL(10,2),
  processing_fee DECIMAL(10,2),
  expiry_date DATE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'PENDING', -- PENDING, ACCEPTED, DECLINED, EXPIRED
  viewed_at TIMESTAMP,
  created_by TEXT, -- admin user id
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loan applications
CREATE TABLE IF NOT EXISTS loan_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES loan_products(id),
  offer_id TEXT REFERENCES loan_offers(id),
  application_number TEXT UNIQUE NOT NULL,
  
  -- Loan details
  amount DECIMAL(10,2) NOT NULL,
  term INTEGER NOT NULL,
  purpose TEXT,
  interest_rate DECIMAL(5,2),
  monthly_payment DECIMAL(10,2),
  total_payment DECIMAL(10,2),
  processing_fee DECIMAL(10,2),
  
  -- Personal information
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone TEXT,
  
  -- Employment information
  employment_status TEXT, -- EMPLOYED, SELF_EMPLOYED, BUSINESS_OWNER, RETIRED
  employer_name TEXT,
  job_title TEXT,
  years_employed INTEGER,
  annual_income DECIMAL(10,2),
  other_income DECIMAL(10,2),
  
  -- Financial information
  existing_loans DECIMAL(10,2) DEFAULT 0,
  monthly_expenses DECIMAL(10,2),
  credit_score INTEGER,
  
  -- Property information (for mortgages)
  property_type TEXT,
  property_value DECIMAL(10,2),
  property_address TEXT,
  
  -- Vehicle information (for auto loans)
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_year INTEGER,
  vehicle_price DECIMAL(10,2),
  
  -- Documents
  documents JSONB,
  
  -- Status tracking
  status TEXT DEFAULT 'PENDING', -- PENDING, UNDER_REVIEW, APPROVED, REJECTED, DISBURSED, CANCELLED
  status_history JSONB[],
  admin_notes TEXT,
  
  -- Approval details
  approved_by TEXT,
  approved_at TIMESTAMP,
  approved_amount DECIMAL(10,2),
  approved_term INTEGER,
  approved_interest_rate DECIMAL(5,2),
  
  -- Disbursement
  disbursed_at TIMESTAMP,
  disbursed_to_account TEXT,
  
  -- Metadata
  reference TEXT UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Loan repayment schedule
CREATE TABLE IF NOT EXISTS loan_repayment_schedules (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  loan_id TEXT REFERENCES loan_applications(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  principal DECIMAL(10,2),
  interest DECIMAL(10,2),
  fee DECIMAL(10,2) DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  paid_date DATE,
  status TEXT DEFAULT 'PENDING', -- PENDING, PAID, OVERDUE, PARTIAL
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(loan_id, installment_number)
);

-- Loan repayments (actual payments made)
CREATE TABLE IF NOT EXISTS loan_repayments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  loan_id TEXT REFERENCES loan_applications(id) ON DELETE CASCADE,
  schedule_id TEXT REFERENCES loan_repayment_schedules(id),
  amount DECIMAL(10,2) NOT NULL,
  principal DECIMAL(10,2),
  interest DECIMAL(10,2),
  fee DECIMAL(10,2),
  payment_method TEXT,
  transaction_id TEXT,
  reference TEXT,
  paid_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COMPLETE GRANTS SYSTEM
-- ============================================

-- Grant categories
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

-- Seed grant categories
INSERT INTO grant_categories (name, description, icon, color, featured) VALUES
  ('Business', 'Grants for startups, small businesses, and entrepreneurs', 'Briefcase', 'blue', true),
  ('Education', 'Scholarships and grants for students and educators', 'GraduationCap', 'green', true),
  ('Research', 'Funding for scientific, medical, and academic research', 'Flask', 'purple', true),
  ('Arts & Culture', 'Grants for artists, musicians, and cultural projects', 'Palette', 'pink', true),
  ('Non-Profit', 'Funding for non-profit organizations and charities', 'Heart', 'red', true),
  ('Technology', 'Tech innovation, software development, and digital projects', 'Cpu', 'indigo', true),
  ('Healthcare', 'Medical research, healthcare innovation, and wellness programs', 'Activity', 'teal', true),
  ('Environment', 'Environmental conservation, sustainability, and green energy', 'Leaf', 'emerald', true),
  ('Community', 'Community development, social services, and local projects', 'Users', 'orange', true),
  ('Women', 'Grants specifically for women entrepreneurs and leaders', 'Venus', 'rose', true),
  ('Minority', 'Grants for minority-owned businesses and communities', 'Star', 'amber', true),
  ('Veterans', 'Support for veterans and military families', 'Shield', 'slate', true),
  ('Agriculture', 'Farming, agriculture, and rural development grants', 'Sprout', 'lime', true),
  ('Sports', 'Athletic programs, sports facilities, and youth sports', 'Trophy', 'yellow', true),
  ('Housing', 'Affordable housing, home renovation, and first-time homebuyer', 'Home', 'brown', true)
ON CONFLICT (name) DO NOTHING;

-- Grants table (admin publishes available grants)
CREATE TABLE IF NOT EXISTS grants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  category_id TEXT REFERENCES grant_categories(id) ON DELETE CASCADE,
  
  -- Basic information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  provider TEXT,
  provider_logo TEXT,
  provider_website TEXT,
  
  -- Funding details
  amount_min DECIMAL(10,2),
  amount_max DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  funding_type TEXT, -- GRANT, SCHOLARSHIP, FELLOWSHIP, AWARD
  
  -- Dates
  application_open DATE,
  application_deadline DATE NOT NULL,
  notification_date DATE,
  start_date DATE,
  
  -- Eligibility
  eligibility_criteria TEXT[],
  eligible_countries TEXT[],
  eligible_regions TEXT[],
  demographic_focus TEXT[], -- women, minorities, veterans, etc.
  
  -- Requirements
  requirements TEXT[],
  documents_required TEXT[],
  
  -- Application process
  application_process TEXT,
  application_fee DECIMAL(10,2) DEFAULT 0,
  application_url TEXT,
  
  -- Statistics
  total_funding DECIMAL(10,2),
  awards_count INTEGER,
  success_rate DECIMAL(5,2),
  application_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'ACTIVE', -- ACTIVE, CLOSED, DRAFT, COMING_SOON
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  
  -- Metadata
  tags TEXT[],
  created_by TEXT, -- admin user id
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed grants with realistic data
DO $$
DECLARE
  business_id TEXT;
  education_id TEXT;
  research_id TEXT;
  arts_id TEXT;
  nonprofit_id TEXT;
  tech_id TEXT;
  healthcare_id TEXT;
  environment_id TEXT;
  community_id TEXT;
  women_id TEXT;
  minority_id TEXT;
  veterans_id TEXT;
BEGIN
  -- Get category IDs
  SELECT id INTO business_id FROM grant_categories WHERE name = 'Business' LIMIT 1;
  SELECT id INTO education_id FROM grant_categories WHERE name = 'Education' LIMIT 1;
  SELECT id INTO research_id FROM grant_categories WHERE name = 'Research' LIMIT 1;
  SELECT id INTO arts_id FROM grant_categories WHERE name = 'Arts & Culture' LIMIT 1;
  SELECT id INTO nonprofit_id FROM grant_categories WHERE name = 'Non-Profit' LIMIT 1;
  SELECT id INTO tech_id FROM grant_categories WHERE name = 'Technology' LIMIT 1;
  SELECT id INTO healthcare_id FROM grant_categories WHERE name = 'Healthcare' LIMIT 1;
  SELECT id INTO environment_id FROM grant_categories WHERE name = 'Environment' LIMIT 1;
  SELECT id INTO community_id FROM grant_categories WHERE name = 'Community' LIMIT 1;
  SELECT id INTO women_id FROM grant_categories WHERE name = 'Women' LIMIT 1;
  SELECT id INTO minority_id FROM grant_categories WHERE name = 'Minority' LIMIT 1;
  SELECT id INTO veterans_id FROM grant_categories WHERE name = 'Veterans' LIMIT 1;

  -- Insert grants if they don't exist
  IF NOT EXISTS (SELECT 1 FROM grants WHERE title = 'Small Business Innovation Research (SBIR)') THEN
    INSERT INTO grants (
      category_id, title, description, short_description, provider, amount_min, amount_max,
      application_deadline, eligibility_criteria, eligible_countries, requirements, documents_required,
      featured, status, tags
    ) VALUES
    (business_id, 'Small Business Innovation Research (SBIR)', 
     'The SBIR program provides funding for small businesses to engage in research and development with commercial potential. This highly competitive program encourages domestic small businesses to engage in federal research and development.',
     'Funding for innovative small businesses developing new technologies',
     'Small Business Administration', 50000, 250000,
     NOW() + INTERVAL '60 days',
     ARRAY['For-profit small business', 'Less than 500 employees', 'US-owned and operated', 'Principal researcher employed by business'],
     ARRAY['United States'],
     ARRAY['Phase I: 6 months', 'Phase II: 24 months', 'Commercialization plan required'],
     ARRAY['Business plan', 'Research proposal', 'Financial statements', 'Commercialization plan'],
     true, 'ACTIVE', ARRAY['technology', 'research', 'innovation']),
    
    (business_id, 'Growth Accelerator Fund Competition',
     'The Growth Accelerator Fund Competition awards prizes to organizations that provide mentorship and support to startups and small businesses across the nation.',
     'Support for organizations accelerating startup growth',
     'Small Business Administration', 50000, 50000,
     NOW() + INTERVAL '45 days',
     ARRAY['Accelerators', 'Incubators', 'Economic development organizations'],
     ARRAY['United States'],
     ARRAY['Proposal submission', 'Mentorship plan', 'Impact metrics'],
     ARRAY['Program description', 'Mentor list', 'Impact report'],
     true, 'ACTIVE', ARRAY['accelerator', 'startup', 'mentorship']),
    
    (education_id, 'National STEM Education Grant',
     'Supporting innovative STEM education programs that increase student engagement and achievement in science, technology, engineering, and mathematics.',
     'Funding for STEM education initiatives',
     'National Science Foundation', 25000, 150000,
     NOW() + INTERVAL '30 days',
     ARRAY['K-12 schools', 'Higher education institutions', 'Non-profits with STEM focus'],
     ARRAY['United States'],
     ARRAY['Program must serve at least 100 students', 'Evidence-based approach', 'Measurable outcomes'],
     ARRAY['Program proposal', 'Budget', 'Evaluation plan', 'Staff qualifications'],
     true, 'ACTIVE', ARRAY['STEM', 'education', 'K-12']),
    
    (education_id, 'First Generation Scholarship Grant',
     'Providing scholarships and support services for first-generation college students to improve access and success in higher education.',
     'Scholarships for first-generation college students',
     'Department of Education', 10000, 50000,
     NOW() + INTERVAL '90 days',
     ARRAY['Accredited colleges/universities', 'First-generation students', 'Financial need'],
     ARRAY['United States'],
     ARRAY['Institutional commitment', 'Student support services', 'Retention programs'],
     ARRAY['Proposal', 'Student demographics', 'Support plan', 'Budget'],
     false, 'ACTIVE', ARRAY['scholarship', 'first-generation', 'access']),
    
    (research_id, 'Medical Research Discovery Grant',
     'Funding for innovative medical research projects with potential to advance diagnosis, treatment, or prevention of diseases.',
     'Supporting breakthrough medical research',
     'National Institutes of Health', 50000, 500000,
     NOW() + INTERVAL '120 days',
     ARRAY['Research institutions', 'Universities', 'Medical schools', 'Non-profit research orgs'],
     ARRAY['United States'],
     ARRAY['Preliminary data required', 'IRB approval', 'Human subjects protection'],
     ARRAY['Research proposal', 'Budget', 'CV', 'Letters of support'],
     true, 'ACTIVE', ARRAY['medical', 'research', 'health']),
    
    (tech_id, 'AI Innovation Challenge Grant',
     'Funding for projects using artificial intelligence to solve real-world problems in areas like healthcare, education, and sustainability.',
     'AI solutions for social impact',
     'Tech Innovation Foundation', 75000, 200000,
     NOW() + INTERVAL '60 days',
     ARRAY['Tech startups', 'Research teams', 'Non-profits with tech focus'],
     ARRAY['United States', 'Canada', 'UK'],
     ARRAY['Working prototype', 'Clear social impact', 'Scalable solution'],
     ARRAY['Technical proposal', 'Demo', 'Impact assessment', 'Team background'],
     true, 'ACTIVE', ARRAY['AI', 'machine learning', 'technology']),
    
    (environment_id, 'Climate Resilience Grant',
     'Supporting projects that help communities adapt to climate change impacts through innovative solutions and community engagement.',
     'Building climate-resilient communities',
     'Environmental Protection Agency', 25000, 100000,
     NOW() + INTERVAL '75 days',
     ARRAY['Local governments', 'Non-profits', 'Community organizations'],
     ARRAY['United States'],
     ARRAY['Community partnership', 'Measurable outcomes', 'Sustainability plan'],
     ARRAY['Project proposal', 'Community letters', 'Budget', 'Timeline'],
     true, 'ACTIVE', ARRAY['climate', 'environment', 'sustainability']),
    
    (arts_id, 'Artist Fellowship Program',
     'Providing unrestricted grants to exceptional artists working in any discipline to support their creative practice and professional development.',
     'Supporting exceptional artists',
     'National Endowment for the Arts', 25000, 25000,
     NOW() + INTERVAL '45 days',
     ARRAY['Professional artists', '3+ years experience', 'US citizens/residents'],
     ARRAY['United States'],
     ARRAY['Artistic excellence', 'Significant body of work', 'Career impact'],
     ARRAY['Portfolio', 'Artist statement', 'CV', 'Work samples'],
     true, 'ACTIVE', ARRAY['arts', 'fellowship', 'artist']),
    
    (women_id, 'Women Entrepreneurs Growth Grant',
     'Empowering women-owned businesses with funding, mentorship, and resources to scale their operations and increase impact.',
     'Funding for women-owned businesses',
     'Women''s Business Enterprise Council', 15000, 50000,
     NOW() + INTERVAL '30 days',
     ARRAY['Women-owned business', '51%+ women-owned', 'Operating 2+ years', 'Revenue under $2M'],
     ARRAY['United States'],
     ARRAY['Business plan', 'Growth strategy', 'Mentorship commitment'],
     ARRAY['Business plan', 'Financials', 'Women-owned certification'],
     true, 'ACTIVE', ARRAY['women', 'business', 'entrepreneurship']),
    
    (minority_id, 'Minority Business Development Grant',
     'Providing capital and technical assistance to minority-owned businesses to promote economic equity and business growth.',
     'Supporting minority-owned businesses',
     'Minority Business Development Agency', 10000, 50000,
     NOW() + INTERVAL '60 days',
     ARRAY['Minority-owned business', '51%+ minority-owned', 'Operating 1+ years'],
     ARRAY['United States'],
     ARRAY['Business plan', 'Community impact', 'Job creation'],
     ARRAY['Business plan', 'Financials', 'Minority certification'],
     true, 'ACTIVE', ARRAY['minority', 'business', 'diversity']),
    
    (veterans_id, 'Veteran Entrepreneurship Program',
     'Helping veterans start and grow businesses through funding, training, and mentorship programs.',
     'Supporting veteran entrepreneurs',
     'Veteran Business Outreach Center', 10000, 35000,
     NOW() + INTERVAL '45 days',
     ARRAY['Veteran-owned business', '51%+ veteran-owned', 'Veteran status verified'],
     ARRAY['United States'],
     ARRAY['Business training completion', 'Mentorship participation'],
     ARRAY['Business plan', 'DD-214', 'Financials'],
     true, 'ACTIVE', ARRAY['veterans', 'business', 'entrepreneurship']),
    
    (community_id, 'Neighborhood Improvement Grant',
     'Funding for community-led projects that improve neighborhoods, public spaces, and quality of life for residents.',
     'Community-led neighborhood projects',
     'Community Development Foundation', 5000, 25000,
     NOW() + INTERVAL '30 days',
     ARRAY['Community organizations', 'Neighborhood associations', 'Local non-profits'],
     ARRAY['United States'],
     ARRAY['Community support', 'Volunteer involvement', 'Sustainable impact'],
     ARRAY['Project proposal', 'Community letters', 'Budget', 'Timeline'],
     false, 'ACTIVE', ARRAY['community', 'neighborhood', 'development']);
  END IF;
END $$;

-- Grant applications
CREATE TABLE IF NOT EXISTS grant_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grant_id TEXT REFERENCES grants(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  
  -- Organization details
  organization_name TEXT,
  organization_type TEXT, -- INDIVIDUAL, BUSINESS, NONPROFIT, EDUCATIONAL
  tax_id TEXT,
  year_established INTEGER,
  
  -- Contact information
  contact_first_name TEXT NOT NULL,
  contact_last_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  contact_title TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  
  -- Project details
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_category TEXT,
  project_start DATE,
  project_end DATE,
  
  -- Financials
  requested_amount DECIMAL(10,2) NOT NULL,
  total_project_cost DECIMAL(10,2),
  other_funding_sources TEXT,
  budget_breakdown JSONB,
  
  -- Impact
  target_audience TEXT,
  beneficiaries_count INTEGER,
  impact_metrics JSONB,
  
  -- Documents
  documents JSONB,
  additional_info JSONB,
  
  -- Status
  status TEXT DEFAULT 'PENDING', -- PENDING, UNDER_REVIEW, APPROVED, REJECTED, WITHDRAWN
  status_history JSONB[],
  admin_notes TEXT,
  
  -- Review
  reviewed_by TEXT,
  reviewed_at TIMESTAMP,
  review_score INTEGER,
  review_comments TEXT,
  
  -- Approval
  approved_amount DECIMAL(10,2),
  approved_at TIMESTAMP,
  approval_letter_url TEXT,
  
  -- Metadata
  reference TEXT UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Grant documents
CREATE TABLE IF NOT EXISTS grant_documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  application_id TEXT REFERENCES grant_applications(id) ON DELETE CASCADE,
  document_type TEXT,
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CREATE LOAN OFFERS FOR DEMO USER
-- ============================================

-- Create loan offers for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  personal_loan_id TEXT;
  business_loan_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get loan product IDs
  SELECT id INTO personal_loan_id FROM loan_products WHERE name = 'Personal Loan' LIMIT 1;
  SELECT id INTO business_loan_id FROM loan_products WHERE name = 'Business Loan' LIMIT 1;
  
  IF demo_user_id IS NOT NULL AND personal_loan_id IS NOT NULL THEN
    -- Create personal loan offer
    INSERT INTO loan_offers (
      id, user_id, product_id, offer_name, amount, term, interest_rate,
      monthly_payment, total_interest, total_payment, processing_fee,
      expiry_date, message, status, created_at, updated_at
    ) VALUES (
      gen_random_uuid()::TEXT,
      demo_user_id,
      personal_loan_id,
      'Special Personal Loan Offer',
      15000,
      36,
      7.99,
      469.77,
      1911.72,
      16911.72,
      150.00,
      NOW() + INTERVAL '30 days',
      'Based on your excellent credit history, we are pleased to offer you this pre-approved personal loan at a special rate.',
      'PENDING',
      NOW(),
      NOW()
    );
  END IF;
  
  IF demo_user_id IS NOT NULL AND business_loan_id IS NOT NULL THEN
    -- Create business loan offer
    INSERT INTO loan_offers (
      id, user_id, product_id, offer_name, amount, term, interest_rate,
      monthly_payment, total_interest, total_payment, processing_fee,
      expiry_date, message, status, created_at, updated_at
    ) VALUES (
      gen_random_uuid()::TEXT,
      demo_user_id,
      business_loan_id,
      'Business Growth Offer',
      50000,
      60,
      6.99,
      989.93,
      9395.80,
      59395.80,
      500.00,
      NOW() + INTERVAL '30 days',
      'Congratulations! Your business qualifies for this special growth funding offer.',
      'PENDING',
      NOW(),
      NOW()
    );
  END IF;
END $$;

-- ============================================
-- CREATE GRANT APPLICATIONS FOR DEMO USER
-- ============================================

-- Create some grant applications for demo user
DO $$
DECLARE
  demo_user_id TEXT;
  sbir_grant_id TEXT;
  stem_grant_id TEXT;
BEGIN
  -- Get demo user
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@oldspring.com' LIMIT 1;
  
  -- Get grant IDs
  SELECT id INTO sbir_grant_id FROM grants WHERE title LIKE '%SBIR%' LIMIT 1;
  SELECT id INTO stem_grant_id FROM grants WHERE title LIKE '%STEM%' LIMIT 1;
  
  IF demo_user_id IS NOT NULL AND sbir_grant_id IS NOT NULL THEN
    -- Create pending application
    INSERT INTO grant_applications (
      id, user_id, grant_id, application_number, contact_first_name, contact_last_name,
      contact_email, project_title, project_description, requested_amount, status,
      created_at, updated_at
    ) VALUES (
      gen_random_uuid()::TEXT,
      demo_user_id,
      sbir_grant_id,
      'GRANT-' || to_char(NOW(), 'YYYYMMDD') || '-001',
      'James',
      'Donaldson',
      'demo@oldspring.com',
      'AI-Powered Financial Planning Tool',
      'Developing an AI-driven financial planning tool to help small businesses manage cash flow and predict financial challenges.',
      150000,
      'UNDER_REVIEW',
      NOW() - INTERVAL '5 days',
      NOW() - INTERVAL '5 days'
    );
  END IF;
  
  IF demo_user_id IS NOT NULL AND stem_grant_id IS NOT NULL THEN
    -- Create approved application
    INSERT INTO grant_applications (
      id, user_id, grant_id, application_number, contact_first_name, contact_last_name,
      contact_email, project_title, project_description, requested_amount, status,
      approved_amount, reviewed_by, reviewed_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid()::TEXT,
      demo_user_id,
      stem_grant_id,
      'GRANT-' || to_char(NOW(), 'YYYYMMDD') || '-002',
      'James',
      'Donaldson',
      'demo@oldspring.com',
      'Financial Literacy Program for High School Students',
      'A comprehensive financial literacy program targeting high school students, teaching budgeting, saving, and investing basics.',
      25000,
      'APPROVED',
      25000,
      'admin',
      NOW() - INTERVAL '2 days',
      NOW() - INTERVAL '10 days',
      NOW() - INTERVAL '10 days'
    );
  END IF;
END $$;

-- ============================================
-- INDEXES
-- ============================================

-- Loan indexes
CREATE INDEX IF NOT EXISTS idx_loan_products_category ON loan_products(category);
CREATE INDEX IF NOT EXISTS idx_loan_offers_user ON loan_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_offers_status ON loan_offers(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_user ON loan_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_loan_applications_number ON loan_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_loan_schedules_loan ON loan_repayment_schedules(loan_id);
CREATE INDEX IF NOT EXISTS idx_loan_schedules_due ON loan_repayment_schedules(due_date);
CREATE INDEX IF NOT EXISTS idx_loan_schedules_status ON loan_repayment_schedules(status);
CREATE INDEX IF NOT EXISTS idx_loan_repayments_loan ON loan_repayments(loan_id);

-- Grant indexes
CREATE INDEX IF NOT EXISTS idx_grants_category ON grants(category_id);
CREATE INDEX IF NOT EXISTS idx_grants_status ON grants(status);
CREATE INDEX IF NOT EXISTS idx_grants_deadline ON grants(application_deadline);
CREATE INDEX IF NOT EXISTS idx_grants_featured ON grants(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_grant_applications_user ON grant_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_grant_applications_grant ON grant_applications(grant_id);
CREATE INDEX IF NOT EXISTS idx_grant_applications_status ON grant_applications(status);
CREATE INDEX IF NOT EXISTS idx_grant_applications_number ON grant_applications(application_number);

-- Create function to generate repayment schedule
CREATE OR REPLACE FUNCTION generate_repayment_schedule(
  p_loan_id TEXT,
  p_amount DECIMAL,
  p_term INTEGER,
  p_interest_rate DECIMAL,
  p_start_date DATE
) RETURNS void AS $$
DECLARE
  v_monthly_rate DECIMAL;
  v_monthly_payment DECIMAL;
  v_balance DECIMAL;
  v_interest DECIMAL;
  v_principal DECIMAL;
  v_due_date DATE;
  v_i INTEGER;
BEGIN
  v_monthly_rate := p_interest_rate / 100 / 12;
  v_monthly_payment := p_amount * v_monthly_rate * POWER(1 + v_monthly_rate, p_term) / (POWER(1 + v_monthly_rate, p_term) - 1);
  v_balance := p_amount;
  v_due_date := p_start_date;
  
  FOR v_i IN 1..p_term LOOP
    v_interest := v_balance * v_monthly_rate;
    v_principal := v_monthly_payment - v_interest;
    
    INSERT INTO loan_repayment_schedules (
      id, loan_id, installment_number, due_date, amount, principal, interest, status, created_at, updated_at
    ) VALUES (
      gen_random_uuid()::TEXT,
      p_loan_id,
      v_i,
      v_due_date,
      v_monthly_payment,
      v_principal,
      v_interest,
      'PENDING',
      NOW(),
      NOW()
    );
    
    v_balance := v_balance - v_principal;
    v_due_date := v_due_date + INTERVAL '1 month';
  END LOOP;
END;
$$ LANGUAGE plpgsql;

