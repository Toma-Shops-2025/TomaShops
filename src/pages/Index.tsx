import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import AdBanner from '@/components/AdBanner';
import VideoProductCard from '@/components/VideoProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Music'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [params, setParams] = useSearchParams();
  const searchQuery = params.get('q') ?? '';

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
    },
  });

  const searchFiltered = useMemo(() => {
    if (!products) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      [p.title, p.description, p.category, p.location, p.seller?.full_name ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [products, searchQuery]);

  const filteredProducts =
    activeCategory === 'All'
      ? searchFiltered
      : searchFiltered.filter((p) => p.category === activeCategory);

  const featuredProducts = searchFiltered.slice(0, 3);
  const newArrivals = searchFiltered.slice(0, 3);

  if (error) console.error('Error loading products:', error);

  const clearSearch = () => {
    params.delete('q');
    setParams(params);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 container mx-auto px-4">
        {!searchQuery && (
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
                  <Button asChild size="lg" className="bg-toma-purple hover:bg-toma-purple-dark">
                    <a href="#browse">Start Shopping</a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-toma-purple text-toma-purple">
                    <Link to="/create-listing">Sell Your Items</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="relative rounded-lg overflow-hidden shadow-xl border-4 border-white max-w-md mx-auto">
                  <img src="/placeholder.svg" alt="Video shopping experience" className="w-full h-auto" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/80 p-3">
                      <PlayCircle className="h-12 w-12 text-toma-purple" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {searchQuery && (
          <div className="my-6 flex items-center justify-between bg-toma-purple-light/40 px-4 py-3 rounded-lg">
            <p className="text-sm">
              Showing results for <span className="font-semibold">"{searchQuery}"</span> —{' '}
              {searchFiltered.length} match{searchFiltered.length === 1 ? '' : 'es'}
            </p>
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        )}

        <AdBanner type="horizontal" />

        {!searchQuery && (
          isLoading ? (
            <div className="my-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <FeaturedProducts products={featuredProducts as any} title="Featured Products" />
          ) : null
        )}

        <section id="browse" className="my-8 scroll-mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">
              {searchQuery ? 'Search Results' : 'Browse by Category'}
            </h2>
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
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="mb-4">
                      <VideoProductCard product={product as any} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {searchQuery
                      ? `No products match "${searchQuery}"${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.`
                      : 'No products found in this category.'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {!searchQuery && (
          <div className="my-8 flex flex-col md:flex-row justify-between">
            <div className="md:w-2/3 md:pr-4">
              {isLoading ? (
                <div className="mb-6">
                  <Skeleton className="h-8 w-48 mb-4" />
                </div>
              ) : newArrivals.length > 0 ? (
                <FeaturedProducts products={newArrivals as any} title="New Arrivals" />
              ) : null}
            </div>
            <div className="md:w-1/3 md:pl-4 space-y-4">
              <AdBanner type="vertical" />
            </div>
          </div>
        )}

        {!searchQuery && (
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
        )}

        <AdBanner type="horizontal" />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
