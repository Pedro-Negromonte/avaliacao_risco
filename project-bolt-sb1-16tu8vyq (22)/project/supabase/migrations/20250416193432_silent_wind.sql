/*
  # Fix RLS policies for empresas table

  1. Changes
    - Drop existing policies
    - Create new policies that allow public access for insert and select
    - Ensure proper access control while maintaining security

  2. Security
    - Allow public insert access for company registration
    - Allow public read access for existing companies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to empresas" ON empresas;

-- Create new policies
CREATE POLICY "Allow public read access to empresas"
  ON empresas
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to empresas"
  ON empresas
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;