CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user_type text;
BEGIN
  v_user_type := COALESCE(NULLIF(new.raw_user_meta_data->>'user_type',''), 'buyer');
  IF v_user_type NOT IN ('buyer','seller') THEN
    v_user_type := 'buyer';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, user_type)
  VALUES (
    new.id,
    COALESCE(
      NULLIF(new.raw_user_meta_data->>'full_name',''),
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    v_user_type
  )
  ON CONFLICT (id) DO UPDATE
    SET user_type = COALESCE(public.profiles.user_type, EXCLUDED.user_type);
  RETURN new;
END;
$function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();