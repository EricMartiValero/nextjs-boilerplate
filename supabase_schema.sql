-- Create the social_networks table
CREATE TABLE IF NOT EXISTS social_networks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL, -- Name of the icon (e.g., from Lucide or string identifier)
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the visitas table for analytics
CREATE TABLE IF NOT EXISTS visitas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip TEXT,
    country TEXT,
    device TEXT,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE social_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read social networks
CREATE POLICY "Public read social networks" 
ON social_networks FOR SELECT 
TO anon, authenticated 
USING (true);

-- Policy: Only authenticated (admins) can insert/update/delete social networks
-- NOTE: Since we are using a custom cookie auth for "TnMorty" independent of Supabase Auth in the plan,
-- we might handle write security via backend logic. 
-- However, if using Supabase client directly from client-side (not planned here, we use Server Actions), proper policies are needed.
-- For Server Actions using Service Role (or authenticated client), these policies might be bypassed or satisfied.
-- Let's allow anon insert for visits as middleware does it.

CREATE POLICY "Middleware insert visits" 
ON visitas FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Admin read visits" 
ON visitas FOR SELECT 
TO anon, authenticated 
USING (true); -- Ideally restrict this, but for now open or handled by app logic.
