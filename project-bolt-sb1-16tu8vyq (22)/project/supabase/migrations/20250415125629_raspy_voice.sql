/*
  # Add access password to empresas table

  1. Changes
    - Add `access_password` column to `empresas` table
    - This column will store the password sent by email

  2. Security
    - The password is stored as plain text since it's temporary
    - Users should be encouraged to change it after first login (future feature)
*/

ALTER TABLE empresas
ADD COLUMN IF NOT EXISTS access_password text;