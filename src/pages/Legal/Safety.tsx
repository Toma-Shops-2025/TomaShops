import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

const Safety = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl prose prose-lg">
        <div className="mb-4"><BackButton /></div>
      <h1 className="text-3xl font-bold mb-6">Safety tips</h1>
      <h2 className="text-xl font-semibold mt-6 mb-3">For buyers</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Watch the full video listing before committing.</li>
        <li>Pay only through TomaShops checkout — never wire money or pay off-platform.</li>
        <li>Read the seller's ratings and reviews.</li>
        <li>If meeting in person, choose a public, well-lit place.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">For sellers</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Record an honest, well-lit video showing the actual item.</li>
        <li>Ship with tracking and keep proof.</li>
        <li>Communicate only through TomaShops messages.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-3">Report anything suspicious</h2>
      <p>Use the Report button on any listing or profile, or email <a href="mailto:contactus@tomashops.shop" className="text-primary">contactus@tomashops.shop</a>.</p>
    </main>
    <Footer />
  </div>
);

export default Safety;
