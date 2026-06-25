import React, { useState, useEffect, useRef } from "react";
import { 
  Heart, Mail, HelpCircle, Gift, Sparkles, Clock 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnniversaryConfig, LoveCoupon } from "./types";
import { Confetti, ConfettiRef } from "./components/Confetti";
import { LoveEnvelope } from "./components/LoveEnvelope";
import { HeartJar } from "./components/HeartJar";
import { LoveCoupons } from "./components/LoveCoupons";
import { LoveQuiz } from "./components/LoveQuiz";
import { BoyfriendDashboard } from "./components/BoyfriendDashboard";
import { MusicPlayer } from "./components/MusicPlayer";

const DEFAULT_CONFIG: AnniversaryConfig = {
  senderName: "Miku",
  receiverName: "Kiku",
  anniversaryDate: "2025-06-26T00:00:00+05:30", // IST midnight — fixes the 5.5hr offset bug
  letterTitle: "To My Beautiful Kikuchan",
  letterContent: `Happy 1 Year Anniversary, my love!

This past year has been the most beautiful chapter of my life and the most favourite as well. From our very video call to our long late-night conversations, every moment spent with you is a memory I treasure.

You bring so much warmth joy and bahut sara laughter into my world. Thank you for being my biggest supporter and my favorite person.

Here is to one year of beautiful memories and a lifetime of adventures together.

With all my heart,`,
  reasons: [
    "The way your eyes light up when you laugh.",
    "How you always know exactly how to make me smile.",
    "Your beautiful, kind, and supportive heart.",
    "The warm and cozy feeling of holding your hand.",
    "Our endless late night video calls",
    "Your amazing way to tease,roast or even joke.",
    "The way you call with your leg to me.",
    "Your incredible strength and passion.",
    "How you make even the simplest calls feel like the best activity.",
    "Because being with you feels like being home my baby."
  ],
  coupons: [
    {
      id: "coupon-1",
      title: "Romantic Back Massage",
      description: "Redeemable for a relaxing full back massage.",
      iconName: "Flame",
      isRedeemed: false,
      redeemedDate: null
    },
    {
      id: "coupon-2",
      title: "Free Nominozz",
      description: "Redeemable for your favorite nominoz pizza baby",
      iconName: "Coffee",
      isRedeemed: false,
      redeemedDate: null
    },
    {
      id: "coupon-3",
      title: "Late Night Chitchat",
      description: "Redeemable for late night chitchat for how much time you want with me.(can be till 3am or 4am as well)",
      iconName: "Bike",
      isRedeemed: false,
      redeemedDate: null
    },
    {
      id: "coupon-4",
      title: "Movie Night Your Choice",
      description: "No arguments! We watch whatever rom-com, thriller, or show you pick my love.",
      iconName: "Ticket",
      isRedeemed: false,
      redeemedDate: null
    }
  ],
  memories: [
    {
      id: "mem-1",
      date: "",
      title: "Our First Meet Up",
      description: "Where we met at the mall, chitchat and realized we never wanted to say goodbye.",
      icon: "Coffee"
    },
    {
      id: "mem-2",
      date: "",
      title: "Late Night Talks",
      description: "Our magical walk under a canopy of stars, sharing our biggest dreams and laughing until our stomachs hurt.",
      icon: "Sparkles"
    },
    {
      id: "mem-3",
      date: "",
      title: "The Day We Became Official",
      description: "When I asked you to be my girl and you smiled that gorgeous smile and said Yes! My happiest day.",
      icon: "Heart"
    },
    {
      id: "mem-4",
      date: "",
      title: "First Valentine's Day",
      description: "One of fav day of my life and promises of a beautiful lifetime together.",
      icon: "Star"
    }
  ],
  quizQuestions: [
    {
      question: "Where did we go on our very first date?",
      options: ["Jublee Park", "Shreeleathers", "Abhilasha Ke Ghar", "PM Mall"],
      correctAnswerIndex: 3,
      explanation: ""
    },
    {
      question: "What is Mayank's favorite nickname for you?",
      options: ["Kikuchan", "Pookie", "Puchku", "Singh is king"],
      correctAnswerIndex: 2,
      explanation: ""
    },
    {
      question: "Which of these is Kiku and Miku ka favourite activity?",
      options: ["Bhakchodi", "Sutta Fukna", "Music Sunna", "Mutthi Marna"],
      correctAnswerIndex: 0,
      explanation: ""
    },
    {
      question: "Who said I love you first among us?",
      options: ["Not Me", "Me", "Seriously not me", "You"],
      correctAnswerIndex: 1,
      explanation: ""
    }
  ],
  bgPhotos: [
    "/5.jpeg",
    "/2.jpeg",
    "/3.jpeg",
    "/4.jpeg"
  ],
  bgOpacity: 50,
  bgBlur: 2,
  activeBgMode: "photo"
};

