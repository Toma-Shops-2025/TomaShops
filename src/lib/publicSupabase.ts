// TomaShops - Public Supabase REST Fetcher
// This bypasses the full SDK for public data to improve speed and reliability in WebView

function getBaseUrl() {
  return import.meta.env.VITE_SUPABASE_URL || "https://gqrdaaxqhrmnvqdyeqgu.supabase.co";
}

function getAnonKey() {
  return import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
         import.meta.env.VITE_SUPABASE_PUBLISHABLE_API ||
         "sb_publishable_Z9yP7wzwX-z2a1B9SU-k4g_-F4Ywuy1";
}

function getHeaders() {
  const key = getAnonKey();
  return {
    'apikey': key,
    'Authorization': `Bearer ${key}`,
    'Accept': 'application/json',
  };
}

export async function fetchPublicProducts<T>(signal?: AbortSignal): Promise<T[]> {
  const query = new URLSearchParams({
    select: '*,seller:profiles!products_seller_id_fkey(id,full_name,avatar_url,rating)',
    status: 'eq.active',
    order: 'datePosted.desc',
  });

  try {
    const response = await fetch(`${getBaseUrl()}/rest/v1/products?${query.toString()}`, {
      method: 'GET',
      signal,
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Public feed fetch error:", response.status, response.statusText);
      throw new Error(`Public feed failed to load (${response.status})`);
    }

    return response.json();
  } catch (err) {
    console.error("Network or SSL error fetching products:", err);
    throw err;
  }
}

export async function fetchPublicProductById<T>(id: string, signal?: AbortSignal): Promise<T | null> {
  const query = new URLSearchParams({
    select: '*,seller:profiles!products_seller_id_fkey(id,full_name,avatar_url,rating)',
    id: `eq.${id}`,
    limit: '1',
  });

  const response = await fetch(`${getBaseUrl()}/rest/v1/products?${query.toString()}`, {
    method: 'GET',
    signal,
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error(`Product failed to load (${response.status})`);

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

  const response = await fetch(`${getBaseUrl()}/rest/v1/products?${query.toString()}`, {
    method: 'GET',
    signal,
    headers: getHeaders(),
  });

  if (!response.ok) return [];
  return response.json();
}
