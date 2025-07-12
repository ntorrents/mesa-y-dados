-- Migración para añadir la columna rules_sections
ALTER TABLE games ADD COLUMN IF NOT EXISTS rules_sections JSONB; 