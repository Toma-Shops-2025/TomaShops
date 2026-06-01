
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import AdBanner from '@/components/AdBanner';
import VideoProductCard from '@/components/VideoProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// When we have real data, this interface will be used
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
  seller?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    rating: number;
  } | null;
}

const Index = () => {
  const categories = ["All", "Electronics", "Fashion", "Home & Garden", "Sports", "Music"];
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Fetch products from Supabase
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          seller:profiles!products_seller_id_fkey(
            id,
            full_name,
            avatar_url,
            rating
          )
        `)
        .eq('status', 'active')
        .order('datePosted', { ascending: false });
        
      if (error) throw error;
      return data as unknown as Product[];
    }
  });
  
  // Filter products by category (except for "All")
  const filteredProducts = products && activeCategory === "All" 
    ? products 
    : products?.filter(product => product.category === activeCategory) || [];
  
  // Featured products - first 3 products
  const featuredProducts = products?.slice(0, 3) || [];
  
  // New arrivals - sort by date and take first 3
  const newArrivals = products?.slice(0, 3) || [];
  
  if (error) {
    console.error('Error loading products:', error);
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-8 md:py-12 my-4 bg-gradient-to-r from-toma-purple-light to-toma-purple/10 rounded-xl">
          <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-toma-gray-dark">
                <span className="text-toma-purple">Video First</span> Shopping Experience
              </h1>
              <p className="text-lg mb-6 text-gray-600 max-w-lg">
                Discover products through authentic videos from real sellers. Shop confidently with our video-focused marketplace.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button size="lg" className="bg-toma-purple hover:bg-toma-purple-dark">
                  Start Shopping
                </Button>
                <Button size="lg" variant="outline" className="border-toma-purple text-toma-purple">
                  Sell Your Items
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-white max-w-md mx-auto">
                <img 
                  src="/placeholder.svg" 
                  alt="Video shopping experience" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/80 p-3">
                    <PlayCircle className="h-12 w-12 text-toma-purple" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* AdBanner */}
        <AdBanner type="horizontal" />
        
        {/* Featured Products */}
        {isLoading ? (
          <div className="my-8">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <FeaturedProducts products={featuredProducts} title="Featured Products" />
        )}
        
        {/* Category Tabs */}
        <section className="my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Browse by Category</h2>
          </div>
          
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="w-full h-auto flex flex-wrap justify-start mb-4 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="m-1 data-[state=active]:bg-toma-purple data-[state=active]:text-white"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeCategory}>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <Skeleton className="w-full h-36" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="mb-4">
                      <VideoProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found in this category.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
        
        {/* Middle AdBanner */}
        <div className="my-8 flex flex-col md:flex-row justify-between">
          <div className="md:w-2/3 md:pr-4">
            {isLoading ? (
              <div className="mb-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <Skeleton className="w-full h-36" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <FeaturedProducts products={newArrivals} title="New Arrivals" />
            )}
          </div>
          <div className="md:w-1/3 md:pl-4 space-y-4">
            <AdBanner type="vertical" />
          </div>
        </div>
        
        {/* Value Propositions */}
        <section className="my-12 py-8 bg-toma-purple-light/50 rounded-lg">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8">Why Choose TomaShops?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-12 h-12 bg-toma-purple-light rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="h-6 w-6 text-toma-purple" />
              </div>
              <h3 className="font-bold mb-2">Video First</h3>
              <p className="text-gray-600 text-sm">See products in action before you buy with authentic videos from sellers.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-12 h-12 bg-toma-purple-light rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-toma-purple">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Buyer Protection</h3>
              <p className="text-gray-600 text-sm">Shop confidently with our secure messaging and verification systems.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-12 h-12 bg-toma-purple-light rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-toma-purple">
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Free for Everyone</h3>
              <p className="text-gray-600 text-sm">No listing fees or commissions for sellers. Free to browse for buyers.</p>
            </div>
          </div>
        </section>
        
        {/* Bottom AdBanner */}
        <AdBanner type="horizontal" />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
