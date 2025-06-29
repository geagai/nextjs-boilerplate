
-- Create user_data table for role management
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create website_settings table for Stripe configuration
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_public_key TEXT,
  stripe_secret_key TEXT,
  stripe_webhook_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for user_data
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can view their own data" ON user_data
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own data (except role)
CREATE POLICY "Users can update their own data" ON user_data
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND role = (SELECT role FROM user_data WHERE user_id = auth.uid()));

-- Policy: Admin users can read all data
CREATE POLICY "Admin users can view all data" ON user_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_data 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for website_settings
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admin users can read/write website settings
CREATE POLICY "Admin users can manage website settings" ON website_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_data 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_data 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for product images
CREATE POLICY "Admin users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM user_data 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Product images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Insert default admin user (john@doe.com)
INSERT INTO user_data (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'john@doe.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Insert default website settings (empty for now)
INSERT INTO website_settings (id)
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;
