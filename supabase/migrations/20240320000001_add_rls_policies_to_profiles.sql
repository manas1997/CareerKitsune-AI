-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = auth_users_id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = auth_users_id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = auth_users_id);

-- Allow public read access to profiles (optional, remove if you want to restrict profile viewing)
CREATE POLICY "Public can view profiles"
ON profiles FOR SELECT
USING (true); 