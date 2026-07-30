import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import VideoProductCard from '@/components/VideoProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Heart, Edit, ShoppingBag, Upload, Store, Save, X } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { toast } from '@/components/ui/sonner';
import { format } from 'date-fns';

type ProfileRow = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  rating: number | null;
  created_at: string;
};

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', username: '', location: '', bio: '' });
  const [saving, setSaving] = useState(false);

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as ProfileRow | null;
    },
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const { data: listings = [], isLoading: listingsLoading } = useQuery({
    queryKey: ['profile-listings', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles!products_seller_id_fkey(id, full_name, avatar_url, rating)')
        .eq('seller_id', user!.id)
        .eq('status', 'active')
        .order('datePosted', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: soldItems = [], isLoading: soldLoading } = useQuery({
    queryKey: ['profile-sold', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles!products_seller_id_fkey(id, full_name, avatar_url, rating)')
        .eq('seller_id', user!.id)
        .eq('status', 'sold')
        .order('datePosted', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: favoriteItems = [], isLoading: favLoading } = useQuery({
    queryKey: ['profile-favorites', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`product_id, products:product_id (*, seller:profiles!products_seller_id_fkey(id, full_name, avatar_url, rating))`)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return ((data ?? []) as any[]).map((r) => r.products).filter(Boolean);
    },
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: form.full_name.trim() || null,
        username: form.username.trim() || null,
        location: form.location.trim() || null,
        bio: form.bio.trim() || null,
        updated_at: new Date().toISOString(),
      });
    setSaving(false);
    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile updated');
      setEditing(false);
      refetchProfile();
    }
  };

  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'You';
  const initial = (displayName || '?').charAt(0).toUpperCase();
  const joined = profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : '—';
  const rating = profile?.rating ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4"><BackButton /></div>

        {/* Profile Header */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          {profileLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-primary/30 overflow-hidden bg-muted flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              <div className="flex-1 w-full">
                {editing ? (
                  <div className="space-y-3 max-w-xl">
                    <div>
                      <Label htmlFor="full_name">Display name</Label>
                      <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State" />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving}>
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                        <X className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
                      {profile?.username && (
                        <div className="text-muted-foreground">@{profile.username}</div>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        {profile?.location && <div>{profile.location}</div>}
                        <div>Joined {joined}</div>
                      </div>
                      {profile?.bio && (
                        <p className="text-muted-foreground mt-3 max-w-2xl whitespace-pre-line">{profile.bio}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-muted'}`}
                            />
                          ))}
                          <span className="ml-1 font-semibold">{rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setEditing(true)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit profile
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{listings.length}</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{soldItems.length}</div>
              <div className="text-sm text-muted-foreground">Items Sold</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{favoriteItems.length}</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="listings">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="listings" className="flex-1">
              <Store className="h-4 w-4 mr-1" /> My Listings
            </TabsTrigger>
            <TabsTrigger value="sold" className="flex-1">
              <ShoppingBag className="h-4 w-4 mr-1" /> Sold
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex-1">
              <Heart className="h-4 w-4 mr-1" /> Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Active Listings</h2>
              <Button asChild>
                <Link to="/create-listing">
                  <Upload className="h-4 w-4 mr-1" /> New Listing
                </Link>
              </Button>
            </div>
            {listingsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map((p: any) => <VideoProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <Store className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">No Active Listings</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  You don't have any active listings yet. Create your first listing to start selling!
                </p>
                <Button asChild>
                  <Link to="/create-listing"><Upload className="h-4 w-4 mr-1" /> Create Listing</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            <h2 className="text-xl font-semibold mb-4">Sold Items</h2>
            {soldLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : soldItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {soldItems.map((p: any) => <VideoProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">No Sold Items</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You haven't sold any items yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            <h2 className="text-xl font-semibold mb-4">Favorite Items</h2>
            {favLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : favoriteItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {favoriteItems.map((p: any) => (
                  <VideoProductCard key={p.id} product={p} initialFavorited />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Tap the heart on any product to save it here for later.
                </p>
                <Button asChild>
                  <Link to="/">Browse products</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Help & Safety Section */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-bold mb-6">Help & Safety</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/contact" className="p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors flex flex-col gap-1">
              <span className="font-bold text-sm">Contact Support</span>
              <span className="text-xs text-muted-foreground">Get help with your account or orders</span>
            </Link>
            <Link to="/faq" className="p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors flex flex-col gap-1">
              <span className="font-bold text-sm">F.A.Q.</span>
              <span className="text-xs text-muted-foreground">Common questions about TomaShops</span>
            </Link>
            <Link to="/privacy" className="p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors flex flex-col gap-1">
              <span className="font-bold text-sm">Privacy Policy</span>
              <span className="text-xs text-muted-foreground">How we handle your data</span>
            </Link>
            <Link to="/terms" className="p-4 rounded-lg bg-card border hover:border-primary/50 transition-colors flex flex-col gap-1">
              <span className="font-bold text-sm">Terms of Service</span>
              <span className="text-xs text-muted-foreground">Rules for using our platform</span>
            </Link>
            <Link to="/delete-account" className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 hover:border-red-500/30 transition-colors flex flex-col gap-1">
              <span className="font-bold text-sm text-red-500">Delete Account</span>
              <span className="text-xs text-red-500/60">Permanently remove your account and data</span>
            </Link>
          </div>
          <div className="mt-8 text-center">
            <Button variant="ghost" size="sm" onClick={() => { if(confirm("Are you sure you want to sign out?")) signOut(); }} className="text-muted-foreground">
              Sign Out
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
