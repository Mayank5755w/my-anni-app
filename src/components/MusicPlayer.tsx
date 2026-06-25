import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2, VolumeX, Music2, ChevronUp, ChevronDown } from "lucide-react";

// ── Place your MP3 file in the project root and update this path ──
const SONG_SRC = "public/apnasong.mp3";
const SONG_TITLE = "Our Song";
const SONG_ARTIST = "Play & enjoy 🎵";

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = new Audio(SONG_SRC);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 0.6;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const val = Number(e.target.value);
    audio.currentTime = (val / 100) * audio.duration;
    setProgress(val);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentTime = duration ? (progress / 100) * duration : 0;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="player-expanded"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-2 bg-white/95 backdrop-blur-md border border-[#e3d5ca] rounded-2xl shadow-xl p-4 w-64"
          >
            {/* Song info */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl bg-[#8d6e63] flex items-center justify-center shrink-0 ${isPlaying ? "animate-pulse" : ""}`}>
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-serif font-bold text-[#5d4037] text-sm truncate">{SONG_TITLE}</p>
                <p className="text-[10px] text-[#a1887f] font-sans truncate">{SONG_ARTIST}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-1">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 accent-[#8d6e63] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#a1887f] font-mono mt-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-2">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-[#8d6e63] hover:bg-[#5d4037] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2 flex-1 ml-3">
                <button onClick={toggleMute} className="text-[#8d6e63] hover:text-[#5d4037] transition-colors cursor-pointer shrink-0">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolume}
                  className="flex-1 h-1 accent-[#8d6e63] cursor-pointer"
                />
              </div>
            </div>

            <p className="text-[9px] text-[#c0a890] font-mono text-center mt-3">
              HEHE! <code className="bg-[#f5ebe0] px-1 rounded">Enjoy</code>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating music note button */}
      <div className="flex items-end gap-2">
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full text-white flex items-center justify-center cursor-pointer shadow-lg border transition-all duration-300 ${
            isPlaying
              ? "bg-[#c62828] hover:bg-[#b71c1c] border-[#ef9a9a] animate-pulse"
              : "bg-[#8d6e63] hover:bg-[#5d4037] border-[#a1887f]"
          }`}
          title={isPlaying ? "Pause Music" : "Play Our Song"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Music2 className="w-5 h-5" />}
        </button>

        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="w-6 h-6 rounded-full bg-[#efebe9] border border-[#d5bdaf] text-[#8d6e63] flex items-center justify-center cursor-pointer hover:bg-[#f5ebe0] shadow-sm mb-0.5 transition-colors"
          title="Toggle player"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
