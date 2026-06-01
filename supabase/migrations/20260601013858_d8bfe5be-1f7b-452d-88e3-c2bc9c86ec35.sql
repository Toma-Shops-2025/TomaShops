
-- Remove broad listing policy on storage objects (public bucket URLs still work)
DROP POLICY IF EXISTS "Product media is publicly readable" ON storage.objects;

-- handle_new_user is only used by the auth trigger; revoke direct execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- increment_product_view is intentionally callable; keep grants tight
REVOKE EXECUTE ON FUNCTION public.increment_product_view(UUID) FROM PUBLIC;
