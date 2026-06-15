const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function fetchPublicProducts<T>(signal?: AbortSignal): Promise<T[]> {
  const query = new URLSearchParams({
    select: '*,seller:profiles!products_seller_id_fkey(id,full_name,avatar_url,rating)',
    status: 'eq.active',
    order: 'datePosted.desc',
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?${query.toString()}`, {
    method: 'GET',
    signal,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Public feed failed to load (${response.status})`);
  }

  return response.json();
}