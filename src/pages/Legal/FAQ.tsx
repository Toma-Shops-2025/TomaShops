import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'What is TomaShops?', a: 'TomaShops is a video-first marketplace. Every listing includes a short video so you can see the item before you buy.' },
  { q: 'Is it free to use?', a: 'Browsing and listing are free. Payment processing fees may apply at checkout.' },
  { q: 'How do I list an item?', a: 'Create an account, switch your profile to seller, then tap "List an Item" and upload a short video plus the item details.' },
  { q: 'How do payments work?', a: 'Payments are processed securely through our payment partner. Funds are released to the seller once delivery is confirmed.' },
  { q: 'What can I do if I have a problem with a user?', a: 'Use the Report button on any listing or profile, or block the user from their profile. Our trust & safety team reviews every report.' },
  { q: 'How do I delete my account?', a: 'Email contactus@tomashops.online from your account email and we\'ll permanently delete your account within 30 days.' },
  { q: 'Is TomaShops available outside the US?', a: 'We\'re rolling out region by region. Join the waitlist on our homepage to be notified when we launch in your country.' },
];

const FAQ = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Frequently asked questions</h1>
      <p className="text-muted-foreground mb-8">Quick answers to the most common questions.</p>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-8 text-sm text-muted-foreground">
        Still stuck? <a href="mailto:contactus@tomashops.online" className="text-primary underline">contactus@tomashops.online</a>
      </p>
    </main>
    <Footer />
  </div>
);

export default FAQ;
