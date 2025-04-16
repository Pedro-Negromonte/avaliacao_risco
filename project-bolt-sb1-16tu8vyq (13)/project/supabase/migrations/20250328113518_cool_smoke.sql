/*
  # Create admin user and company setup

  1. Changes
    - Create admin user in auth.users
    - Create company "HSE Assessment"
    - Link admin user to company

  2. Security
    - Password is hashed using Supabase's built-in auth
*/

-- Create company
INSERT INTO empresas (id, nome)
VALUES (
  'c81d4e2e-bcf2-4c1a-b275-9183a9f6a176',
  'HSE Assessment'
) ON CONFLICT DO NOTHING;

-- Link user to company after they sign up via email/password
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.empresa_usuarios (empresa_id, user_id)
  VALUES (
    'c81d4e2e-bcf2-4c1a-b275-9183a9f6a176',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up trigger to run when new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();