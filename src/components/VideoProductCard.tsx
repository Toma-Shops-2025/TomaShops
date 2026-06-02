import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface VideoProductCardProps {
  product: Product;
  featured?: boolean;
  initialFavorited?: boolean;
  onUnfavorite?: (productId: string) => void;
}

const VideoProductCard = ({ product, featured = false, initialFavorited = false, onUnfavorite }: VideoProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

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
    return () => {
      cancelled = true;
    };
  }, [user, product.id, initialFavorited]);

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
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', product.id);
      if (error) {
        toast.error('Could not remove favorite');
      } else {
        setIsFavorited(false);
        onUnfavorite?.(product.id);
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: product.id });
      if (error) {
        toast.error('Could not save favorite');
      } else {
        setIsFavorited(true);
      }
    }
    setBusy(false);
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div
        className={`rounded-lg overflow-hidden border transition-all duration-200 hover:shadow-md ${
          featured ? 'bg-toma-purple-light/50' : 'bg-card'
        }`}
      >
        <div
          className="relative aspect-video w-full overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={`w-full h-full video-thumbnail ${isHovered ? 'animate-pulse-slow' : ''}`}>
            <img
              src={product.thumbnailUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 rounded-full bg-background/70 hover:bg-background/90 transition-colors ${
              isFavorited ? 'text-red-500' : 'text-muted-foreground'
            }`}
            onClick={toggleFavorite}
            disabled={busy}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>

          {featured && (
            <Badge className="absolute top-2 left-2 bg-toma-purple text-white">Featured</Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-toma-purple transition-colors">
              {product.title}
            </h3>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            <div className="flex items-center text-xs text-gray-500">
              <Eye className="h-3 w-3 mr-1" />
              <span>{product.views}</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <img
                src={product.seller?.avatar || product.seller?.avatar_url || '/placeholder.svg'}
                alt={product.seller?.name || product.seller?.full_name || 'Seller'}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="text-xs text-gray-600">{product.seller?.name || product.seller?.full_name || 'Seller'}</span>
            </div>
            <span className="text-xs text-gray-500">{product.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoProductCard;
