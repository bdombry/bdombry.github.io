-- Insert test users directly into auth.users
-- Note: These will be encrypted passwords for testing purposes

-- First, let's create a function to help with test user creation
CREATE OR REPLACE FUNCTION create_test_user(
  user_email TEXT,
  user_name TEXT,
  user_role user_role,
  user_password TEXT DEFAULT 'test123'
)
RETURNS UUID AS $$
DECLARE
  user_id UUID;
  encrypted_password TEXT;
BEGIN
  -- Generate a new UUID for the user
  user_id := gen_random_uuid();
  
  -- For demo purposes, we'll use a simple hash (in production, this would be properly hashed)
  encrypted_password := crypt(user_password, gen_salt('bf'));
  
  -- Insert into auth.users (this is just for demo - in real Supabase this would be handled by auth)
  -- We'll create profiles directly instead
  
  -- Insert profile
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (user_id, user_email, user_name, user_role);
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create Benjamin Dombry as admin
SELECT create_test_user(
  'benjamin.dombry@admin.com',
  'Benjamin Dombry', 
  'admin'::user_role,
  'admin123'
);

-- Create a regular test user
SELECT create_test_user(
  'user@example.com',
  'Test User',
  'user'::user_role,
  'user123'
);

-- Drop the helper function as it's no longer needed
DROP FUNCTION create_test_user;