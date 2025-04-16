/*
  # Clean up test data and add new company

  1. Changes
    - Delete test company with NULL CNPJ
    - Insert new company with provided information
    - Add NOT NULL constraint to CNPJ column

  2. Security
    - Maintain existing RLS policies
*/

-- Delete test company with NULL CNPJ
DELETE FROM empresas WHERE cnpj IS NULL;

-- Insert new company
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

-- Add NOT NULL constraint to CNPJ column
ALTER TABLE empresas ALTER COLUMN cnpj SET NOT NULL;