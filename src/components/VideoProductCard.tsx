
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VideoProductCardProps {
  product: Product;
  featured?: boolean;
}

const VideoProductCard = ({ product, featured = false }: VideoProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
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
          {/* This would be replaced with actual video player in production */}
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
              isFavorited ? 'text-red-500' : 'text-gray-600'
            }`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
          
          {featured && (
            <Badge className="absolute top-2 left-2 bg-toma-purple text-white">
              Featured
            </Badge>
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
