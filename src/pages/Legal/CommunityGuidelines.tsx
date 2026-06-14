import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

const CommunityGuidelines = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl prose prose-lg">
        <div className="mb-4"><BackButton /></div>
      <h1 className="text-3xl font-bold mb-6">Community guidelines</h1>
      <p>TomaShops is a marketplace built on trust. By using the platform, you agree to follow these rules.</p>

      <h2 className="text-xl font-semibold mt-6 mb-3">Prohibited items</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Weapons, ammunition, and explosives</li>
        <li>Illegal drugs and drug paraphernalia</li>
        <li>Counterfeit or stolen goods</li>
        <li>Recalled products</li>
        <li>Live animals</li>
        <li>Adult / sexually explicit content</li>
        <li>Items that violate intellectual property rights</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Prohibited behavior</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Fraud, scams, or misrepresenting an item</li>
        <li>Harassment, hate speech, or threats</li>
        <li>Sharing other users' personal information</li>
        <li>Spam, off-platform payment requests, or fee evasion</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-3">Reporting & enforcement</h2>
      <p>Use the Report button on any listing, profile, or message. Violations can result in listing removal, account suspension, or permanent ban. You can also block any user from their profile page.</p>

      <p className="mt-6">Questions? <a href="mailto:contactus@tomashops.online" className="text-primary">contactus@tomashops.online</a></p>
    </main>
    <Footer />
  </div>
);

export default CommunityGuidelines;
