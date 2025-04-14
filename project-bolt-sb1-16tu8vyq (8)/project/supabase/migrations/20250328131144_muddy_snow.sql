/*
  # Remove authentication tables and update schema

  1. Changes
    - Drop policies that depend on empresa_usuarios first
    - Drop empresa_usuarios table
    - Drop trigger and function
    - Update avaliacoes table constraints
    - Add new public access policies

  2. Security
    - Update RLS policies to allow public access
*/

-- First drop policies that depend on empresa_usuarios
DROP POLICY IF EXISTS "Usuários podem ver suas empresas" ON empresas;
DROP POLICY IF EXISTS "Usuários podem criar empresas" ON empresas;
DROP POLICY IF EXISTS "Usuários podem ver avaliações de suas empresas" ON avaliacoes;
DROP POLICY IF EXISTS "Usuários podem criar avaliações para suas empresas" ON avaliacoes;

-- Now we can safely drop the table and related objects
DROP TABLE IF EXISTS public.empresa_usuarios;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Update avaliacoes table
ALTER TABLE public.avaliacoes
DROP CONSTRAINT IF EXISTS avaliacoes_empresa_id_fkey,
ADD CONSTRAINT avaliacoes_empresa_id_fkey 
  FOREIGN KEY (empresa_id) 
  REFERENCES empresas(id) 
  ON DELETE CASCADE;

-- Add new policies for empresas
CREATE POLICY "Allow read access to empresas"
  ON empresas
  FOR SELECT
  TO public
  USING (true);

-- Add new policies for avaliacoes
CREATE POLICY "Allow insert access to avaliacoes"
  ON avaliacoes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow read access to avaliacoes"
  ON avaliacoes
  FOR SELECT
  TO public
  USING (true);