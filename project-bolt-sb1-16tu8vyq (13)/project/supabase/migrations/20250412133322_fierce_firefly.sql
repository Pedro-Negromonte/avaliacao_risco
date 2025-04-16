/*
  # Add payment and subscription tables

  1. New Tables
    - `assinatura_empresa`
      - `id` (uuid, primary key)
      - `empresa_id` (uuid, references empresas)
      - `asaas_id` (text, ASAAS subscription ID)
      - `valor_total` (numeric)
      - `data_expiracao` (timestamptz)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Changes to existing tables
    - Add new columns to `empresas`:
      - `avaliacoes_disponiveis` (integer)
      - `avaliacoes_realizadas` (integer)

  3. Security
    - Enable RLS on new tables
    - Add policies for public access
*/

-- Add new columns to empresas
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS avaliacoes_disponiveis integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS avaliacoes_realizadas integer DEFAULT 0;

-- Create assinatura_empresa table
CREATE TABLE IF NOT EXISTS assinatura_empresa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  asaas_id text,
  valor_total numeric NOT NULL,
  data_expiracao timestamptz NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE assinatura_empresa ENABLE ROW LEVEL SECURITY;

-- Add policies for assinatura_empresa
CREATE POLICY "Allow public read access to assinatura_empresa"
  ON assinatura_empresa
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to assinatura_empresa"
  ON assinatura_empresa
  FOR INSERT
  TO public
  WITH CHECK (true);