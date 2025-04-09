-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;

-- Recreate policies with proper configuration
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = auth_users_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = auth_users_id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = auth_users_id);

-- Allow public read access to profiles
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
USING (true); 