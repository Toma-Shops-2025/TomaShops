
import { useState } from 'react';
import { Product } from '@/data/products';
import VideoProductCard from './VideoProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
  title: string;
}

const FeaturedProducts = ({ products, title }: FeaturedProductsProps) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsToShow = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  
  const nextProducts = () => {
    if (startIndex + itemsToShow < products.length) {
      setStartIndex(startIndex + 1);
    }
  };
  
  const prevProducts = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };
  
  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="outline"
            onClick={prevProducts}
            disabled={startIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={nextProducts}
            disabled={startIndex + itemsToShow >= products.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice(startIndex, startIndex + itemsToShow).map((product) => (
          <VideoProductCard 
            key={product.id} 
            product={product} 
            featured={title === 'Featured Products'}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
