/*
  # Fix company table columns

  1. Changes
    - Rename 'nome' to 'razao_social'
    - Add 'cnpj' and 'email' columns
    - Add unique constraint to cnpj

  2. Security
    - Maintain existing RLS policies
*/

-- Rename column nome to razao_social if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas' AND column_name = 'nome'
  ) THEN
    ALTER TABLE empresas RENAME COLUMN nome TO razao_social;
  END IF;
END $$;

-- Add cnpj column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas' AND column_name = 'cnpj'
  ) THEN
    ALTER TABLE empresas ADD COLUMN cnpj text;
  END IF;
END $$;

-- Add email column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas' AND column_name = 'email'
  ) THEN
    ALTER TABLE empresas ADD COLUMN email text;
  END IF;
END $$;

-- Add unique constraint to cnpj if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'empresas' AND constraint_name = 'empresas_cnpj_key'
  ) THEN
    ALTER TABLE empresas ADD CONSTRAINT empresas_cnpj_key UNIQUE (cnpj);
  END IF;
END $$;