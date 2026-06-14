import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

const Cookies = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl prose prose-lg">
        <div className="mb-4"><BackButton /></div>
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <p>TomaShops uses cookies and similar technologies to keep you signed in, remember your preferences, and understand how the marketplace is used.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">Categories of cookies we use</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Strictly necessary</strong>: authentication, security, load balancing. Cannot be disabled.</li>
        <li><strong>Functional</strong>: remember UI preferences and language.</li>
        <li><strong>Analytics</strong>: anonymous usage data so we can improve the product.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">Managing cookies</h2>
      <p>You can clear or block cookies through your browser settings. Note that disabling strictly necessary cookies will prevent you from signing in.</p>
      <h2 className="text-xl font-semibold mt-6 mb-3">Contact</h2>
      <p>Questions about cookies? Email <a href="mailto:contactus@tomashops.shop" className="text-primary">contactus@tomashops.shop</a>.</p>
    </main>
    <Footer />
  </div>
);

export default Cookies;
