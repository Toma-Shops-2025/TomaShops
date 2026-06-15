import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import UpdatedNavbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import { Database, Trash2 } from 'lucide-react';

type Scope = 'listings' | 'messages' | 'favorites' | 'blocks' | 'reports' | 'profile_info';

const SCOPES: { id: Scope; label: string; desc: string }[] = [
  { id: 'listings', label: 'My Listings', desc: 'Delete every product you have listed.' },
  { id: 'messages', label: 'Messages & Conversations', desc: 'Delete all messages you have sent and your conversations.' },
  { id: 'favorites', label: 'Favorites', desc: 'Clear all items you have favorited.' },
  { id: 'blocks', label: 'Blocked Users', desc: 'Clear your block list.' },
  { id: 'reports', label: 'Reports You Submitted', desc: 'Delete reports you have filed.' },
  { id: 'profile_info', label: 'Profile Info', desc: 'Clear name, avatar, bio, location, phone, website (keeps account active).' },
];

const DeleteData = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<Set<Scope>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggle = (id: Scope) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleDelete = async () => {
    if (selected.size === 0) {
      toast.error('Select at least one item to delete.');
      return;
    }
    if (!confirm('This permanently deletes the selected data. Continue?')) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('delete-data', {
        body: { scopes: Array.from(selected) },
      });
      if (error) throw error;
      toast.success('Selected data has been deleted.');
      setSelected(new Set());
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <UpdatedNavbar />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <div className="border-4 border-black bg-card brutal-shadow p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-accent border-4 border-black p-2">
              <Database className="h-6 w-6 text-accent-foreground" />
            </div>
            <h1 className="font-display text-4xl">Delete My Data</h1>
          </div>

          <p className="font-bold uppercase text-xs tracking-wider mb-6 bg-secondary border-2 border-black px-3 py-2 inline-block">
            TomaShops — Request data deletion without closing your account
          </p>

          <div className="space-y-3 text-sm mb-6">
            <p>
              You can request deletion of specific data while keeping your TomaShops account
              active. Each option below permanently removes the selected data and cannot be undone.
            </p>
            <p>
              Want to close your account entirely?{' '}
              <Link to="/delete-account" className="underline font-bold">
                Delete your account →
              </Link>
            </p>
          </div>

          {!user ? (
            <div className="space-y-3">
              <p className="text-sm">Please sign in to request data deletion.</p>
              <Link to="/auth/login">
                <Button className="rounded-none border-2 border-black font-black uppercase brutal-shadow">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {SCOPES.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-start gap-3 border-2 border-black p-3 cursor-pointer hover:bg-secondary"
                  >
                    <Checkbox
                      checked={selected.has(s.id)}
                      onCheckedChange={() => toggle(s.id)}
                      className="mt-0.5 rounded-none border-2 border-black"
                    />
                    <div>
                      <div className="font-bold uppercase text-sm tracking-wider">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleDelete}
                  disabled={loading || selected.size === 0}
                  className="bg-primary hover:bg-primary text-primary-foreground rounded-none border-2 border-black font-black uppercase brutal-shadow"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {loading ? 'Deleting...' : `Delete Selected (${selected.size})`}
                </Button>
                <Link to="/profile">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto rounded-none border-2 border-black font-black uppercase brutal-shadow"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black text-xs text-muted-foreground space-y-2">
                <p className="font-bold uppercase tracking-wider text-foreground">Prefer to email us?</p>
                <p>
                  Send a request to{' '}
                  <a href="mailto:privacy@tomashops.shop" className="underline font-bold">
                    privacy@tomashops.shop
                  </a>{' '}
                  from the email on your account. Include which data you want deleted. We respond
                  within 30 days.
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeleteData;