export default function App() {
  const [config, setConfig] = useState<AnniversaryConfig>(() => {
    const saved = localStorage.getItem("our_anniversary_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate any stale date strings to the IST-correct format
        if (
          parsed.anniversaryDate === "2025-06-25" ||
          parsed.anniversaryDate === "2025-06-26"
        ) {
          parsed.anniversaryDate = "2025-06-26T00:00:00+05:30";
          localStorage.setItem("our_anniversary_config", JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing stored config, using defaults", e);
      }
    }
    return DEFAULT_CONFIG;
  });

  const [timeSince, setTimeSince] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFutureCountdown, setIsFutureCountdown] = useState<boolean>(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"letter" | "jar" | "coupons" | "quiz">("letter");

  const confettiRef = useRef<ConfettiRef | null>(null);

  // Auto-slide background photos
  useEffect(() => {
    const photos = config.bgPhotos || [];
    if (photos.length <= 1 || config.activeBgMode !== "photo") return;

    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % photos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [config.bgPhotos, config.activeBgMode]);

  // Synchronize config to local storage
  const handleSaveConfig = (updatedConfig: AnniversaryConfig) => {
    setConfig(updatedConfig);
    localStorage.setItem("our_anniversary_config", JSON.stringify(updatedConfig));
  };

  // Ticking calculation for the relationship countdown clock
  useEffect(() => {
    const updateCountdown = () => {
      const anniversary = new Date(config.anniversaryDate);
      const now = new Date();
      let diff = now.getTime() - anniversary.getTime();

      if (diff < 0) {
        setIsFutureCountdown(true);
        diff = Math.abs(diff);
      } else {
        setIsFutureCountdown(false);
      }

      const totalSeconds = Math.floor(diff / 1000);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const totalHours = Math.floor(totalMinutes / 60);
      const hours = totalHours % 24;
      const totalDays = Math.floor(totalHours / 24);

      const years = Math.floor(totalDays / 365);
      const remainingDays = totalDays % 365;

      setTimeSince({
        years,
        days: remainingDays,
        hours,
        minutes,
        seconds
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.anniversaryDate]);

  // Handle Coupon Redemptions
  const handleRedeemCoupon = (couponId: string) => {
    const updatedCoupons = config.coupons.map((c) => {
      if (c.id === couponId) {
        return {
          ...c,
          isRedeemed: true,
          redeemedDate: new Date().toISOString()
        };
      }
      return c;
    });

    const updatedConfig = { ...config, coupons: updatedCoupons };
    handleSaveConfig(updatedConfig);
    
    // Shoot confetti!
    confettiRef.current?.burst();
  };

  const handleTriggerConfetti = () => {
    confettiRef.current?.burst();
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#5d4037] flex flex-col font-sans selection:bg-[#efebe9] selection:text-[#5d4037] pb-16 relative overflow-x-hidden">
      {/* Sparkles background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#d5bdaf_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

      {/* Custom Background Photo Slideshow */}
      {config.activeBgMode === "photo" && config.bgPhotos && config.bgPhotos.length > 0 && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={bgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: (config.bgOpacity ?? 12) / 100 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={config.bgPhotos[bgIndex % config.bgPhotos.length]}
                alt="Romantic Background Moment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${config.bgBlur ?? 3}px)`,
                }}
              />
            </motion.div>
          </AnimatePresence>
          {/* Subtle overlay to ensure beautiful warm blending and perfect contrast for light theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfaf6]/60 via-transparent to-[#fdfaf6]/60" />
        </div>
      )}

      {/* Floating hearts container decor */}
      <div className="absolute top-12 left-10 text-[#e3d5ca] animate-float pointer-events-none hidden md:block">
        <Heart className="w-16 h-16 fill-[#f5ebe0] opacity-60" />
      </div>
      <div className="absolute top-36 right-16 text-[#e3d5ca] animate-float pointer-events-none hidden md:block" style={{ animationDelay: "2s" }}>
        <Heart className="w-12 h-12 fill-[#f5ebe0] opacity-60" />
      </div>

      <Confetti ref={confettiRef} />

      {/* Hero Header */}
      <header className="pt-10 pb-6 text-center z-10 px-4 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Heart className="w-8 h-8 text-[#d4a373] fill-[#d4a373] animate-pulse" />
            <span className="font-serif italic text-[#8d6e63] font-semibold text-lg md:text-xl">
              Our 1st Anniversary Special
            </span>
            <Heart className="w-8 h-8 text-[#d4a373] fill-[#d4a373] animate-pulse" />
          </div>

          <h1 className="font-cursive text-5xl md:text-6xl text-[#5d4037] font-bold leading-none mb-2">
            {config.senderName} & {config.receiverName}
          </h1>

          <p className="font-serif italic text-[#a1887f] text-sm md:text-base max-w-md mx-auto">
            "A whole year of endless laughs, beautiful coffees, and a love that grows deeper with every sunrise."
          </p>
        </motion.div>
      </header>

      {/* Countdown Clock Widget */}
      <section className="px-4 max-w-xl mx-auto w-full z-10 mb-8">
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm border border-[#e3d5ca] p-4 rounded-3xl shadow-md text-center flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-1.5 text-[#8d6e63] font-serif italic text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: "12s" }} />
            <span>{isFutureCountdown ? "Countdown To Our Anniversary" : "Time Spent Loving You"}</span>
          </div>

          <div className="grid grid-cols-5 gap-1 md:gap-3 w-full max-w-md">
            {[
              { val: timeSince.years, label: "Years" },
              { val: timeSince.days, label: "Days" },
              { val: timeSince.hours, label: "Hours" },
              { val: timeSince.minutes, label: "Mins" },
              { val: timeSince.seconds, label: "Secs" }
            ].map((unit, idx) => (
              <div key={idx} className="bg-[#f5ebe0]/40 p-2 rounded-xl flex flex-col items-center border border-[#e3d5ca]/40">
                <span className="font-mono text-xl md:text-2xl font-bold text-[#5d4037] tabular-nums">
                  {unit.val}
                </span>
                <span className="text-[9px] md:text-[10px] text-[#a1887f] font-medium uppercase tracking-wider">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Visual Navigation Tabs */}
      <nav className="px-4 max-w-2xl mx-auto w-full z-10 mb-8 shrink-0">
        <div className="bg-white/85 p-1.5 rounded-2xl border border-[#efebe9] shadow-sm flex overflow-x-auto md:flex-wrap gap-1.5 md:gap-2 md:justify-around scrollbar-none snap-x">
          {[
            { id: "letter", label: "Love Letter", icon: Mail },
            { id: "jar", label: "Love Jar", icon: Sparkles },
            { id: "coupons", label: "Vouchers", icon: Gift },
            { id: "quiz", label: "Quiz Trivia", icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`app-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold rounded-xl cursor-pointer transition-all shrink-0 snap-align-start ${
                  isActive
                    ? "bg-[#8d6e63] text-white shadow-md"
                    : "text-[#8d6e63] hover:bg-[#f5ebe0]/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Interactive Panel */}
      <main className="flex-grow px-4 max-w-3xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTab === "letter" && (
              <LoveEnvelope
                senderName={config.senderName}
                receiverName={config.receiverName}
                letterTitle={config.letterTitle}
                letterContent={config.letterContent}
                onOpen={handleTriggerConfetti}
              />
            )}

            {activeTab === "jar" && (
              <HeartJar reasons={config.reasons} onDraw={handleTriggerConfetti} />
            )}

            {activeTab === "coupons" && (
              <LoveCoupons coupons={config.coupons} onRedeem={handleRedeemCoupon} />
            )}

            {activeTab === "quiz" && (
              <LoveQuiz questions={config.quizQuestions} onCorrectAnswer={handleTriggerConfetti} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Music Player */}
      <MusicPlayer />

      {/* Boyfriend Customizer Board */}
      
    </div>
  );
}
