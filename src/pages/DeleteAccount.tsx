import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import UpdatedNavbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteAccount = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const canDelete = confirmText === 'DELETE' && acknowledged && !!user;

  const handleDelete = async () => {
    if (!canDelete) return;
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      if (error) throw error;
      toast.success('Your account has been permanently deleted.');
      await signOut().catch(() => {});
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete account');
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
            <div className="bg-primary border-4 border-black p-2">
              <AlertTriangle className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl">Delete Account</h1>
          </div>

          <p className="font-bold uppercase text-xs tracking-wider mb-6 bg-secondary border-2 border-black px-3 py-2 inline-block">
            This action is permanent and cannot be undone
          </p>

          {!user ? (
            <div className="space-y-4">
              <p>You must be signed in to delete your account.</p>
              <Link to="/auth/login">
                <Button className="rounded-none border-2 border-black font-black uppercase brutal-shadow">
                  Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 text-sm mb-6">
                <p>Deleting your account will permanently remove:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your profile and account credentials</li>
                  <li>All of your product listings</li>
                  <li>Your messages and conversations</li>
                  <li>Your favorites, blocks, and reports</li>
                </ul>
                <p className="pt-2">
                  Signed in as <span className="font-bold">{user.email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox
                    checked={acknowledged}
                    onCheckedChange={(v) => setAcknowledged(v === true)}
                    className="mt-0.5 rounded-none border-2 border-black"
                  />
                  <span>I understand this is permanent and my data cannot be recovered.</span>
                </label>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                    Type <span className="text-primary">DELETE</span> to confirm
                  </label>
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="rounded-none border-2 border-black font-bold uppercase"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleDelete}
                    disabled={!canDelete || loading}
                    className="bg-primary hover:bg-primary text-primary-foreground rounded-none border-2 border-black font-black uppercase brutal-shadow"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {loading ? 'Deleting...' : 'Permanently Delete My Account'}
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
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Need help instead?{' '}
          <Link to="/contact" className="underline font-bold">
            Contact support
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default DeleteAccount;
