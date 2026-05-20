-- Fix mismatch between old column foto_url (TEXT) and current schema foto_urls (TEXT[])
DO $$
BEGIN
  -- Ensure target column exists with a safe default for required field.
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'registros_descarte'
      AND column_name = 'foto_urls'
  ) THEN
    ALTER TABLE "registros_descarte"
      ADD COLUMN "foto_urls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
  END IF;

  -- If legacy single-photo column exists, migrate values into array form.
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'registros_descarte'
      AND column_name = 'foto_url'
  ) THEN
    UPDATE "registros_descarte"
    SET "foto_urls" = CASE
      WHEN "foto_url" IS NULL OR "foto_url" = '' THEN ARRAY[]::TEXT[]
      ELSE ARRAY["foto_url"]
    END
    WHERE "foto_urls" = ARRAY[]::TEXT[];

    ALTER TABLE "registros_descarte"
      DROP COLUMN "foto_url";
  END IF;
END $$;
