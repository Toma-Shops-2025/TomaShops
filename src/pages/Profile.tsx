import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import VideoProductCard from '@/components/VideoProductCard';
import { products } from '@/data/products';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Star, Package, Heart, Edit, ShoppingBag, Upload, Store } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("listings");
  
  // Mock user data
  const user = {
    name: "John Smith",
    username: "johnsmith",
    avatar: "/placeholder.svg",
    location: "New York, NY",
    joined: "January 2025",
    bio: "Hi there! I'm selling items I no longer need. All items come from a smoke-free home. Feel free to message me with any questions!",
    rating: 4.9,
    reviewCount: 27,
    stats: {
      listings: 12,
      sold: 8,
      favorites: 5
    }
  };
  
  // Filter user's listings (for demo purposes using the first 4 products)
  const userListings = products.slice(0, 4);
  const soldItems = products.slice(2, 5);
  const favoriteItems = [products[1], products[3], products[5]];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-toma-purple-light"
              />
              <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full bg-background h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                  <div className="text-gray-500">@{user.username}</div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1 text-gray-500">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {user.location}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1 text-gray-500">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      Joined {user.joined}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="flex items-center">
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(user.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : i < user.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 font-semibold">{user.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.reviewCount} reviews
                    </div>
                  </div>
                  
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 mt-4 max-w-2xl">{user.bio}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-toma-purple">{user.stats.listings}</div>
              <div className="text-sm text-gray-500">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-toma-purple">{user.stats.sold}</div>
              <div className="text-sm text-gray-500">Items Sold</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-toma-purple">{user.stats.favorites}</div>
              <div className="text-sm text-gray-500">Favorites</div>
            </div>
          </div>
        </div>
        
        {/* Ad Banner */}
        <div className="mb-6">
          <AdBanner type="horizontal" />
        </div>
        
        {/* Tabs for user content */}
        <Tabs defaultValue="listings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6">
            <TabsTrigger value="listings" className="flex-1">
              <Store className="h-4 w-4 mr-1" /> My Listings
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex-1">
              <ShoppingBag className="h-4 w-4 mr-1" /> Sold Items
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              <Heart className="h-4 w-4 mr-1" /> Favorites
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex-1">
              <Package className="h-4 w-4 mr-1" /> Purchases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Active Listings</h2>
              <Button>
                <Upload className="h-4 w-4 mr-1" /> New Listing
              </Button>
            </div>
            
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userListings.map(product => (
                  <VideoProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <Store className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold mb-2">No Active Listings</h3>
                <p className="text-gray-500 mb-4 max-w-md mx-auto">
                  You don't have any active listings yet. Create your first listing to start selling!
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-1" /> Create Listing
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sold">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sold Items</h2>
            </div>
            
            {soldItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {soldItems.map(product => (
                  <VideoProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold mb-2">No Sold Items</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You haven't sold any items yet. Create listings to start selling!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Favorite Items</h2>
            </div>
            
            {favoriteItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favoriteItems.map(product => (
                  <VideoProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You haven't saved any items to your favorites yet. Browse the marketplace and heart items you like!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="purchases">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Purchases</h2>
            </div>
            
            <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-semibold mb-2">No Purchases Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You haven't made any purchases yet. Browse the marketplace to find amazing products!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
