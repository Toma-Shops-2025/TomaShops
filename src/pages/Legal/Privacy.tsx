
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-4"><BackButton /></div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-lg">
            <p className="text-muted-foreground">Last updated: May 12, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p>
              This Privacy Policy explains how TomaShops ("we", "us", or "our") collects, uses, discloses, and safeguards your information when you use our website and services (the "Platform"). We respect your privacy and are committed to protecting your personal information.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Personal identification information (name, email address, phone number)</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Payment information</li>
              <li>Listing details and content</li>
              <li>Communications with other users</li>
            </ul>
            <p>
              We also collect information automatically when you use our Platform, including:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Device information</li>
              <li>Log data</li>
              <li>Usage information</li>
              <li>Location information</li>
              <li>Cookies and similar technologies</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
            <p>
              We use your information for various purposes, including:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Providing and maintaining our Platform</li>
              <li>Processing transactions</li>
              <li>Improving the user experience</li>
              <li>Communicating with you</li>
              <li>Ensuring compliance with our policies</li>
              <li>Analyzing usage patterns</li>
              <li>Marketing and advertising</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Information Sharing</h2>
            <p>
              We may share your information with:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Other users (as necessary for transactions)</li>
              <li>Service providers</li>
              <li>Legal authorities (when required by law)</li>
              <li>Business partners</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-5 my-3 space-y-1">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Children's Privacy</h2>
            <p>
              Our Platform is not intended for children under 13. We do not knowingly collect information from children under 13.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@tomashops.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
