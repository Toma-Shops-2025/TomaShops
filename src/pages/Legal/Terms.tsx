
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose prose-lg">
            <p className="text-gray-600">Last updated: May 12, 2025</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using TomaShops ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Services Description</h2>
            <p>
              TomaShops provides an online marketplace that connects buyers and sellers. Our platform allows users to list, discover, and purchase products through video-first commerce.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
            <p>
              Users must create an account to access certain features of the Platform. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Listing & Selling</h2>
            <p>
              Sellers are responsible for the accuracy of their listings, including descriptions, prices, and images/videos. All items must comply with our prohibited items policy. TomaShops reserves the right to remove listings that violate our policies.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Buying</h2>
            <p>
              When making a purchase, buyers agree to complete the transaction as described in the listing. Buyers are responsible for reading the full item description before purchasing.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Fees & Payments</h2>
            <p>
              TomaShops may charge fees for certain services. All fees will be clearly communicated. Payment processing is handled securely through our payment providers.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Content & Intellectual Property</h2>
            <p>
              Users retain ownership of their content but grant TomaShops a license to use, reproduce, and display the content on the Platform. Users must not upload content that infringes on others' intellectual property rights.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Prohibited Activities</h2>
            <p>
              Users are prohibited from engaging in illegal activities, harassment, spamming, or any action that compromises the integrity of the Platform.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Privacy</h2>
            <p>
              Our Privacy Policy describes how we collect, use, and protect your personal information.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. Termination</h2>
            <p>
              TomaShops reserves the right to terminate or suspend accounts that violate these terms or for any other reason at our discretion.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">11. Limitation of Liability</h2>
            <p>
              TomaShops is not liable for disputes between users. We provide the platform but do not guarantee the quality, safety, or legality of items sold.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">12. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified terms.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">13. Contact</h2>
            <p>
              For questions regarding these Terms, please contact us at support@tomashops.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
