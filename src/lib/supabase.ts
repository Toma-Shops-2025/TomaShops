// Re-export the auto-managed Supabase client from the integrations folder.
// All imports of `@/lib/supabase` resolve to the same client instance.
export { supabase } from '@/integrations/supabase/client';
