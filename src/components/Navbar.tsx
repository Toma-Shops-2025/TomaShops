
import { Link } from 'react-router-dom';
import { Bell, Search, MessageCircle, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background shadow-sm border-b px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              TomaShops
            </span>
            <div className="hidden md:block px-2 py-1 bg-muted text-primary rounded-md text-xs">
              Video 1st
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-2">
          <Link to="/messages">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="default" className="hidden md:flex">
            Sell Now
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
