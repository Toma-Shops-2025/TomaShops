-- Fix missing FK so PostgREST can embed seller profiles on products.
-- Safe to run multiple times. Does not delete or hide any listings.

-- Point seller_id at profiles when the constraint is missing/wrong.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND constraint_name = 'products_seller_id_fkey'
  ) THEN
    ALTER TABLE public.products DROP CONSTRAINT products_seller_id_fkey;
  END IF;
END $$;

-- Ensure every seller_id has a matching profile row (create stubs if needed).
INSERT INTO public.profiles (id, full_name, avatar_url)
SELECT DISTINCT p.seller_id, 'Seller', NULL
FROM public.products p
LEFT JOIN public.profiles pr ON pr.id = p.seller_id
WHERE pr.id IS NULL
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.products
  ADD CONSTRAINT products_seller_id_fkey
  FOREIGN KEY (seller_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
