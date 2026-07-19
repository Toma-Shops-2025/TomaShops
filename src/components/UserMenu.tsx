
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Settings,
  MessageSquare,
  LogOut,
  Heart,
  ShoppingBag,
  Package,
  Upload,
  Share2,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const UserMenu = () => {
  const { user, signOut, userType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { setTheme, theme } = useTheme();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/auth/login">
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link to="/auth/register">
          <Button>Sign Up</Button>
        </Link>
      </div>
    );
  }

  // Get user initials for avatar fallback
  const emailParts = user.email?.split('@')[0].split('.') || ['U'];
  const initials = emailParts
    .map(part => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {userType && (
              <span className="mt-1 text-xs bg-muted text-primary py-0.5 px-2 rounded-full inline-flex items-center">
                {userType === 'seller' ? 'Seller' : 'Buyer'}
              </span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/messages">
          <DropdownMenuItem>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </DropdownMenuItem>
        </Link>

        {userType === 'buyer' ? (
          <>
            <Link to="/profile?tab=favorites">
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/profile?tab=purchases">
              <DropdownMenuItem>
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Purchases</span>
              </DropdownMenuItem>
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile?tab=listings">
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" />
                <span>My Listings</span>
              </DropdownMenuItem>
            </Link>
            <Link to="/create-listing">
              <DropdownMenuItem>
                <Upload className="mr-2 h-4 w-4" />
                <span>Create Listing</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}

        <Link to="/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        <Link to="/share">
          <DropdownMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share TomaShops</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground pb-1">Theme</DropdownMenuLabel>
        <div className="flex items-center gap-1 px-2 pb-2">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md transition-colors ${theme === 'light' ? 'bg-secondary text-primary ring-1 ring-black' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Sun className="h-4 w-4 mb-1" />
            <span className="text-[9px] uppercase font-bold">Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md transition-colors ${theme === 'dark' ? 'bg-secondary text-primary ring-1 ring-black' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Moon className="h-4 w-4 mb-1" />
            <span className="text-[9px] uppercase font-bold">Dark</span>
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md transition-colors ${theme === 'system' ? 'bg-secondary text-primary ring-1 ring-black' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Monitor className="h-4 w-4 mb-1" />
            <span className="text-[9px] uppercase font-bold">System</span>
          </button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-slate-500 rounded-full"></div>
              <span>Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
