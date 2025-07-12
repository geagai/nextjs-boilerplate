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
  repo text,
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
  sticky_header boolean DEFAULT false,
  email text,
  pricing_page_headline text,
  pricing_page_description text,
  pricing_page_faq jsonb,
  footer_background_color text,
  dark_footer_background_color text,
  footer_text_color text,
  dark_footer_text_color text,
  footer_link_color text,
  dark_footer_link_color text,
  site_name text,
  footer_html_one text,
  footer_html_two text
);

-- Table: agents
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UID uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  category text,
  api_url text,
  prompt text,
  agent_role text,
  is_public boolean DEFAULT false,
  config jsonb
);

-- Table: agent_messages
CREATE TABLE IF NOT EXISTS agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid,
  created_at timestamptz DEFAULT now(),
  UID uuid REFERENCES auth.users(id),
  agent_id uuid REFERENCES agents(id),
  prompt text,
  message text,
  post_id text
);

-- Table: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "UID" uuid NOT NULL REFERENCES auth.users(id),
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
  "UID" uuid PRIMARY KEY,
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

-- RLS Policies and Triggers
-- Enable RLS and create policies for each table as needed

-- Agents
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select own or public agents" ON agents FOR SELECT USING (
  UID = auth.uid() OR is_public = true
);
CREATE POLICY "Allow insert own agents" ON agents FOR INSERT WITH CHECK (
  UID = auth.uid()
);
CREATE POLICY "Allow update own agents" ON agents FOR UPDATE USING (
  UID = auth.uid()
);
CREATE POLICY "Allow delete own agents" ON agents FOR DELETE USING (
  UID = auth.uid()
);

-- Agent Messages
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert own messages" ON agent_messages FOR INSERT WITH CHECK (
  UID = auth.uid()
);
CREATE POLICY "Allow update own messages" ON agent_messages FOR UPDATE USING (
  UID = auth.uid()
);
CREATE POLICY "Allow delete own messages" ON agent_messages FOR DELETE USING (
  UID = auth.uid()
);
CREATE POLICY "Allow select own messages" ON agent_messages FOR SELECT USING (
  UID = auth.uid()
);
CREATE POLICY "Allow select public agent messages" ON agent_messages FOR SELECT USING (
  agent_id IN (SELECT id FROM agents WHERE is_public = true)
);

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
-- Add policies as per your live DB (see documentation for details)

-- Admin Settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
-- Add policies as per your live DB (see documentation for details)

-- Pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all select on pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Allow all insert on pages" ON pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on pages" ON pages FOR UPDATE USING (true);

-- Submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
-- Add policies as needed

-- User Data
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
-- Add policies as per your live DB (see documentation for details)

-- Onboarding Trigger for user_data
CREATE OR REPLACE FUNCTION public.init_user_data()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_data ("UID", user_role, email, created_at, updated_at)
  VALUES (NEW.id, 'user', NEW.email, timezone('utc', now()), timezone('utc', now()))
  ON CONFLICT ("UID") DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.init_user_data();

-- Add any additional functions, triggers, or policies as needed for your app. 