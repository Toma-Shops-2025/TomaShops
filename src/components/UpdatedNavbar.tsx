import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Upload } from 'lucide-react';
import UserMenu from './UserMenu';
import useModile from '@/hooks/use-mobile';
import logo from '@/assets/logo.png';

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
    <header className="bg-background/95 backdrop-blur border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TomaShops" width={32} height={32} className="h-8 w-8" />
            <span className="font-bold text-xl text-brand-gradient">TomaShops</span>
          </Link>

          <form onSubmit={submitSearch} className="hidden md:flex items-center flex-1 mx-6">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, sellers, categories..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-4">
            {user && userType === 'seller' && (
              <Button asChild className="bg-brand-gradient hover:opacity-90">
                <Link to="/create-listing">
                  <Upload className="h-4 w-4 mr-1" /> List an Item
                </Link>
              </Button>
            )}
            <UserMenu />
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="container mx-auto px-4 py-4">
            <form onSubmit={submitSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, sellers..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>

            <nav className="space-y-1">
              <Link to="/" className="block py-2 hover:bg-muted rounded-md px-3" onClick={() => setIsMenuOpen(false)}>Home</Link>
              {user ? (
                <>
                  <Link to="/profile" className="block py-2 hover:bg-muted rounded-md px-3" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                  <Link to="/favorites" className="block py-2 hover:bg-muted rounded-md px-3" onClick={() => setIsMenuOpen(false)}>Favorites</Link>
                  <Link to="/messages" className="block py-2 hover:bg-muted rounded-md px-3" onClick={() => setIsMenuOpen(false)}>Messages</Link>
                  {userType === 'seller' && (
                    <>
                      <Link to="/my-listings" className="block py-2 hover:bg-muted rounded-md px-3" onClick={() => setIsMenuOpen(false)}>My Listings</Link>
                      <Link to="/create-listing" className="flex items-center py-2 hover:bg-muted rounded-md px-3" onClick={() => setIsMenuOpen(false)}>
                        <Upload className="h-4 w-4 mr-2" /> List an Item
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <div className="pt-2 space-y-2">
                  <Link to="/auth/login" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/auth/register" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-brand-gradient">Sign Up</Button>
                  </Link>
                </div>
              )}
              <div className="pt-3 mt-3 border-t text-sm">
                <Link to="/faq" className="block py-1.5 text-muted-foreground hover:text-primary px-3" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                <Link to="/safety" className="block py-1.5 text-muted-foreground hover:text-primary px-3" onClick={() => setIsMenuOpen(false)}>Safety</Link>
                <Link to="/contact" className="block py-1.5 text-muted-foreground hover:text-primary px-3" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default UpdatedNavbar;
