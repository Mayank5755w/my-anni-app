import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Mail, CornerUpLeft } from "lucide-react";

interface LoveEnvelopeProps {
  senderName: string;
  receiverName: string;
  letterTitle: string;
  letterContent: string;
  onOpen: () => void;
}

export const LoveEnvelope: React.FC<LoveEnvelopeProps> = ({
  senderName,
  receiverName,
  letterTitle,
  letterContent,
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSealed, setIsSealed] = useState<boolean>(true);

  const handleOpenEnvelope = () => {
    setIsSealed(false);
    onOpen();
    setTimeout(() => {
      setIsOpen(true);
    }, 800);
  };

  const handleCloseEnvelope = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSealed(true);
    }, 600);
  };

  return (
    <div id="love-envelope-section" className="flex flex-col items-center justify-center min-h-[450px] py-6 w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* Sealed / Unopened Envelope state */
          <motion.div
            key="sealed-envelope"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative w-full max-w-md aspect-[3/2] bg-[#f4d1ae] rounded-2xl border-4 border-[#e3b68c] shadow-2xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer group"
            onClick={handleOpenEnvelope}
          >
            {/* Envelope flaps pattern lines (simulated back flap) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#efebe9] to-[#f4d1ae] opacity-60 z-0 pointer-events-none" />
            <div className="absolute top-0 left-0 w-0 h-0 border-t-[100px] border-t-[#e3d5ca]/50 border-r-[200px] border-r-transparent z-0 pointer-events-none" />
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[100px] border-t-[#e3d5ca]/50 border-l-[200px] border-l-transparent z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-[60%] border-t border-[#e3b68c]/30 bg-[#f4d1ae]/40 backdrop-blur-sm z-0 pointer-events-none" style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />

            {/* Back stamps/decorations */}
            <div className="flex justify-between items-start z-10 w-full pointer-events-none">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8d6e63]/80">Special Delivery</span>
                <span className="font-cursive text-xl text-[#5d4037]">For {receiverName}</span>
              </div>
              <div className="w-12 h-12 border-2 border-dashed border-[#d5bdaf] rounded-lg flex items-center justify-center p-1 rotate-12">
                <Heart className="w-6 h-6 text-[#d4a373] fill-[#d4a373] animate-pulse" />
              </div>
            </div>

            {/* Breaking Wax Seal Button in the Center */}
            <div className="flex flex-col items-center justify-center gap-2 z-20 my-auto pointer-events-none">
              <motion.div
                animate={isSealed ? { scale: [1, 1.1, 1] } : { scale: 0 }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-16 h-16 bg-[#c62828] rounded-full flex items-center justify-center shadow-lg border-2 border-[#b71c1c] group-hover:bg-[#b71c1c] transition-colors"
              >
                <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
              </motion.div>
              <span className="font-serif italic text-[#5d4037] text-sm font-medium group-hover:text-[#8d6e63] transition-colors">
                Click Wax Seal to Break & Open Letter
              </span>
            </div>

            {/* Footer details */}
            <div className="flex justify-between items-end z-10 w-full pointer-events-none">
              <span className="text-[10px] font-mono tracking-wider text-[#8d6e63]/60">1ST YEAR ANNIVERSARY SPECIAL</span>
              <span className="text-xs font-serif font-semibold text-[#8d6e63] italic">With all my love, {senderName}</span>
            </div>
          </motion.div>
        ) : (
          /* Opened Scroll/Letter Paper state */
          <motion.div
            key="revealed-letter"
            initial={{ y: 150, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -150, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="w-full relative"
          >
            {/* Letter Frame with Vintage Shadowing */}
            <div className="letter-paper w-full max-w-xl mx-auto border-4 border-amber-900/10 rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden text-[#5d4037] font-sans min-h-[400px]">
              {/* Corner floral decorations */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#e3d5ca]/40 rounded-tl-2xl p-2 pointer-events-none">
                <Sparkles className="w-4 h-4 text-[#d4a373]" />
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#e3d5ca]/40 rounded-tr-2xl p-2 flex justify-end pointer-events-none">
                <Heart className="w-4 h-4 text-[#d4a373] fill-[#e3d5ca]/30" />
              </div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[#e3d5ca]/40 rounded-bl-2xl p-2 flex items-end pointer-events-none">
                <Heart className="w-4 h-4 text-[#d4a373] fill-[#e3d5ca]/30" />
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#e3d5ca]/40 rounded-br-2xl p-2 flex items-end justify-end pointer-events-none">
                <Sparkles className="w-4 h-4 text-[#d4a373]" />
              </div>

              {/* Back Button to close envelope */}
              <button
                id="close-envelope-btn"
                onClick={handleCloseEnvelope}
                className="absolute top-4 right-4 text-[#a1887f] hover:text-[#5d4037] transition-colors p-1.5 rounded-full hover:bg-[#f5ebe0]"
                title="Put Letter back in Envelope"
              >
                <CornerUpLeft className="w-5 h-5" />
              </button>

              {/* Letter Header */}
              <div className="text-center mb-8">
                <span className="font-serif italic text-[#a1887f]/80 text-xs tracking-widest block uppercase mb-1">
                  ~ Our 1-Year Journey ~
                </span>
                <h3 className="font-cursive text-4xl md:text-5xl text-[#5d4037] font-bold leading-tight mb-2">
                  {letterTitle || `Dear ${receiverName}`}
                </h3>
                <div className="w-16 h-0.5 bg-[#d5bdaf] mx-auto" />
              </div>

              {/* Hand-written letter content */}
              <div className="font-cursive text-2xl md:text-3xl text-[#5d4037] leading-relaxed space-y-4 whitespace-pre-line text-left font-medium min-h-[220px]">
                {letterContent}
              </div>

              {/* Letter Sign-off */}
              <div className="mt-12 text-right">
                <span className="font-serif italic text-[#a1887f] text-sm block">Forever & Always yours,</span>
                <span className="font-cursive text-3xl text-[#5d4037] font-bold block mt-1">{senderName}</span>
              </div>
            </div>

            {/* Soft decorative text */}
            <p className="text-center text-xs text-[#a1887f]/80 italic font-serif mt-4">
              
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
