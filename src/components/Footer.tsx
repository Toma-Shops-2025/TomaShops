import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background mt-16 border-t-4 border-black">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-5xl leading-none drop-shadow-[3px_3px_0px_#ff5722]">
                TomaShops
              </span>
            </Link>
            <p className="text-sm text-background/70 max-w-sm uppercase tracking-wide font-medium">
              The video-first marketplace. Every listing is a video — so you see exactly what you're buying. Direct, affiliate, or dropship.
            </p>
            <p className="text-sm">
              <a href="mailto:contactus@tomashops.shop" className="bg-primary text-primary-foreground px-3 py-1 border-2 border-background font-black uppercase tracking-wider hover:bg-secondary hover:text-foreground transition-colors">
                contactus@tomashops.shop
              </a>
            </p>
          </div>

          <FooterCol title="Marketplace" links={[
            ['/', 'Browse'],
            ['/create-listing', 'Sell an item'],
            ['/messages', 'Messages'],
            ['/profile', 'My account'],
          ]} />

          <FooterCol title="Help & Safety" links={[
            ['/faq', 'FAQ'],
            ['/safety', 'Safety tips'],
            ['/community-guidelines', 'Community'],
            ['/contact', 'Contact us'],
          ]} />

          <FooterCol title="Legal" links={[
            ['/terms', 'Terms'],
            ['/privacy', 'Privacy'],
            ['/cookies', 'Cookies'],
            ['/community-guidelines', 'Acceptable Use'],
          ]} />
        </div>

        <div className="mt-10 pt-6 border-t-2 border-background/30 text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between gap-2">
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

const FooterCol = ({ title, links }: { title: string; links: [string, string][] }) => (
  <div>
    <h4 className="font-black uppercase tracking-widest mb-4 text-sm bg-primary text-primary-foreground inline-block px-2 py-0.5">{title}</h4>
    <ul className="space-y-2 text-sm font-bold uppercase tracking-wide">
      {links.map(([to, label]) => (
        <li key={to + label}>
          <Link to={to} className="text-background/80 hover:text-secondary transition-colors">{label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
