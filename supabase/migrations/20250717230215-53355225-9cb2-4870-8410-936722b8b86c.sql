-- Ensure the user profile exists in profiles table
INSERT INTO public.profiles (id, email, name, role)
VALUES (
  '3a462c7f-cde0-4f92-bc9b-12cab75913da',
  'benjamin.dombry@gmail.com',
  'benjamin',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = 'admin';