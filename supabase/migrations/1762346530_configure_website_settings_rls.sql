-- Migration: configure_website_settings_rls
-- Created at: 1762346530

-- Enable RLS for website_settings table
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own settings
CREATE POLICY "Users can read own settings" ON website_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own settings
CREATE POLICY "Users can insert own settings" ON website_settings
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND (auth.role() = 'anon' OR auth.role() = 'service_role')
  );

-- Allow users to update their own settings
CREATE POLICY "Users can update own settings" ON website_settings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow public read access to china_regions
CREATE POLICY "Public read china_regions" ON china_regions
  FOR SELECT USING (true);

-- Configure storage.objects policies for website-logos bucket
CREATE POLICY "Public read website logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'website-logos');

CREATE POLICY "Allow upload website logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'website-logos'
    AND (auth.role() = 'anon' OR auth.role() = 'service_role')
  );
;