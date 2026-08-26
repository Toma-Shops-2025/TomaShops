/** Old Supabase project retired when TomaShops DB moved. Media files were not migrated. */
const DEAD_STORAGE_HOST = 'gqrdaaxqhrmnvqdyeqgu.supabase.co';

const PLACEHOLDER = '/placeholder.svg';

export function isReachableMediaUrl(url?: string | null): boolean {
  if (!url || !url.trim()) return false;
  if (url.includes(DEAD_STORAGE_HOST)) return false;
  return true;
}

/** Prefer a playable video URL; skip known-dead hosts so we never mount a broken <video>. */
export function safeVideoUrl(url?: string | null): string | undefined {
  return isReachableMediaUrl(url) ? url!.trim() : undefined;
}

/** Prefer a real image; fall back to app placeholder when thumbnails point at dead storage. */
export function safeImageUrl(url?: string | null): string {
  return isReachableMediaUrl(url) ? url!.trim() : PLACEHOLDER;
}
