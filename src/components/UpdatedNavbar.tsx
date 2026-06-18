import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Upload, Share2 } from 'lucide-react';
import UserMenu from './UserMenu';
import useModile from '@/hooks/use-mobile';

const UpdatedNavbar = () => {
  const { user, userType } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile } = useModile();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');

  useEffect(() => {
    if (!isMobile && isMenuOpen) setIsMenuOpen(false);
  }, [isMobile, isMenuOpen]);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-background border-b-4 border-black sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display text-3xl leading-none text-foreground drop-shadow-[2px_2px_0px_#ff5722] group-hover:drop-shadow-[2px_2px_0px_#ffeb3b] transition-all">
              TomaShops
            </span>
          </Link>

          <form onSubmit={submitSearch} className="hidden md:flex items-center flex-1 mx-6">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
              <Input
                type="search"
                placeholder="SEARCH PRODUCTS, SELLERS..."
                className="pl-10 border-2 border-black rounded-none font-bold uppercase text-xs tracking-wider placeholder:text-foreground/40 focus-visible:ring-0 focus-visible:bg-secondary"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-3">
            <Button asChild variant="ghost" className="rounded-none border-2 border-black font-black uppercase tracking-wider brutal-press hover:bg-secondary">
              <Link to="/share">
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Link>
            </Button>
            {user && userType === 'seller' && (
              <Button asChild className="bg-primary hover:bg-primary text-primary-foreground border-2 border-black rounded-none font-black uppercase tracking-wider brutal-shadow brutal-press">
                <Link to="/create-listing">
                  <Upload className="h-4 w-4 mr-1" /> List Item
                </Link>
              </Button>
            )}
            <UserMenu />
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              className="rounded-none border-2 border-black brutal-shadow"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t-4 border-black">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={submitSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground" />
              <Input
                type="search"
                placeholder="SEARCH..."
                className="pl-10 border-2 border-black rounded-none font-bold uppercase text-xs tracking-wider"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>

            <nav className="space-y-1 font-bold uppercase text-sm tracking-wider">
              <Link to="/" className="block py-2 hover:bg-secondary px-3 border-l-4 border-transparent hover:border-black" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/share" className="flex items-center py-2 hover:bg-secondary px-3 border-l-4 border-transparent hover:border-black" onClick={() => setIsMenuOpen(false)}><Share2 className="h-4 w-4 mr-2" /> Share TomaShops</Link>
              {user ? (
                <>
                  <Link to="/profile" className="block py-2 hover:bg-secondary px-3 border-l-4 border-transparent hover:border-black" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                  <Link to="/favorites" className="block py-2 hover:bg-secondary px-3 border-l-4 border-transparent hover:border-black" onClick={() => setIsMenuOpen(false)}>Favorites</Link>
                  <Link to="/messages" className="block py-2 hover:bg-secondary px-3 border-l-4 border-transparent hover:border-black" onClick={() => setIsMenuOpen(false)}>Messages</Link>
                  {userType === 'seller' && (
                    <>
                      <Link to="/my-listings" className="block py-2 hover:bg-secondary px-3 border-l-4 border-transparent hover:border-black" onClick={() => setIsMenuOpen(false)}>My Listings</Link>
                      <Link to="/create-listing" className="flex items-center py-2 hover:bg-secondary px-3 border-l-4 border-transparent hover:border-black" onClick={() => setIsMenuOpen(false)}>
                        <Upload className="h-4 w-4 mr-2" /> List an Item
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link to="/auth/login" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-none border-2 border-black font-black uppercase tracking-wider brutal-shadow">Sign In</Button>
                  </Link>
                  <Link to="/auth/register" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground rounded-none border-2 border-black font-black uppercase tracking-wider brutal-shadow">Sign Up</Button>
                  </Link>
                </div>
              )}
              <div className="pt-3 mt-3 border-t-2 border-black text-xs">
                <Link to="/faq" className="block py-1.5 hover:text-primary px-3" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                <Link to="/safety" className="block py-1.5 hover:text-primary px-3" onClick={() => setIsMenuOpen(false)}>Safety</Link>
                <Link to="/contact" className="block py-1.5 hover:text-primary px-3" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default UpdatedNavbar;
