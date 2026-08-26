-- TomaShops: media URLs still point at the retired Supabase project
-- (gqrdaaxqhrmnvqdyeqgu). Files were never migrated to hoijmuinohsbndadvlvo.
-- Run in Supabase SQL Editor for project hoijmuinohsbndadvlvo.
-- After this, re-create / re-upload listings so new storage URLs are written.

UPDATE public.products
SET status = 'inactive'
WHERE status = 'active'
  AND (
    "videoUrl" LIKE '%gqrdaaxqhrmnvqdyeqgu%'
    OR "thumbnailUrl" LIKE '%gqrdaaxqhrmnvqdyeqgu%'
  );
