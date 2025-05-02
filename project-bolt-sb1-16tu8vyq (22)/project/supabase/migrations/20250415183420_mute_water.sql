/*
  # Fix company status and add missing columns

  1. Changes
    - Add status column if it doesn't exist
    - Set default value for status
    - Ensure all required columns exist
    - Add NOT NULL constraints where needed

  2. Security
    - No changes to RLS policies
*/

-- Add status column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas' AND column_name = 'status'
  ) THEN
    ALTER TABLE empresas ADD COLUMN status text DEFAULT 'PENDENTE';
  END IF;
END $$;

-- Ensure required columns are NOT NULL
ALTER TABLE empresas
  ALTER COLUMN razao_social SET NOT NULL,
  ALTER COLUMN cnpj SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;

-- Set default values for numeric columns
ALTER TABLE empresas
  ALTER COLUMN avaliacoes_disponiveis SET DEFAULT 0,
  ALTER COLUMN avaliacoes_realizadas SET DEFAULT 0;