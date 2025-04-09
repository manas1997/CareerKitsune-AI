-- Add auth_users_id column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS auth_users_id UUID REFERENCES auth.users(id);

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS profiles_auth_users_id_idx ON profiles(auth_users_id); 