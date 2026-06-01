import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-muted/40 mt-12 border-t">
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="TomaShops logo" width={32} height={32} className="h-8 w-8" />
              <span className="font-bold text-xl text-brand-gradient">TomaShops</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              The video-first marketplace. Every listing is a video, so you see exactly what you're buying.
            </p>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:contactus@tomashops.online" className="hover:text-primary">contactus@tomashops.online</a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Marketplace</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Browse</Link></li>
              <li><Link to="/create-listing" className="text-muted-foreground hover:text-primary">Sell an item</Link></li>
              <li><Link to="/messages" className="text-muted-foreground hover:text-primary">Messages</Link></li>
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary">My account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Help & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              <li><Link to="/safety" className="text-muted-foreground hover:text-primary">Safety tips</Link></li>
              <li><Link to="/community-guidelines" className="text-muted-foreground hover:text-primary">Community guidelines</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
              <li><Link to="/community-guidelines" className="text-muted-foreground hover:text-primary">Acceptable Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <div>&copy; {new Date().getFullYear()} TomaShops. All rights reserved.</div>
          <div className="space-x-4">
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            <Link to="/cookies" className="hover:text-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
