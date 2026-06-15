
UPDATE public.profiles p
SET full_name = split_part(u.email, '@', 1)
FROM auth.users u
WHERE u.id = p.id
  AND (p.full_name IS NULL OR length(trim(p.full_name)) = 0)
  AND u.email IS NOT NULL;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      NULLIF(new.raw_user_meta_data->>'full_name',''),
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$function$;
