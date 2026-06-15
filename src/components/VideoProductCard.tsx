import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Heart, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface VideoProductCardProps {
  product: Product & {
    listing_type?: 'direct' | 'affiliate' | 'dropship' | null;
    affiliate_network?: string | null;
  };
  featured?: boolean;
  initialFavorited?: boolean;
  onUnfavorite?: (productId: string) => void;
}

const listingChipClass = (t?: string | null) => {
  if (t === 'affiliate') return 'chip-listing chip-affiliate';
  return 'chip-listing chip-direct';
};
const listingChipLabel = (t?: string | null) =>
  t === 'affiliate' ? 'Affiliate' : 'Direct';

const VideoProductCard = ({ product, featured = false, initialFavorited = false, onUnfavorite }: VideoProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user || initialFavorited) return;
    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setIsFavorited(true);
      });
    return () => { cancelled = true; };
  }, [user, product.id, initialFavorited]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHovered) v.play().catch(() => {}); else { v.pause(); v.currentTime = 0; }
  }, [isHovered]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.info('Sign in to save favorites');
      navigate('/auth/login');
      return;
    }
    if (busy) return;
    setBusy(true);
    if (isFavorited) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id);
      if (error) toast.error('Could not remove favorite');
      else { setIsFavorited(false); onUnfavorite?.(product.id); }
    } else {
      const { error } = await supabase.from('favorites').insert({ user_id: user.id, product_id: product.id });
      if (error) toast.error('Could not save favorite');
      else setIsFavorited(true);
    }
    setBusy(false);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className={`bg-background border-4 border-black brutal-shadow hover:brutal-shadow-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 ${featured ? 'ring-4 ring-secondary ring-offset-2 ring-offset-background' : ''}`}
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden bg-foreground border-b-4 border-black"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {product.videoUrl ? (
            <video
              ref={videoRef}
              src={product.videoUrl}
              poster={product.thumbnailUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
          )}

          {/* listing-type chip */}
          <div className="absolute top-3 left-3">
            <span className={listingChipClass(product.listing_type)}>
              {listingChipLabel(product.listing_type)}
            </span>
          </div>

          {/* favorite */}
          <button
            onClick={toggleFavorite}
            disabled={busy}
            aria-label="Favorite"
            className={`absolute top-3 right-3 w-10 h-10 flex items-center justify-center border-2 border-black brutal-shadow brutal-press ${isFavorited ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {featured && (
            <span className="absolute bottom-3 left-3 chip-listing chip-affiliate">Featured</span>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-sm uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          <div className="flex justify-between items-baseline">
            <span className="font-display text-3xl leading-none text-foreground">${Number(product.price).toFixed(0)}</span>
            <div className="flex items-center text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              <Eye className="h-3 w-3 mr-1" />
              {product.views ?? 0}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t-2 border-black flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={product.seller?.avatar || product.seller?.avatar_url || '/placeholder.svg'}
                alt={product.seller?.name || product.seller?.full_name || 'Seller'}
                className="w-6 h-6 rounded-full object-cover border-2 border-black"
              />
              <span className="text-xs font-bold uppercase tracking-wide truncate">
                @{(product.seller?.name || product.seller?.full_name || 'seller').toLowerCase().replace(/\s+/g, '_')}
              </span>
            </div>
            {product.location && (
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate ml-2">{product.location}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoProductCard;
