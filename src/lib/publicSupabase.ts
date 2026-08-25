// TomaShops - Public Supabase REST Fetcher
// This bypasses the full SDK for public data to improve speed and reliability in WebView

function getBaseUrl() {
  return import.meta.env.VITE_SUPABASE_URL || "https://hoijmuinohsbndadvlvo.supabase.co";
}

function getAnonKey() {
  return (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_API ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvaWptdWlub2hzYm5kYWR2bHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3OTI0MzIsImV4cCI6MjEwMDM2ODQzMn0.bfBcIAUzMGn52tfFKtwfpzxDEzREBUOxI6Scq2rIyVI"
  );
}

function getHeaders() {
  const key = getAnonKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };
}

type SellerProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  rating: number | null;
};

async function attachSellers<T extends { seller_id?: string }>(
  products: T[],
  signal?: AbortSignal,
): Promise<(T & { seller: SellerProfile | null })[]> {
  const sellerIds = [
    ...new Set(products.map((p) => p.seller_id).filter((id): id is string => !!id)),
  ];
  if (sellerIds.length === 0) {
    return products.map((p) => ({ ...p, seller: null }));
  }

  // Fetch profiles separately — PostgREST embed fails when products.seller_id
  // has no FK to public.profiles (common after project moves).
  const query = new URLSearchParams({
    select: "id,full_name,avatar_url,rating",
    id: `in.(${sellerIds.join(",")})`,
  });

  try {
    const response = await fetch(`${getBaseUrl()}/rest/v1/profiles?${query.toString()}`, {
      method: "GET",
      signal,
      headers: getHeaders(),
    });
    if (!response.ok) {
      console.warn("Seller profiles fetch failed:", response.status);
      return products.map((p) => ({ ...p, seller: null }));
    }
    const profiles = (await response.json()) as SellerProfile[];
    const byId = new Map(profiles.map((p) => [p.id, p]));
    return products.map((p) => ({
      ...p,
      seller: (p.seller_id && byId.get(p.seller_id)) || null,
    }));
  } catch (err) {
    console.warn("Seller profiles fetch error:", err);
    return products.map((p) => ({ ...p, seller: null }));
  }
}

export async function fetchPublicProducts<T>(signal?: AbortSignal): Promise<T[]> {
  // Do NOT use embedded seller joins here — missing FK breaks the entire feed
  // with PGRST200 even when products exist.
  const query = new URLSearchParams({
    select: "*",
    status: "eq.active",
    order: "datePosted.desc",
  });

  try {
    const response = await fetch(`${getBaseUrl()}/rest/v1/products?${query.toString()}`, {
      method: "GET",
      signal,
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.error("Public feed fetch error:", response.status, response.statusText);
      throw new Error(`Public feed failed to load (${response.status})`);
    }

    const products = (await response.json()) as Array<T & { seller_id?: string }>;
    return (await attachSellers(products, signal)) as T[];
  } catch (err) {
    console.error("Network or SSL error fetching products:", err);
    throw err;
  }
}

export async function fetchPublicProductById<T>(id: string, signal?: AbortSignal): Promise<T | null> {
  const query = new URLSearchParams({
    select: "*",
    id: `eq.${id}`,
    limit: "1",
  });

  const response = await fetch(`${getBaseUrl()}/rest/v1/products?${query.toString()}`, {
    method: "GET",
    signal,
    headers: getHeaders(),
  });

  if (!response.ok) throw new Error(`Product failed to load (${response.status})`);

  const rows = (await response.json()) as Array<T & { seller_id?: string }>;
  if (!rows[0]) return null;
  const [withSeller] = await attachSellers(rows, signal);
  return withSeller as T;
}

export async function fetchPublicRelatedProducts<T>(
  category: string,
  excludeId: string,
  signal?: AbortSignal,
): Promise<T[]> {
  const query = new URLSearchParams({
    select: "*",
    status: "eq.active",
    category: `eq.${category}`,
    id: `neq.${excludeId}`,
    limit: "4",
  });

  const response = await fetch(`${getBaseUrl()}/rest/v1/products?${query.toString()}`, {
    method: "GET",
    signal,
    headers: getHeaders(),
  });

  if (!response.ok) return [];
  const products = (await response.json()) as Array<T & { seller_id?: string }>;
  return (await attachSellers(products, signal)) as T[];
}
