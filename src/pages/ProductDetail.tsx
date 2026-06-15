
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share, Heart, Flag, MessageCircle, Star, PlayCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/sonner';
import PaymentProcessing from '@/components/PaymentProcessing';
import ReportDialog from '@/components/ReportDialog';
import BlockUserButton from '@/components/BlockUserButton';
import BackButton from '@/components/BackButton';

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
  external_url?: string | null;
  affiliate_network?: string | null;
  disclosure?: string | null;
  seller: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    rating: number;
  } | null;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      
      // First increment the view count
      await supabase.rpc('increment_product_view', { product_id: id });
      
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
        .eq('id', id)
        .single();
        
      if (error) throw error;
      if (!data) throw new Error("Product not found");
      
      return data as unknown as Product;
    },
    enabled: !!id
  });
  
  // Check if product is favorited by current user
  const { data: favoriteStatus } = useQuery({
    queryKey: ['favorite', id, user?.id],
    queryFn: async () => {
      if (!user || !id) return false;
      
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite status:', error);
      }
      
      return !!data;
    },
    enabled: !!user && !!id
  });
  
  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['relatedProducts', product?.category],
    queryFn: async () => {
      if (!product?.category) return [];
      
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
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);
        
      if (error) throw error;
      return data as unknown as Product[];
    },
    enabled: !!product?.category
  });
  
  // Set active image to thumbnail when product loads
  useEffect(() => {
    if (product) {
      setActiveImage(product.thumbnailUrl);
    }
  }, [product]);
  
  // Update favorited state when favorite status is fetched
  useEffect(() => {
    setIsFavorited(!!favoriteStatus);
  }, [favoriteStatus]);
  
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to save items");
      navigate('/auth/login');
      return;
    }
    
    if (!product) return;
    
    try {
      if (isFavorited) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);
          
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id
          });
          
        toast.success("Added to favorites");
      }
      
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };
  
  const handleStartConversation = async () => {
    if (!user) {
      toast.error("Please log in to message sellers");
      navigate('/auth/login');
      return;
    }
    
    if (!product) return;
    
    try {
      // Check if conversation already exists
      const { data: existingConvo } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', product.seller_id)
        .eq('product_id', product.id)
        .maybeSingle();
      
      let conversationId;
      
      if (!existingConvo) {
        // Create new conversation
        const { data: newConvo, error: newConvoError } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: product.seller_id,
            product_id: product.id
          })
          .select('id')
          .single();
          
        if (newConvoError) throw newConvoError;
        conversationId = newConvo.id;
      } else {
        conversationId = existingConvo.id;
      }
      
      // Navigate to messages screen with conversation
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };
  
  const handleBuyNow = async () => {
    if (!product) return;
    const isExternal = product.listing_type === 'affiliate' || product.listing_type === 'dropship';

    if (isExternal && product.external_url) {
      // Log click (fire-and-forget; allowed for anon + authenticated)
      supabase.from('product_clicks' as any).insert({
        product_id: product.id,
        user_id: user?.id ?? null,
        referrer: typeof document !== 'undefined' ? document.referrer : null,
      } as any).then(() => {}, () => {});
      window.open(product.external_url, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!user) {
      toast.error("Please log in to purchase items");
      navigate('/auth/login');
      return;
    }
    setShowPaymentModal(true);
  };
  
  const handleMakeOffer = () => {
    if (!user) {
      toast.error("Please log in to make offers");
      navigate('/auth/login');
      return;
    }
    
    handleStartConversation();
  };
  
  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title || 'Check out this product on TomaShops',
        text: product?.description?.substring(0, 100) + '...',
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4"><BackButton /></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <div className="mt-4">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex space-x-2 mb-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-8 w-16" />
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for might be removed or doesn't exist.</p>
            <Link to="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link to={`/?category=${product.category}`} className="hover:text-primary">
            {product.category}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-foreground">{product.title}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images/Video */}
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden border bg-card">
              <div className="relative">
                {activeImage === product.thumbnailUrl && product.videoUrl ? (
                  <div className="relative aspect-video w-full">
                    <video 
                      src={product.videoUrl} 
                      className="w-full h-full object-cover" 
                      controls 
                      poster={product.thumbnailUrl}
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full">
                    <img 
                      src={activeImage || product.thumbnailUrl} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  <div 
                    className={`w-20 h-20 flex-shrink-0 rounded cursor-pointer border-2 ${
                      activeImage === product.thumbnailUrl ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(product.thumbnailUrl)}
                  >
                    <div className="relative w-full h-full">
                      <img 
                        src={product.thumbnailUrl} 
                        alt="Thumbnail" 
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                        <PlayCircle className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  {product.imageUrls.map((imgUrl, idx) => (
                    <div 
                      key={idx}
                      className={`w-20 h-20 flex-shrink-0 rounded cursor-pointer border-2 ${
                        activeImage === imgUrl ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImage(imgUrl)}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Product ${idx + 1}`} 
                        className="w-full h-full object-cover rounded" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-4 pb-4 flex justify-between items-center gap-3">
                <h1 className="font-display text-3xl md:text-4xl leading-tight">{product.title}</h1>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={handleShareProduct}>
                    <Share className="h-4 w-4 mr-1" /> Share
                  </Button>
                  
                  <Button
                    size="sm" 
                    variant="ghost"
                    onClick={handleToggleFavorite}
                    className={isFavorited ? "text-red-500" : "text-muted-foreground"}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isFavorited ? "fill-current" : ""}`} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </Button>
                  
                  <ReportDialog
                    type="product"
                    reportedProductId={product.id}
                    reportedUserId={product.seller_id}
                  />
                </div>
              </div>
            </div>

            {/* Seller block area */}
            <div className="mt-2 flex justify-end gap-2">
              {user && user.id !== product.seller_id && (
                <>
                  <ReportDialog type="user" reportedUserId={product.seller_id} trigger={
                    <Button size="sm" variant="outline">Report seller</Button>
                  } />
                  <BlockUserButton targetUserId={product.seller_id} variant="outline" />
                </>
              )}
            </div>


            
            {/* Product Info Tabs */}
            <div className="mt-6">
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="seller">Seller Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="bg-card p-4 border rounded-b-lg">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Specifications</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Condition</div>
                        <div>{product.condition}</div>
                        
                        <div className="text-muted-foreground">Category</div>
                        <div>{product.category}</div>
                        
                        <div className="text-muted-foreground">Location</div>
                        <div>{product.location}</div>
                        
                        <div className="text-muted-foreground">Posted</div>
                        <div>{new Date(product.datePosted).toLocaleDateString()}</div>
                        
                        <div className="text-muted-foreground">Views</div>
                        <div>{product.views}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="shipping" className="bg-card p-4 border rounded-b-lg">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Options</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span>Standard Shipping</span>
                          <span>$4.99</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Express Shipping</span>
                          <span>$9.99</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Local Pickup</span>
                          <span>Free</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Estimated Delivery</h3>
                      <p className="text-muted-foreground text-sm">
                        Standard shipping: 3-5 business days<br />
                        Express shipping: 1-2 business days
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="seller" className="bg-card p-4 border rounded-b-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.seller.avatar_url || '/placeholder.svg'} 
                        alt={product.seller.full_name || 'Seller'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{product.seller.full_name || 'Seller'}</h3>
                        <div className="flex items-center text-sm">
                          <div className="flex">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.seller.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : i < product.seller.rating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-1 text-muted-foreground">{product.seller.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline" onClick={handleStartConversation}>
                      Contact Seller
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Bottom Ad placeholder removed for initial release — AdMob integration coming v1.1 */}
            {/* <div className="mt-6"><AdBanner type="horizontal" /></div> */}
          </div>
          
          {/* Product Action and Details */}
          <div className="lg:col-span-1">
            <div className="bg-background border-4 border-black brutal-shadow-lg p-5 sticky top-24">
              <div className="mb-4 pb-4 border-b-2 border-black">
                <div className="flex justify-between items-end mb-2 gap-2">
                  <span className="font-display text-5xl leading-none text-foreground">${product.price.toFixed(0)}</span>
                  <span className="chip-listing chip-direct">{product.condition}</span>
                </div>
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Listed {new Date(product.datePosted).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4">
                <span className={
                  product.listing_type === 'affiliate' ? 'chip-listing chip-affiliate' :
                  product.listing_type === 'dropship' ? 'chip-listing chip-dropship' :
                  'chip-listing chip-direct'
                }>
                  {product.listing_type === 'affiliate' ? 'Affiliate' : product.listing_type === 'dropship' ? 'Dropship' : 'Direct'}
                  {product.affiliate_network ? ` · ${product.affiliate_network}` : ''}
                </span>
              </div>

              {(product.listing_type === 'affiliate' || product.listing_type === 'dropship') && (
                <div className="mb-4 p-3 bg-secondary border-2 border-black text-[11px] font-bold leading-snug">
                  {product.disclosure ||
                    'This listing contains an affiliate link. TomaShops or the seller may earn a commission, at no extra cost to you.'}
                </div>
              )}

              <div className="space-y-3">
                {(product.listing_type === 'affiliate' || product.listing_type === 'dropship') && (
                  <Button
                    className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary rounded-none border-4 border-black font-black uppercase tracking-widest text-base brutal-shadow brutal-press"
                    onClick={handleBuyNow}
                  >
                    {`Buy on ${product.affiliate_network || 'External Site'} →`}
                  </Button>
                )}

                {product.listing_type === 'direct' && (
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-background text-foreground rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press"
                    onClick={handleMakeOffer}
                  >
                    Make Offer
                  </Button>
                )}

                <Button
                  variant="secondary"
                  className="w-full h-12 bg-secondary text-foreground rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press flex items-center justify-center"
                  onClick={handleStartConversation}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Seller
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t text-sm">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1 text-muted-foreground">
                      <path d="M17 11h1a3 3 0 0 1 0 6h-1" />
                      <path d="M9 12v6" />
                      <path d="M13 12v6" />
                      <path d="M14 7.4c0-1.33-1-2.4-2-2.4s-2 1.07-2 2.4C10 8.65 11 10 12 10s2-1.35 2-2.6Z" />
                      <path d="M5 7.4C5 6.07 6 5 7 5s2 1.07 2 2.4C9 8.65 8 10 7 10s-2-1.35-2-2.6Z" />
                      <path d="M5 22v-8.3a2 2 0 0 1 .6-1.4l4.4-4.6" />
                    </svg>
                    Free for Buyers
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1 text-muted-foreground">
                      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                      <path d="M2 7h20" />
                      <path d="M22 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
                      <path d="M6 7v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2V7" />
                    </svg>
                    Trusted Seller
                  </div>
                </div>
              </div>
              
              {/* Side Ad placeholder removed for initial release — AdMob integration coming v1.1 */}
              {/* <div className="mt-6"><AdBanner type="square" /></div> */}
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-8">
          {relatedProducts && relatedProducts.length > 0 ? (
            <FeaturedProducts products={relatedProducts} title="Similar Products" />
          ) : (
            <div className="py-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Similar Products</h2>
              <p className="text-muted-foreground">No similar products found.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Payment Modal */}
      <PaymentProcessing
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        productId={product.id}
        productTitle={product.title}
        productPrice={product.price}
        sellerId={product.seller_id}
      />
    </div>
  );
};

export default ProductDetail;
