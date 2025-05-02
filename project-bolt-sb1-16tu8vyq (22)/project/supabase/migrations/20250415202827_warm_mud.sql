/*
  # Correção de CNPJs nulos

  1. Mudanças
    - Remove registros com CNPJ nulo
    - Garante que o campo CNPJ não aceite valores nulos

  2. Segurança
    - Mantém as políticas de RLS existentes
*/

-- Primeiro, remover registros com CNPJ nulo
DELETE FROM empresas WHERE cnpj IS NULL;

-- Agora podemos adicionar a restrição NOT NULL com segurança
ALTER TABLE empresas ALTER COLUMN cnpj SET NOT NULL;