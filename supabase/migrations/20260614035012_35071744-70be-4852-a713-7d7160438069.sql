
-- 1. Extend products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS listing_type text NOT NULL DEFAULT 'direct',
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS affiliate_network text,
  ADD COLUMN IF NOT EXISTS disclosure text;

-- Validate listing_type via trigger (avoids brittle CHECK on text)
CREATE OR REPLACE FUNCTION public.validate_product_listing_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.listing_type NOT IN ('direct','affiliate','dropship') THEN
    RAISE EXCEPTION 'Invalid listing_type: %', NEW.listing_type;
  END IF;
  IF NEW.listing_type IN ('affiliate','dropship') AND (NEW.external_url IS NULL OR length(trim(NEW.external_url)) = 0) THEN
    RAISE EXCEPTION 'external_url is required for affiliate/dropship listings';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_product_listing_type_trg ON public.products;
CREATE TRIGGER validate_product_listing_type_trg
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.validate_product_listing_type();

-- 2. product_clicks
CREATE TABLE IF NOT EXISTS public.product_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.product_clicks TO authenticated;
GRANT INSERT ON public.product_clicks TO anon;
GRANT ALL ON public.product_clicks TO service_role;

ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a click"
ON public.product_clicks FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Sellers can read clicks for their products"
ON public.product_clicks FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = product_clicks.product_id AND p.seller_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS product_clicks_product_id_idx ON public.product_clicks(product_id);
CREATE INDEX IF NOT EXISTS product_clicks_created_at_idx ON public.product_clicks(created_at DESC);
