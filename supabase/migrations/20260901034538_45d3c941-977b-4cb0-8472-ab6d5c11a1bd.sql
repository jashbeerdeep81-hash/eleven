CREATE TABLE public.jaan_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner TEXT NOT NULL DEFAULT 'Jashbeer',
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.jaan_memory TO anon;
GRANT ALL ON public.jaan_memory TO service_role;

ALTER TABLE public.jaan_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jashbeer memory can be read"
  ON public.jaan_memory FOR SELECT
  TO anon
  USING (owner = 'Jashbeer');

CREATE POLICY "Jashbeer memory can be saved"
  ON public.jaan_memory FOR INSERT
  TO anon
  WITH CHECK (owner = 'Jashbeer');

CREATE POLICY "Jashbeer memory can be updated"
  ON public.jaan_memory FOR UPDATE
  TO anon
  USING (owner = 'Jashbeer')
  WITH CHECK (owner = 'Jashbeer');

CREATE POLICY "Jashbeer memory can be removed"
  ON public.jaan_memory FOR DELETE
  TO anon
  USING (owner = 'Jashbeer');

CREATE OR REPLACE FUNCTION public.update_jaan_memory_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_jaan_memory_updated_at
  BEFORE UPDATE ON public.jaan_memory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_jaan_memory_updated_at();