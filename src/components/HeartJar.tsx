import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart } from "lucide-react";

interface HeartJarProps {
  reasons: string[];
  onDraw: () => void;
}

export const HeartJar: React.FC<HeartJarProps> = ({ reasons, onDraw }) => {
  const [activeReason, setActiveReason] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastIndex, setLastIndex] = useState<number>(-1);

  const drawReason = () => {
    if (reasons.length === 0 || isDrawing) return;
    setIsDrawing(true);
    onDraw();

    // Get a random reason (avoid repeating the last one if possible)
    let nextIndex = Math.floor(Math.random() * reasons.length);
    if (reasons.length > 1 && nextIndex === lastIndex) {
      nextIndex = (nextIndex + 1) % reasons.length;
    }
    setLastIndex(nextIndex);

    // Animate drawing
    setTimeout(() => {
      setActiveReason(reasons[nextIndex]);
      setIsDrawing(false);
    }, 800);
  };

  return (
    <div id="heart-jar-widget" className="bg-white/80 border border-[#e3d5ca] backdrop-blur-md rounded-3xl p-6 shadow-xl flex flex-col items-center text-center max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 pointer-events-none">
        <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
      </div>

      <div className="mb-4">
        <h3 className="font-serif font-bold text-2xl text-[#5d4037] flex items-center justify-center gap-1.5">
          Reasons I Love You Jar
        </h3>
        <p className="text-xs text-[#8d6e63] font-sans mt-0.5">Click the glass jar to pull out a secret scroll of love!</p>
      </div>

      {/* Jar Graphic and Note Reveal Animation */}
      <div className="relative w-full h-64 flex items-center justify-center mb-4">
        {/* The Digital Jar */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97, rotate: [0, -3, 3, 0] }}
          onClick={drawReason}
          className="relative w-44 h-56 border-4 border-[#d5bdaf] bg-[#f5ebe0]/30 rounded-t-3xl rounded-b-[40px] shadow-lg flex items-center justify-center cursor-pointer z-10 group overflow-hidden"
          style={{
            boxShadow: "inset 0 10px 20px rgba(141, 110, 99, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Jar Lid */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg shadow-md z-20 border border-amber-800" />
          
          {/* Jar neck glass detail */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 border-2 border-[#d5bdaf]/50 rounded-full z-10" />

          {/* Floating hearts inside the jar */}
          <div className="absolute bottom-4 inset-x-2 flex flex-wrap gap-2.5 justify-center opacity-85 p-2 pointer-events-none">
            {reasons.slice(0, 10).map((_, i) => (
              <motion.svg
                key={i}
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.1, 1],
                  rotate: [0, Math.random() * 20 - 10, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                className="w-5 h-5 text-[#d4a373] fill-[#e3d5ca]"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
            ))}
          </div>

          {/* Liquid highlight line */}
          <div className="absolute inset-y-4 right-3 w-2.5 bg-white/40 rounded-full blur-[1px] pointer-events-none" />
          
          {/* Label on the jar */}
          <div className="bg-amber-50 border-2 border-amber-600/40 px-3 py-2 rounded-md shadow-sm z-20 rotate-[-2deg] pointer-events-none select-none text-center">
            <span className="font-cursive text-[#5d4037] font-bold text-lg leading-tight block">Reasons I</span>
            <span className="font-cursive text-[#5d4037] font-bold text-lg leading-tight block">Love You</span>
            <Heart className="w-3 h-3 text-[#c62828] fill-[#c62828] mx-auto mt-0.5 animate-pulse" />
          </div>
        </motion.div>

        {/* Note rising out of the jar during Draw animation */}
        <AnimatePresence>
          {isDrawing && (
            <motion.div
              initial={{ y: 50, scale: 0.2, opacity: 0, rotate: 0 }}
              animate={{ y: -100, scale: 1.1, opacity: 1, rotate: 360 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute z-20 bg-amber-50 text-amber-900 shadow-xl border border-amber-200 py-2.5 px-4 rounded-xl flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-[#c62828] fill-[#c62828] animate-pulse" />
              <span className="font-serif italic text-xs font-semibold">Drawing sweet thought...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Revealed Reason Modal / Overlay on success */}
        <AnimatePresence>
          {activeReason && !isDrawing && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 z-30 bg-[#fdfaf6]/95 backdrop-blur-sm rounded-2xl flex flex-col justify-center items-center p-6 border-2 border-[#d5bdaf]"
            >
              <Heart className="w-12 h-12 text-[#d4a373] fill-[#e3d5ca] mb-3 animate-bounce" />
              
              <div className="w-full max-w-xs">
                <p className="font-cursive text-2xl md:text-3xl text-[#5d4037] leading-relaxed font-bold italic">
                  "{activeReason}"
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  id="draw-another-btn"
                  onClick={drawReason}
                  className="px-4 py-1.5 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-semibold rounded-full shadow-md text-xs cursor-pointer transition-colors"
                >
                  Draw Another Heart
                </button>
                <button
                  id="close-reason-btn"
                  onClick={() => setActiveReason(null)}
                  className="px-4 py-1.5 border border-[#d5bdaf] hover:bg-[#efebe9] text-[#8d6e63] font-semibold rounded-full text-xs cursor-pointer transition-colors"
                >
                  Close Jar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-[#8d6e63] font-mono">
        There are <span className="font-semibold">{reasons.length}</span> hearts inside the jar.
      </p>
    </div>
  );
};
