/*
  # Add email confirmation fields

  1. Changes
    - Add confirmation_token column to empresas table
    - Add confirmation_sent_at column to empresas table
    - Add email_confirmed_at column to empresas table
    - Add new status PENDENTE_CONFIRMACAO

  2. Security
    - No changes to RLS policies
*/

-- Add new columns for email confirmation
ALTER TABLE empresas
  ADD COLUMN IF NOT EXISTS confirmation_token uuid,
  ADD COLUMN IF NOT EXISTS confirmation_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_confirmed_at timestamptz;

-- Update status column to allow PENDENTE_CONFIRMACAO
DO $$
BEGIN
  ALTER TABLE empresas
    DROP CONSTRAINT IF EXISTS empresas_status_check;
    
  ALTER TABLE empresas
    ADD CONSTRAINT empresas_status_check
    CHECK (status IN ('PENDENTE_CONFIRMACAO', 'PENDENTE', 'ATIVO', 'EXPIRADO'));
END $$;