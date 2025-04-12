/*
  # Criação do esquema inicial do sistema HSE-IT

  1. Novas Tabelas
    - `empresas`
      - `id` (uuid, chave primária)
      - `nome` (text, não nulo)
      - `created_at` (timestamp com timezone)
      - `updated_at` (timestamp com timezone)

    - `empresa_usuarios`
      - `id` (uuid, chave primária)
      - `empresa_id` (uuid, referência à tabela empresas)
      - `user_id` (uuid, referência ao auth.users)
      - `created_at` (timestamp com timezone)

    - `avaliacoes`
      - `id` (uuid, chave primária)
      - `empresa_id` (uuid, referência à tabela empresas)
      - `respostas` (jsonb, array de respostas)
      - `resultados` (jsonb, resultados calculados)
      - `created_at` (timestamp com timezone)

  2. Segurança
    - Habilita RLS em todas as tabelas
    - Adiciona políticas para usuários autenticados
*/

-- Criar tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de relacionamento entre empresas e usuários
CREATE TABLE IF NOT EXISTS empresa_usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(empresa_id, user_id)
);

-- Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  respostas jsonb NOT NULL,
  resultados jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresa_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
CREATE POLICY "Usuários podem ver suas empresas"
  ON empresas
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT empresa_id 
      FROM empresa_usuarios 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar empresas"
  ON empresas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas para empresa_usuarios
CREATE POLICY "Usuários podem ver seus vínculos com empresas"
  ON empresa_usuarios
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuários podem criar vínculos com empresas"
  ON empresa_usuarios
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Políticas para avaliações
CREATE POLICY "Usuários podem ver avaliações de suas empresas"
  ON avaliacoes
  FOR SELECT
  TO authenticated
  USING (
    empresa_id IN (
      SELECT empresa_id 
      FROM empresa_usuarios 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar avaliações para suas empresas"
  ON avaliacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    empresa_id IN (
      SELECT empresa_id 
      FROM empresa_usuarios 
      WHERE user_id = auth.uid()
    )
  );

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela empresas
CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON empresas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();