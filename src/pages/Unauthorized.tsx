
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
          
          <p className="text-muted-foreground mt-2">
            Sorry, you don't have permission to access this page. This area is restricted to sellers only.
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/auth/register">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Register as Seller
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unauthorized;
