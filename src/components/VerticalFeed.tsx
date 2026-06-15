import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, Volume2, VolumeX, ShoppingBag, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface FeedProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  location?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  views?: number;
  listing_type?: 'direct' | 'affiliate' | 'dropship' | null;
  seller?: {
    id?: string;
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface VerticalFeedProps {
  products: FeedProduct[];
}

const chipClass = (t?: string | null) =>
  t === 'affiliate' ? 'chip-listing chip-affiliate' : 'chip-listing chip-direct';
const chipLabel = (t?: string | null) => (t === 'affiliate' ? 'Affiliate' : 'Direct');

const VerticalFeed = ({ products }: VerticalFeedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  // IntersectionObserver to play the visible card, pause others.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          const video = videoRefs.current[idx];
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            setActiveIndex(idx);
            video.muted = muted;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: [0, 0.65, 1] }
    );
    const slides = root.querySelectorAll('[data-feed-slide]');
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [products, muted]);

  // Reapply mute toggle to all videos.
  useEffect(() => {
    videoRefs.current.forEach((v) => { if (v) v.muted = muted; });
  }, [muted]);

  if (!products.length) return null;

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-180px)] min-h-[520px] max-h-[820px] overflow-y-scroll snap-y snap-mandatory border-4 border-black bg-foreground brutal-shadow-lg"
      style={{ scrollbarWidth: 'none' }}
    >
      <style>{`.feed-scroll::-webkit-scrollbar{display:none}`}</style>
      {products.map((p, i) => (
        <FeedSlide
          key={p.id}
          product={p}
          index={i}
          isActive={i === activeIndex}
          muted={muted}
          setMuted={setMuted}
          registerVideo={(el) => { videoRefs.current[i] = el; }}
        />
      ))}
    </div>
  );
};

interface SlideProps {
  product: FeedProduct;
  index: number;
  isActive: boolean;
  muted: boolean;
  setMuted: (v: boolean) => void;
  registerVideo: (el: HTMLVideoElement | null) => void;
}

const FeedSlide = ({ product, index, isActive, muted, setMuted, registerVideo }: SlideProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle()
      .then(({ data }) => { if (!cancelled && data) setIsFavorited(true); });
    return () => { cancelled = true; };
  }, [user, product.id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.info('Sign in to save favorites');
      navigate('/auth/login');
      return;
    }
    if (busy) return;
    setBusy(true);
    if (isFavorited) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id);
      if (!error) setIsFavorited(false);
    } else {
      const { error } = await supabase.from('favorites').insert({ user_id: user.id, product_id: product.id });
      if (!error) setIsFavorited(true);
    }
    setBusy(false);
  };

  const sellerHandle = (product.seller?.full_name || 'seller').toLowerCase().replace(/\s+/g, '_');

  const share = async () => {
    const url = `${window.location.origin}/product/${product.id}`;
    try {
      if (navigator.share) await navigator.share({ title: product.title, url });
      else { await navigator.clipboard.writeText(url); toast.success('Link copied'); }
    } catch {}
  };

  return (
    <div
      data-feed-slide
      data-index={index}
      className="relative w-full h-full snap-start snap-always flex items-center justify-center bg-black"
    >
      {product.videoUrl ? (
        <video
          ref={registerVideo}
          src={product.videoUrl}
          poster={product.thumbnailUrl}
          loop
          playsInline
          muted={muted}
          preload={isActive ? 'auto' : 'metadata'}
          className="w-full h-full object-contain md:object-cover"
        />
      ) : (
        <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
      )}

      {/* Top chip + mute */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
        <span className={chipClass(product.listing_type)}>{chipLabel(product.listing_type)}</span>
        <button
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-background text-foreground border-2 border-black brutal-shadow brutal-press"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      {/* Right action rail */}
      <div className="absolute right-3 bottom-40 flex flex-col gap-3 z-10">
        <button
          onClick={toggleFavorite}
          aria-label="Favorite"
          className={`w-12 h-12 flex items-center justify-center border-2 border-black brutal-shadow brutal-press ${
            isFavorited ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'
          }`}
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={share}
          aria-label="Share"
          className="w-12 h-12 flex items-center justify-center bg-background text-foreground border-2 border-black brutal-shadow brutal-press"
        >
          <Share2 className="h-5 w-5" />
        </button>
        <Link
          to={`/product/${product.id}`}
          aria-label="View"
          className="w-12 h-12 flex items-center justify-center bg-secondary text-foreground border-2 border-black brutal-shadow brutal-press"
        >
          <ShoppingBag className="h-5 w-5" />
        </Link>
      </div>

      {/* Bottom info card */}
      <div className="absolute bottom-0 inset-x-0 p-4 pr-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-background">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={product.seller?.avatar_url || '/placeholder.svg'}
            alt={sellerHandle}
            className="w-8 h-8 rounded-full object-cover border-2 border-background"
          />
          <span className="text-xs font-black uppercase tracking-widest">@{sellerHandle}</span>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-sm uppercase tracking-tight line-clamp-2 mb-1">{product.title}</h3>
        </Link>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl text-background drop-shadow-[2px_2px_0px_#ff5722]">
            ${Number(product.price).toFixed(0)}
          </span>
          <span className="flex items-center text-[10px] font-black uppercase tracking-widest opacity-80">
            <Eye className="h-3 w-3 mr-1" />{product.views ?? 0}
          </span>
          {product.location && (
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80 truncate">{product.location}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalFeed;
