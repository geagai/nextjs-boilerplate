-- Add notes column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes text;

-- Update the leads table schema to include notes column
-- This ensures the column exists and is properly typed
