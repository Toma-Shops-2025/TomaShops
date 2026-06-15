import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicProducts } from '@/lib/publicSupabase';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import VideoProductCard from '@/components/VideoProductCard';
import VerticalFeed from '@/components/VerticalFeed';
import { Button } from '@/components/ui/button';
import { X, Upload, Zap, Shield, Gift, LayoutGrid, Smartphone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type ViewMode = 'grid' | 'feed';
const VIEW_KEY = 'tomashops:feed-view';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  location: string;
  seller_id: string;
  thumbnailUrl: string;
  videoUrl: string;
  imageUrls: string[];
  datePosted: string;
  status: string;
  views: number;
  favorites: number;
  listing_type?: 'direct' | 'affiliate' | 'dropship' | null;
  affiliate_network?: string | null;
  seller?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    rating: number;
  } | null;
}

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Music'];
const LISTING_FILTERS: Array<{ key: 'all' | 'direct' | 'affiliate'; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'direct', label: 'Direct' },
  { key: 'affiliate', label: 'Affiliate' },
];
const PRODUCTS_TIMEOUT_MS = 8_000;

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [listingFilter, setListingFilter] = useState<'all' | 'direct' | 'affiliate'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'grid';
    return (localStorage.getItem(VIEW_KEY) as ViewMode) || 'grid';
  });
  useEffect(() => { localStorage.setItem(VIEW_KEY, viewMode); }, [viewMode]);
  const [params, setParams] = useSearchParams();
  const searchQuery = params.get('q') ?? '';

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), PRODUCTS_TIMEOUT_MS);

      try {
        return await fetchPublicProducts<Product>(controller.signal);
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          throw new Error('The public feed took too long to load. Please refresh.');
        }
        throw err;
      } finally {
        window.clearTimeout(timeout);
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const searchFiltered = useMemo(() => {
    if (!products) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      [p.title, p.description, p.category, p.location, p.seller?.full_name ?? '']
        .join(' ').toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const filtered = searchFiltered.filter((p) =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    (listingFilter === 'all' || (p.listing_type ?? 'direct') === listingFilter)
  );

  if (error) console.error('Error loading products:', error);
  const clearSearch = () => { params.delete('q'); setParams(params); };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1">
        {/* HERO — brutalist stamp */}
        {!searchQuery && (
          <section className="border-b-4 border-black bg-secondary">
            <div className="container mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-block chip-listing chip-direct mb-4">See It. Shop It. Tap Buy.</div>
                <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-foreground mb-6">
                  See it.<br />
                  <span className="bg-foreground text-background px-3">Shop it.</span><br />
                  <span className="text-primary drop-shadow-[3px_3px_0px_#0a0a0a]">Tap buy.</span>
                </h1>
                <p className="text-base md:text-lg font-bold uppercase tracking-wide max-w-md mb-8">
                  Every listing is a video. Direct sellers, affiliate links, dropship stores — one feed, zero fluff.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow-lg brutal-press text-base h-14 px-8">
                    <a href="#feed">Start Watching →</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-background text-foreground rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press text-base h-14 px-8">
                    <Link to="/create-listing"><Upload className="h-4 w-4 mr-2" /> Sell Your Stuff</Link>
                  </Button>
                </div>
              </div>

              {/* phone frame mock */}
              <div className="relative mx-auto w-full max-w-[320px]">
                <div className="aspect-[9/16] bg-foreground border-4 border-black brutal-shadow-xl relative overflow-hidden">
                  {searchFiltered[0]?.videoUrl ? (
                    <video src={searchFiltered[0].videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 border-8 border-secondary rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-secondary border-b-[15px] border-b-transparent ml-2" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="chip-listing chip-affiliate">Affiliate</span>
                  </div>
                  <div className="absolute right-3 bottom-32 flex flex-col gap-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-11 h-11 bg-background border-2 border-black brutal-shadow flex items-center justify-center text-foreground">
                        <Zap className="h-5 w-5" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-foreground/95 to-transparent">
                    <p className="font-display text-2xl text-background drop-shadow-[2px_2px_0px_#ff5722]">$129</p>
                    <p className="text-background text-xs font-black uppercase tracking-wider">@retro_curator</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="container mx-auto px-4">
          {searchQuery && (
            <div className="my-6 flex items-center justify-between bg-secondary border-4 border-black brutal-shadow px-4 py-3">
              <p className="text-sm font-bold uppercase tracking-wide">
                Results for <span className="bg-foreground text-background px-2">"{searchQuery}"</span> · {searchFiltered.length}
              </p>
              <Button variant="ghost" size="sm" onClick={clearSearch} className="font-black uppercase">
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
          )}

          <div className="my-6">
            {/* Ad placeholder removed for initial release — AdMob integration coming v1.1 */}
          </div>

          {/* FEED */}
          <section id="feed" className="my-8 scroll-mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4 border-b-4 border-black pb-4">
              <div>
                <h2 className="font-display text-4xl md:text-5xl leading-none">The Feed</h2>
                <p className="text-xs font-black uppercase tracking-widest mt-2 text-muted-foreground">
                  {filtered.length} live {filtered.length === 1 ? 'listing' : 'listings'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {LISTING_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setListingFilter(f.key)}
                    className={`px-4 py-2 border-2 border-black font-black uppercase text-xs tracking-widest brutal-press transition-colors ${
                      listingFilter === f.key ? 'bg-foreground text-background brutal-shadow' : 'bg-background text-foreground hover:bg-secondary'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prominent view mode toggle */}
            <div className="mb-6 flex items-center gap-3">
              <span className="font-black uppercase text-[10px] tracking-widest text-muted-foreground hidden sm:inline">View:</span>
              <div className="flex flex-1 sm:flex-none border-4 border-black brutal-shadow-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`flex-1 sm:flex-none px-5 py-3 flex items-center justify-center gap-2 font-black uppercase text-sm tracking-widest brutal-press transition-colors ${
                    viewMode === 'grid' ? 'bg-foreground text-background' : 'bg-background text-foreground hover:bg-secondary'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" /> Grid
                </button>
                <button
                  onClick={() => setViewMode('feed')}
                  aria-pressed={viewMode === 'feed'}
                  className={`flex-1 sm:flex-none px-5 py-3 flex items-center justify-center gap-2 border-l-4 border-black font-black uppercase text-sm tracking-widest brutal-press transition-colors ${
                    viewMode === 'feed' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground hover:bg-secondary'
                  }`}
                >
                  <Smartphone className="h-5 w-5" /> Scroll Feed
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 border-2 border-black font-bold uppercase text-[11px] tracking-widest brutal-press transition-colors ${
                    activeCategory === c ? 'bg-primary text-primary-foreground brutal-shadow' : 'bg-background text-foreground hover:bg-secondary'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {isLoading && !products ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="border-4 border-black bg-background brutal-shadow">
                    <Skeleton className="w-full aspect-[4/5] rounded-none" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded-none" />
                      <Skeleton className="h-6 w-1/3 rounded-none" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 border-4 border-dashed border-black bg-secondary/40">
                <p className="font-display text-3xl mb-2">Feed did not load.</p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  Refresh the page to try again.
                </p>
                <Button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press">
                  Reload feed
                </Button>
              </div>
            ) : filtered.length > 0 ? (
              viewMode === 'feed' ? (
                <div className="mx-auto max-w-md md:max-w-lg">
                  <VerticalFeed products={filtered as any} />
                  <p className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-3">
                    Swipe / scroll for next · tap volume to unmute
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filtered.map((p) => (
                    <VideoProductCard key={p.id} product={p as any} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-20 border-4 border-dashed border-black bg-secondary/40">
                <p className="font-display text-3xl mb-2">Nothing here yet.</p>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  {searchQuery ? `No listings match "${searchQuery}".` : 'Be the first to drop one.'}
                </p>
                <Button asChild className="bg-primary text-primary-foreground rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press">
                  <Link to="/create-listing"><Upload className="h-4 w-4 mr-2" /> List an item</Link>
                </Button>
              </div>
            )}
          </section>

          {/* WHY TOMASHOPS */}
          {!searchQuery && (
            <section className="my-16 border-y-4 border-black py-12">
              <h2 className="font-display text-4xl md:text-6xl mb-10 text-center">
                Why <span className="bg-foreground text-background px-3">TomaShops</span>?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Why icon={<Zap className="h-7 w-7" />} title="Video First" bg="bg-primary" fg="text-primary-foreground">
                  No more grainy photos. Every listing is a real video so you see exactly what you're getting.
                </Why>
                <Why icon={<Shield className="h-7 w-7" />} title="Three Ways To Sell" bg="bg-secondary" fg="text-foreground">
                  Direct hand-off, affiliate links, or dropship store — one feed, three workflows.
                </Why>
                <Why icon={<Gift className="h-7 w-7" />} title="Free Forever" bg="bg-foreground" fg="text-background">
                  No listing fees. No commissions. We run on ads so you can run your hustle.
                </Why>
              </div>
            </section>
          )}

          <div className="my-12">
            {/* Ad placeholder removed for initial release — AdMob integration coming v1.1 */}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Why = ({
  icon, title, children, bg, fg,
}: { icon: React.ReactNode; title: string; children: React.ReactNode; bg: string; fg: string }) => (
  <div className={`${bg} ${fg} border-4 border-black brutal-shadow-lg p-6`}>
    <div className="w-12 h-12 bg-background text-foreground border-2 border-black flex items-center justify-center brutal-shadow mb-4">
      {icon}
    </div>
    <h3 className="font-display text-2xl mb-2 leading-none">{title}</h3>
    <p className="text-sm font-bold uppercase tracking-wide leading-snug">{children}</p>
  </div>
);

export default Index;
