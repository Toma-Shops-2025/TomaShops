const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const headers = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
  accept: 'application/json',
};

export async function fetchPublicProducts<T>(signal?: AbortSignal): Promise<T[]> {
  const query = new URLSearchParams({
    select: '*,seller:profiles!products_seller_id_fkey(id,full_name,avatar_url,rating)',
    status: 'eq.active',
    order: 'datePosted.desc',
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?${query.toString()}`, {
    method: 'GET',
    signal,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Public feed failed to load (${response.status})`);
  }

  return response.json();
}

export async function fetchPublicProductById<T>(id: string, signal?: AbortSignal): Promise<T | null> {
  const query = new URLSearchParams({
    select: '*,seller:profiles!products_seller_id_fkey(id,full_name,avatar_url,rating)',
    id: `eq.${id}`,
    limit: '1',
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?${query.toString()}`, {
    method: 'GET',
    signal,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Product failed to load (${response.status})`);
  }

  const rows = (await response.json()) as T[];
  return rows[0] ?? null;
}

export async function fetchPublicRelatedProducts<T>(
  category: string,
  excludeId: string,
  signal?: AbortSignal,
): Promise<T[]> {
  const query = new URLSearchParams({
    select: '*,seller:profiles!products_seller_id_fkey(id,full_name,avatar_url,rating)',
    status: 'eq.active',
    category: `eq.${category}`,
    id: `neq.${excludeId}`,
    limit: '4',
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?${query.toString()}`, {
    method: 'GET',
    signal,
    headers,
  });

  if (!response.ok) return [];
  return response.json();
}
