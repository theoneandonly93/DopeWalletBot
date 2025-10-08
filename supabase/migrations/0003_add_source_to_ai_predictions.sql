-- Migration: add nullable source column to ai_predictions
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='ai_predictions' AND column_name='source'
    ) THEN
        ALTER TABLE ai_predictions ADD COLUMN source TEXT;
    END IF;
END$$;

COMMIT;
