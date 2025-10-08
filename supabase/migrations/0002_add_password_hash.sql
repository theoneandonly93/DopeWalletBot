-- Migration: add password_hash column to profiles if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN password_hash text;
  END IF;
END
$$;
-- Migration: add password_hash column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN password_hash text;
  END IF;
END $$;

-- Optionally ensure policies exist (no-ops if already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Server insert profiles' AND tablename = 'profiles'
  ) THEN
    EXECUTE 'create policy "Server insert profiles" on profiles for insert with check (auth.role() = ''service_role'')';
  END IF;
END $$;
