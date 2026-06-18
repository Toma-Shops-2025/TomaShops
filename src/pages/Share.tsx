import { useRef, useState } from 'react';
import { Copy, Share2, Download, Check } from 'lucide-react';
import Navbar from '@/components/UpdatedNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import qrAsset from '@/assets/tomashops-qr.png.asset.json';

const SHARE_URL = 'https://tomashops.shop';
const QR_SRC = qrAsset.url;

const Share = () => {
  const qrWrapRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Copy failed');
    }
  };

  const handleShare = async () => {
    const data = {
      title: 'TomaShops — Video 1st Marketplace',
      text: 'See it. Shop it. Tap buy. Every listing is a video.',
      url: SHARE_URL,
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      handleCopy();
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(QR_SRC);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tomashops-qr.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Download failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-block chip-listing chip-direct mb-4">Spread The Word</div>
          <h1 className="font-display text-5xl md:text-6xl leading-none mb-3">Share TomaShops</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Scan, tap, or copy — get your people on the feed.
          </p>
        </div>

        <div className="bg-background border-4 border-black brutal-shadow-xl p-6 md:p-10">
          <div
            ref={qrWrapRef}
            className="bg-white rounded-3xl border-4 border-black p-6 md:p-8 flex items-center justify-center mx-auto max-w-xs"
          >
            <img
              src={QR_SRC}
              alt="Scan to visit tomashops.shop"
              className="w-full h-auto select-none"
              draggable={false}
            />
          </div>

          <p className="text-center mt-6 font-display text-2xl break-all">{SHARE_URL.replace('https://', '')}</p>

          <div className="grid sm:grid-cols-3 gap-3 mt-8">
            <Button
              onClick={handleCopy}
              className="bg-background text-foreground hover:bg-secondary rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press h-14"
            >
              {copied ? <Check className="h-5 w-5 mr-2" /> : <Copy className="h-5 w-5 mr-2" />}
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
            <Button
              onClick={handleShare}
              className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press h-14"
            >
              <Share2 className="h-5 w-5 mr-2" /> Share
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-primary text-primary-foreground hover:bg-foreground hover:text-background rounded-none border-4 border-black font-black uppercase tracking-widest brutal-shadow brutal-press h-14"
            >
              <Download className="h-5 w-5 mr-2" /> Save QR
            </Button>
          </div>
        </div>

        <p className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground mt-6">
          Free forever · Video listings · Direct, affiliate &amp; dropship
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Share;
