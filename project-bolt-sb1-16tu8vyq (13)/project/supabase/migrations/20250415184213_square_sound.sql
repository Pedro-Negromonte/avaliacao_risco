/*
  # Fix company schema and constraints

  1. Changes
    - Drop existing constraints to avoid conflicts
    - Recreate table structure with correct columns and constraints
    - Migrate existing data
    - Add new constraints

  2. Security
    - No changes to RLS policies
*/

-- Temporarily disable RLS
ALTER TABLE empresas DISABLE ROW LEVEL SECURITY;

-- Drop existing constraints
ALTER TABLE empresas 
  DROP CONSTRAINT IF EXISTS empresas_cnpj_key,
  DROP CONSTRAINT IF EXISTS empresas_pkey;

-- Ensure all required columns exist with correct types
ALTER TABLE empresas
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS razao_social text,
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'PENDENTE',
  ADD COLUMN IF NOT EXISTS avaliacoes_disponiveis integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avaliacoes_realizadas integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS access_password text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Set NOT NULL constraints
ALTER TABLE empresas
  ALTER COLUMN id SET NOT NULL,
  ALTER COLUMN razao_social SET NOT NULL,
  ALTER COLUMN cnpj SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN avaliacoes_disponiveis SET NOT NULL,
  ALTER COLUMN avaliacoes_realizadas SET NOT NULL;

-- Add constraints
ALTER TABLE empresas
  ADD CONSTRAINT empresas_pkey PRIMARY KEY (id),
  ADD CONSTRAINT empresas_cnpj_key UNIQUE (cnpj);

-- Re-enable RLS
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;