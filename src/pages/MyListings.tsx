import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import VideoProductCard from '@/components/VideoProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Store, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import BackButton from '@/components/BackButton';

const MyListings = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: listings, isLoading } = useQuery({
    queryKey: ['my-listings', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user!.id)
        .order('datePosted', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Listing deleted');
      qc.invalidateQueries({ queryKey: ['my-listings', user?.id] });
      qc.invalidateQueries({ queryKey: ['products'] });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4"><BackButton /></div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-5xl md:text-6xl leading-none drop-shadow-[3px_3px_0px_#ff5722]">My Listings</h1>
          <Button asChild className="bg-brand-gradient hover:opacity-90">
            <Link to="/create-listing">
              <Upload className="h-4 w-4 mr-1" /> New Listing
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listings.map((p: any) => (
              <div key={p.id} className="relative">
                <VideoProductCard product={p} />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute bottom-3 right-3 z-10 opacity-90"
                  onClick={() => handleDelete(p.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-2">No listings yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Create your first listing to start selling on TomaShops.
            </p>
            <Button asChild className="bg-brand-gradient hover:opacity-90">
              <Link to="/create-listing">
                <Upload className="h-4 w-4 mr-1" /> Create Listing
              </Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyListings;
