import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import VideoProductCard from '@/components/VideoProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          product_id,
          products:product_id (
            *,
            seller:profiles!products_seller_id_fkey ( id, full_name, avatar_url, rating )
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((row: any) => row.products).filter(Boolean);
    },
  });

  const handleUnfavorite = (productId: string) => {
    qc.setQueryData(['favorites', user?.id], (old: any[] = []) =>
      old.filter((p) => p?.id !== productId)
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Favorites</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((p: any) => (
              <VideoProductCard
                key={p.id}
                product={p}
                initialFavorited
                onUnfavorite={handleUnfavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Tap the heart on any product to save it here for later.
            </p>
            <Button asChild className="bg-brand-gradient hover:opacity-90">
              <Link to="/">Browse products</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
