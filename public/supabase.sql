-- Supabase SQL Setup Script for NextGeag BP
-- This script creates all required tables, RLS policies, functions, and triggers.
-- Run this in the SQL editor of your new Supabase project.

-- Table: admin_settings
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  stripe_publishable_key text,
  stripe_secret text,
  stripe_webhook_secret text,
  show_header boolean DEFAULT true,
  dev_mode boolean DEFAULT false,
  primary_color text,
  secondary_color text,
  background_color text,
  headline_text_color text,
  paragraph_text_color text,
  button_color text,
  button_hover_color text,
  button_text_color text,
  link_color text,
  link_hover_color text,
  header_background_color text,
  dark_primary_color text,
  dark_secondary_color text,
  dark_background_color text,
  dark_headline_text_color text,
  dark_paragraph_text_color text,
  dark_button_color text,
  dark_button_hover_color text,
  dark_button_text_color text,
  dark_link_color text,
  dark_link_hover_color text,
  dark_header_background_color text,
  sticky_header boolean,
  pricing_page_headline text,
  pricing_page_description text,
  pricing_page_faq jsonb,
  footer_background_color text DEFAULT '#ffffff',
  dark_footer_background_color text DEFAULT '#33363B',
  footer_text_color text DEFAULT '#33363B',
  dark_footer_text_color text DEFAULT '#ffffff',
  footer_link_color text DEFAULT '#3A72BB',
  dark_footer_link_color text DEFAULT '#fafafa',
  site_name text,
  footer_html_one text,
  footer_html_two text,
  email text,
  repo text
);

-- Table: agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UID uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  api_url text,
  prompt text,
  agent_role text,
  is_public boolean DEFAULT false,
  config jsonb DEFAULT '{}',
  category text
);

-- Table: agent_messages
CREATE TABLE IF NOT EXISTS agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  created_at timestamptz DEFAULT now(),
  UID text,
  agent_id text,
  prompt text,
  message text
);

-- Table: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  UID uuid NOT NULL REFERENCES auth.users(id),
  customer_id text NOT NULL,
  subscription_id text NOT NULL,
  cost numeric NOT NULL,
  billing_term text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status = ANY (ARRAY['active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete', 'incomplete_expired', 'paused']))
);

-- Table: pages
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  terms_service text,
  privacy_policy text,
  contact_us text,
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

-- Table: submissions
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamptz DEFAULT timezone('utc', now())
);

-- Table: user_data (full live schema)
CREATE TABLE IF NOT EXISTS user_data (
  UID uuid PRIMARY KEY REFERENCES auth.users(id),
  user_role text DEFAULT 'user',
  display_name text,
  email text,
  phone text,
  credits numeric DEFAULT 0,
  stripe_id jsonb DEFAULT '[]',
  api_keys jsonb DEFAULT '[]',
  trial_credits_claimed boolean DEFAULT false,
  affiliate_link_clicks integer DEFAULT 0,
  referred_by text,
  user_settings jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT timezone('utc', now()),
  updated_at timestamptz DEFAULT timezone('utc', now())
);

-- Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_data
    WHERE "UID" = auth.uid()
      AND lower(user_role) = 'admin'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.user_data (
        "UID",
        user_role,
        display_name,
        email
    )
    VALUES (
        NEW.id,
        'free subscriber',
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    )
    ON CONFLICT ("UID") DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.init_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_data ("UID", user_role, email, created_at, updated_at)
  VALUES (NEW.id, 'user', NEW.email, timezone('utc', now()), timezone('utc', now()))
  ON CONFLICT ("UID") DO NOTHING;
  RETURN NEW;
END;
$function$;

-- RLS Policies and Triggers
-- Enable RLS and create policies for each table as needed

-- Admin Settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
-- Allow anonymous users to read admin settings (for public theme/site settings)
CREATE POLICY "Allow anonymous users to read admin settings" ON admin_settings FOR SELECT USING (
  auth.uid() IS NULL
);
-- Allow authenticated users to read admin settings
CREATE POLICY "Allow authenticated users to read admin settings" ON admin_settings FOR SELECT USING (
  auth.uid() IS NOT NULL
);
-- Allow admins full access to admin settings
CREATE POLICY "Allow admins full access to admin settings" ON admin_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_data 
    WHERE user_data."UID" = auth.uid() 
    AND user_data.user_role = 'admin'
  )
);

-- Agents
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all users to read agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Allow select public agents" ON agents FOR SELECT USING (is_public = true);
CREATE POLICY "Allow users to select their own agents" ON agents FOR SELECT USING ("UID" = auth.uid());
CREATE POLICY "Users and admins can update their own agents" ON agents FOR UPDATE USING (
  "UID" = auth.uid() OR
  EXISTS (
    SELECT 1 FROM user_data WHERE user_data."UID" = auth.uid() AND user_data.user_role = 'admin'
  )
);

-- Agent Messages
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own agent messages" ON agent_messages FOR INSERT WITH CHECK (
  (auth.uid())::text = "UID"
);
CREATE POLICY "Users can update their own agent messages" ON agent_messages FOR UPDATE USING (
  (auth.uid())::text = "UID"
) WITH CHECK (
  (auth.uid())::text = "UID"
);
CREATE POLICY "Users can delete their own agent messages" ON agent_messages FOR DELETE USING (
  (auth.uid())::text = "UID"
);
CREATE POLICY "Users can view their own agent messages" ON agent_messages FOR SELECT USING (
  (auth.uid())::text = "UID"
);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = "UID");
CREATE POLICY "Admins can view all subscriptions" ON subscriptions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_data 
    WHERE subscriptions."UID" = auth.uid() 
    AND user_data.user_role = 'ADMIN'
  )
);

-- Pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all select on pages" ON pages FOR SELECT USING (true);

-- Submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage submissions" ON submissions FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- User Data
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service_role full access on user_data" ON user_data FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can access only their own data" ON user_data FOR ALL TO authenticated USING ("UID" = auth.uid()) WITH CHECK ("UID" = auth.uid());
CREATE POLICY "Users can update their own profile" ON user_data FOR UPDATE TO authenticated USING (auth.uid() = "UID");

-- Onboarding Trigger for user_data
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.init_user_data();

-- Add any additional functions, triggers, or policies as needed for your app. 