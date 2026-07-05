import { useEffect, useState } from "react";
import { Zap, ShoppingBag, Upload, Smartphone, ChevronRight, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "tomashops:onboarded";

const slides = [
  {
    icon: ShoppingBag,
    title: "Welcome to TomaShops",
    body: "The video-first marketplace. No more grainy photos — every listing is a real video so you see exactly what you're getting.",
    color: "bg-primary",
  },
  {
    icon: Smartphone,
    title: "Swipe to Discover",
    body: "Use the 'Scroll Feed' to swipe through products just like your favorite social apps. Tap volume to unmute and see it in action.",
    color: "bg-secondary",
  },
  {
    icon: Zap,
    title: "Three Ways to Shop",
    body: "Buy direct from local sellers, tap affiliate links for new gear, or shop dropship stores — all in one feed.",
    color: "bg-primary",
  },
  {
    icon: Upload,
    title: "Free to Sell",
    body: "Post your own videos to list items. No listing fees, no commissions. Your hustle is yours to keep.",
    color: "bg-foreground",
  },
];

export function OnboardingWalkthrough() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show if the user is logged in AND has not finished onboarding on this device yet
    if (!user) {
      setOpen(false);
      return;
    }

    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, [user]);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  const slide = slides[step];
  const Icon = slide.icon;
  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md sm:items-center p-4">
      <div className="relative w-full max-w-sm border-4 border-black bg-background brutal-shadow-xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={finish}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border-2 border-black bg-background brutal-press hover:bg-secondary"
          aria-label="Skip"
        >
          <X className="h-5 w-5" />
        </button>

        <div className={`flex h-16 w-16 items-center justify-center border-4 border-black ${slide.color} ${slide.color === 'bg-foreground' ? 'text-background' : 'text-foreground'} brutal-shadow mb-6`}>
          <Icon className="h-8 w-8" />
        </div>

        <h2 className="font-display text-3xl leading-none mb-4">{slide.title}</h2>
        <p className="text-sm font-bold uppercase tracking-tight text-foreground/80 leading-relaxed mb-8">
          {slide.body}
        </p>

        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-3 rounded-none border-2 border-black transition-all ${
                i === step ? "w-8 bg-primary" : "w-3 bg-background"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={finish}
            className="text-xs font-black uppercase tracking-widest hover:underline"
          >
            Skip Intro
          </button>

          <Button
            onClick={() => isLast ? finish() : setStep(s => s + 1)}
            className="flex-1 h-14 bg-primary hover:bg-primary text-primary-foreground border-4 border-black rounded-none font-black uppercase tracking-widest brutal-shadow brutal-press"
          >
            {isLast ? "Let's Go!" : "Next Step"}
            {!isLast && <ChevronRight className="ml-1 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
