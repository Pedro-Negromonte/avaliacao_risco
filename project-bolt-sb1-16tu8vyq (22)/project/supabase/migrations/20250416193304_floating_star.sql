/*
  # Clean up test data and update company information

  1. Changes
    - Delete test companies with NULL CNPJ
    - Update existing company if it exists, otherwise insert new one
    - Add NOT NULL constraint to CNPJ column

  2. Security
    - Maintain existing RLS policies
*/

-- Delete test companies with NULL CNPJ
DELETE FROM empresas WHERE cnpj IS NULL;

-- Update existing company or insert new one
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM empresas WHERE cnpj = '20723112000188') THEN
        UPDATE empresas
        SET 
            razao_social = 'Granja Souza Criação de Aves LTDA',
            email = 'ovossouzapedro@gmail.com',
            status = 'PENDENTE',
            avaliacoes_disponiveis = 0,
            avaliacoes_realizadas = 0,
            updated_at = now()
        WHERE cnpj = '20723112000188';
    ELSE
        INSERT INTO empresas (
            razao_social,
            cnpj,
            email,
            status,
            avaliacoes_disponiveis,
            avaliacoes_realizadas
        ) VALUES (
            'Granja Souza Criação de Aves LTDA',
            '20723112000188',
            'ovossouzapedro@gmail.com',
            'PENDENTE',
            0,
            0
        );
    END IF;
END $$;

-- Add NOT NULL constraint to CNPJ column if not already set
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'empresas' 
        AND column_name = 'cnpj' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE empresas ALTER COLUMN cnpj SET NOT NULL;
    END IF;
END $$;