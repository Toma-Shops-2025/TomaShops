import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import { Mail, MessageCircle, ShieldAlert } from 'lucide-react';

const Contact = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Contact TomaShops</h1>
      <p className="text-muted-foreground mb-8">We typically reply within 1 business day.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <a href="mailto:contactus@tomashops.online" className="border rounded-xl p-6 hover:shadow-brand transition">
          <Mail className="h-6 w-6 text-primary mb-3" />
          <div className="font-semibold">General support</div>
          <div className="text-sm text-muted-foreground">contactus@tomashops.online</div>
        </a>
        <a href="mailto:contactus@tomashops.online?subject=Trust%20%26%20Safety%20Report" className="border rounded-xl p-6 hover:shadow-brand transition">
          <ShieldAlert className="h-6 w-6 text-primary mb-3" />
          <div className="font-semibold">Trust & safety</div>
          <div className="text-sm text-muted-foreground">Report fraud, abuse or policy violations</div>
        </a>
        <a href="mailto:contactus@tomashops.online?subject=Press%20Inquiry" className="border rounded-xl p-6 hover:shadow-brand transition">
          <MessageCircle className="h-6 w-6 text-primary mb-3" />
          <div className="font-semibold">Press & partnerships</div>
          <div className="text-sm text-muted-foreground">contactus@tomashops.online</div>
        </a>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Mailing address: TomaShops, online operations. Please use email for the fastest response.
      </p>
    </main>
    <Footer />
  </div>
);

export default Contact;
