import React, { useState } from "react";
import { 
  Settings, Save, Sparkles, Plus, Trash2, RefreshCw, Check, 
  HelpCircle, Eye, Calendar, Gift, Heart
} from "lucide-react";
import { AnniversaryConfig, LoveCoupon } from "../types";

interface BoyfriendDashboardProps {
  config: AnniversaryConfig;
  onSaveConfig: (updatedConfig: AnniversaryConfig) => void;
}

export const BoyfriendDashboard: React.FC<BoyfriendDashboardProps> = ({ config, onSaveConfig }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"general" | "letter" | "photos" | "reasons" | "quiz" | "poem">("general");

  // General state
  const [senderName, setSenderName] = useState<string>(config.senderName);
  const [receiverName, setReceiverName] = useState<string>(config.receiverName);
  const [anniversaryDate, setAnniversaryDate] = useState<string>(config.anniversaryDate);

  // Letter state
  const [letterTitle, setLetterTitle] = useState<string>(config.letterTitle);
  const [letterContent, setLetterContent] = useState<string>(config.letterContent);
  const [letterPoints, setLetterPoints] = useState<string>("");

  // Photos background state
  const [bgPhotos, setBgPhotos] = useState<string[]>(config.bgPhotos || []);
  const [bgOpacity, setBgOpacity] = useState<number>(config.bgOpacity !== undefined ? config.bgOpacity : 12);
  const [bgBlur, setBgBlur] = useState<number>(config.bgBlur !== undefined ? config.bgBlur : 3);
  const [activeBgMode, setActiveBgMode] = useState<"solid" | "photo">(config.activeBgMode || "photo");
  const [newBgPhotoUrl, setNewBgPhotoUrl] = useState<string>("");

  // Reasons state
  const [reasons, setReasons] = useState<string[]>(config.reasons);
  const [newReason, setNewReason] = useState<string>("");
  const [reasonsTraits, setReasonsTraits] = useState<string>("");


  // Quiz state
  const [quizFacts, setQuizFacts] = useState<string>("");
  const [quizQuestions, setQuizQuestions] = useState(config.quizQuestions);

  // Custom Poem Generation State
  const [poemPromptTraits, setPoemPromptTraits] = useState<string>("");
  const [poemPromptHobbies, setPoemPromptHobbies] = useState<string>("");
  const [poemPromptMemories, setPoemPromptMemories] = useState<string>("");
  const [poemPromptTone, setPoemPromptTone] = useState<string>("sweet and romantic");
  const [generatedPoem, setGeneratedPoem] = useState<string>("");

  // Loader states
  const [isLosingPoem, setIsLosingPoem] = useState<boolean>(false);
  const [isLosingLetter, setIsLosingLetter] = useState<boolean>(false);
  const [isLosingReasons, setIsLosingReasons] = useState<boolean>(false);
  const [isLosingQuiz, setIsLosingQuiz] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveAll = (customConfig?: AnniversaryConfig) => {
    const toSave = customConfig || {
      ...config,
      senderName,
      receiverName,
      anniversaryDate,
      letterTitle,
      letterContent,
      reasons,
      quizQuestions,
      bgPhotos,
      bgOpacity,
      bgBlur,
      activeBgMode
    };

    onSaveConfig(toSave);
    setSaveStatus("Changes Saved Successfully!");
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // 1. AI Poem Generator
  const generatePoem = async () => {
    if (isLosingPoem) return;
    setIsLosingPoem(true);
    setGeneratedPoem("");

    try {
      const response = await fetch("/api/gemini/poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderName,
          receiver: receiverName,
          traits: poemPromptTraits,
          hobbies: poemPromptHobbies,
          keyMemories: poemPromptMemories,
          tone: poemPromptTone,
        }),
      });

      const data = await response.json();
      if (data.poem) {
        setGeneratedPoem(data.poem);
      } else {
        alert(data.error || "Failed to generate poem");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating poem. Check server connection.");
    } finally {
      setIsLosingPoem(false);
    }
  };

  // 2. AI Letter Draft Polisher
  const polishLetter = async () => {
    if (isLosingLetter) return;
    setIsLosingLetter(true);

    try {
      const response = await fetch("/api/gemini/letter-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderName,
          receiver: receiverName,
          draftLetter: letterContent,
          pointsToInclude: letterPoints,
        }),
      });

      const data = await response.json();
      if (data.letter) {
        setLetterContent(data.letter);
        setLetterPoints("");
      } else {
        alert(data.error || "Failed to polish letter");
      }
    } catch (e) {
      console.error(e);
      alert("Error polishing letter.");
    } finally {
      setIsLosingLetter(false);
    }
  };

  // 3. AI Reasons Generator
  const generateReasons = async () => {
    if (isLosingReasons) return;
    setIsLosingReasons(true);

    try {
      const response = await fetch("/api/gemini/reasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderName,
          receiver: receiverName,
          traits: reasonsTraits,
        }),
      });

      const data = await response.json();
      if (data.reasons && data.reasons.length > 0) {
        setReasons(data.reasons);
        setReasonsTraits("");
        alert("Generated 10 sweet reasons! Don't forget to click 'Save Settings'.");
      } else {
        alert(data.error || "Failed to generate reasons");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating reasons.");
    } finally {
      setIsLosingReasons(false);
    }
  };

  // 4. AI Quiz Trivia Generator
  const generateQuiz = async () => {
    if (isLosingQuiz) return;
    if (!quizFacts) {
      alert("Please enter relationship facts first!");
      return;
    }
    setIsLosingQuiz(true);

    try {
      const response = await fetch("/api/gemini/trivia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderName,
          receiver: receiverName,
          keyFacts: quizFacts,
        }),
      });

      const data = await response.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuizQuestions(data.quiz);
        setQuizFacts("");
        alert("Generated 5 amazing customized questions! Click 'Save Settings' to apply.");
      } else {
        alert(data.error || "Failed to generate quiz");
      }
    } catch (e) {
      console.error(e);
      alert("Error generating trivia quiz.");
    } finally {
      setIsLosingQuiz(false);
    }
  };

  // Reason operations
  const addManualReason = () => {
    if (!newReason.trim()) return;
    setReasons((r) => [...r, newReason.trim()]);
    setNewReason("");
  };

  const removeReason = (idx: number) => {
    setReasons((r) => r.filter((_, i) => i !== idx));
  };

  const resetVouchers = () => {
    const reset = config.coupons.map(c => ({ ...c, isRedeemed: false, redeemedDate: null }));
    const updated = {
      ...config,
      coupons: reset
    };
    handleSaveAll(updated);
    alert("Coupons reset successfully! She can redeem them again.");
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Gear Button */}
      <button
        id="boyfriend-panel-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[#8d6e63] hover:bg-[#5d4037] text-white flex items-center justify-center cursor-pointer shadow-lg hover:rotate-45 duration-300 z-50 border border-[#a1887f]"
        title="Boyfriend Customizer Settings"
      >
        <Settings className="w-5 h-5 animate-pulse" />
      </button>

      {/* Settings Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-40 transition-opacity">
          <div className="w-full max-w-lg bg-[#2d1b15] text-[#efebe9] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-[#5d4037]">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#5d4037]/80 mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#d5bdaf] flex items-center gap-1.5">
                  <Heart className="w-5 h-5 text-[#d4a373] fill-[#d4a373]" />
                  Anniversary Builder
                </h3>
                <span className="text-[10px] font-mono text-[#a1887f]">Personalize Your Story & Use Gemini AI</span>
              </div>
              <button
                id="close-panel-btn"
                onClick={() => setIsOpen(false)}
                className="text-[#a1887f] hover:text-[#efebe9] text-sm font-semibold p-1 px-3 rounded-lg border border-[#5d4037]"
              >
                Close Panel
              </button>
            </div>

            {/* Config Tabs */}
            <div className="flex gap-1.5 pb-3 border-b border-[#5d4037]/60 overflow-x-auto mb-4 shrink-0">
              {(["general", "letter", "photos", "reasons", "quiz", "poem"] as const).map((tab) => (
                <button
                  key={tab}
                  id={`dashboard-tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs capitalize px-2.5 py-1.5 rounded-lg font-sans font-medium shrink-0 ${
                    activeTab === tab
                      ? "bg-[#8d6e63] text-white shadow"
                      : "text-[#d5bdaf] hover:bg-[#3e2723]/40"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 scrollbar">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="bg-[#efebe9]/5 p-3 rounded-xl border border-[#5d4037]/40">
                    <p className="text-xs text-[#d5bdaf] leading-normal">
                      Update your names and the date of your anniversary. The countdown timer on the screen will count up dynamically from this date!
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Your Name (Sender)</label>
                    <input
                      id="input-sender-name"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d5bdaf]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Her Name (Receiver)</label>
                    <input
                      id="input-receiver-name"
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d5bdaf]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Anniversary/Meeting Date</label>
                    <input
                      id="input-anniversary-date"
                      type="date"
                      value={anniversaryDate}
                      onChange={(e) => setAnniversaryDate(e.target.value)}
                      className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d5bdaf]"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#5d4037]/40">
                    <button
                      id="reset-vouchers-btn"
                      onClick={resetVouchers}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                    >
                      Reset All Redeemed Coupons
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "letter" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Letter Title</label>
                    <input
                      id="input-letter-title"
                      type="text"
                      value={letterTitle}
                      onChange={(e) => setLetterTitle(e.target.value)}
                      className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d5bdaf]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Hartfelt Message Content</label>
                    <textarea
                      id="input-letter-content"
                      rows={6}
                      value={letterContent}
                      onChange={(e) => setLetterContent(e.target.value)}
                      className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d5bdaf] font-cursive text-lg leading-relaxed resize-y"
                    />
                  </div>

                  {/* AI Writing Assistant */}
                  <div className="bg-[#efebe9]/5 p-4 rounded-xl border border-[#efebe9]/10 space-y-3">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Love Letter Assistant
                    </span>
                    <p className="text-xs text-[#efebe9]">
                      Write down key details you want to weave in (e.g. "how she hugs, our Starbucks date, late calls") and let Gemini polish your draft into a poetic masterpiece!
                    </p>
                    <input
                      id="input-ai-letter-points"
                      type="text"
                      placeholder="Add key memories or feelings..."
                      value={letterPoints}
                      onChange={(e) => setLetterPoints(e.target.value)}
                      className="w-full bg-[#1d110d] border border-[#5d4037] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#a1887f]/55 focus:outline-none"
                    />
                    <button
                      id="polish-letter-btn"
                      onClick={polishLetter}
                      disabled={isLosingLetter}
                      className="w-full py-1.5 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isLosingLetter ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Polish & Rewrite Draft with Gemini</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "photos" && (
                <div className="space-y-4">
                  <div className="bg-[#efebe9]/5 p-3 rounded-xl border border-[#5d4037]/40">
                    <p className="text-xs text-[#d5bdaf] leading-normal">
                      Personalize the background with photos of the two of you! You can add your own image links (e.g. from free hosts like Imgur or postimages) and adjust the opacity & blur.
                    </p>
                  </div>

                  {/* Background Mode Toggle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Background Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="bg-mode-solid-btn"
                        onClick={() => setActiveBgMode("solid")}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          activeBgMode === "solid"
                            ? "bg-[#8d6e63] text-white border-[#a1887f]"
                            : "bg-[#1d110d]/40 text-[#a1887f] border-[#5d4037]"
                        }`}
                      >
                        Solid Soft Warm
                      </button>
                      <button
                        type="button"
                        id="bg-mode-photo-btn"
                        onClick={() => setActiveBgMode("photo")}
                        className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                          activeBgMode === "photo"
                            ? "bg-[#8d6e63] text-white border-[#a1887f]"
                            : "bg-[#1d110d]/40 text-[#a1887f] border-[#5d4037]"
                        }`}
                      >
                        Romantic Slideshow
                      </button>
                    </div>
                  </div>

                  {activeBgMode === "photo" && (
                    <>
                      {/* Opacity Control */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[#d5bdaf]">Photo Opacity ({bgOpacity}%)</span>
                          <span className="text-[#a1887f] font-mono text-[10px]">Adjust transparency</span>
                        </div>
                        <input
                          id="input-bg-opacity"
                          type="range"
                          min="3"
                          max="40"
                          value={bgOpacity}
                          onChange={(e) => setBgOpacity(Number(e.target.value))}
                          className="w-full accent-[#8d6e63] cursor-pointer"
                        />
                      </div>

                      {/* Blur Control */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[#d5bdaf]">Photo Blur ({bgBlur}px)</span>
                          <span className="text-[#a1887f] font-mono text-[10px]">Keep text highly readable</span>
                        </div>
                        <input
                          id="input-bg-blur"
                          type="range"
                          min="0"
                          max="15"
                          value={bgBlur}
                          onChange={(e) => setBgBlur(Number(e.target.value))}
                          className="w-full accent-[#8d6e63] cursor-pointer"
                        />
                      </div>

                      {/* Added Photos */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#d5bdaf]">Photos Carousel ({bgPhotos.length})</label>
                        <div className="max-h-48 overflow-y-auto border border-[#5d4037] rounded-lg bg-[#1d110d]/40 p-2 space-y-2">
                          {bgPhotos.map((url, index) => (
                            <div key={index} className="flex items-center gap-3 bg-[#2d1b15]/40 p-1.5 rounded-lg border border-[#5d4037]/50">
                              <img
                                src={url}
                                alt={`Custom BG ${index}`}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded border border-[#5d4037]"
                              />
                              <span className="text-[10px] text-[#efebe9] truncate flex-grow font-mono">{url}</span>
                              <button
                                type="button"
                                id={`remove-bg-photo-${index}`}
                                onClick={() => setBgPhotos((prev) => prev.filter((_, i) => i !== index))}
                                className="text-rose-400 hover:text-rose-200 p-1 cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          {bgPhotos.length === 0 && (
                            <p className="text-xs text-[#a1887f] text-center py-4 italic">No photos. Add some below!</p>
                          )}
                        </div>
                      </div>

                      {/* Add photo URL */}
                      <div className="flex gap-2">
                        <input
                          id="input-bg-photo-url"
                          type="text"
                          placeholder="Paste photo URL here..."
                          value={newBgPhotoUrl}
                          onChange={(e) => setNewBgPhotoUrl(e.target.value)}
                          className="flex-grow bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#a1887f]/55 focus:outline-none"
                        />
                        <button
                          id="add-bg-photo-btn"
                          type="button"
                          onClick={() => {
                            if (!newBgPhotoUrl.trim()) return;
                            setBgPhotos((prev) => [...prev, newBgPhotoUrl.trim()]);
                            setNewBgPhotoUrl("");
                          }}
                          className="px-3 py-1.5 bg-[#8d6e63] hover:bg-[#5d4037] text-white rounded-lg flex items-center justify-center text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "reasons" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Reasons inside the jar ({reasons.length})</label>
                    <div className="max-h-40 overflow-y-auto border border-[#5d4037] rounded-lg bg-[#1d110d]/40 p-2 divide-y divide-[#5d4037]/40">
                      {reasons.map((r, i) => (
                        <div key={i} className="flex justify-between items-center py-1 text-xs text-[#efebe9]">
                          <span className="truncate pr-4">"{r}"</span>
                          <button
                            id={`remove-reason-${i}`}
                            onClick={() => removeReason(i)}
                            className="text-[#a1887f] hover:text-[#efebe9]"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add Reason manually */}
                  <div className="flex gap-2">
                    <input
                      id="input-manual-reason"
                      type="text"
                      placeholder="Add a new custom reason..."
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      className="flex-grow bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button
                      id="add-manual-reason-btn"
                      onClick={addManualReason}
                      className="px-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-xs"
                    >
                      Add
                    </button>
                  </div>

                  {/* AI Reasons Generator */}
                  <div className="bg-[#efebe9]/5 p-4 rounded-xl border border-[#5d4037] space-y-3">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Heart Jar Generator
                    </span>
                    <p className="text-xs text-[#efebe9]">
                      Provide some traits or sweet habits of hers and let Gemini auto-generate 10 deeply personalized reasons why you love her!
                    </p>
                    <input
                      id="input-reasons-traits"
                      type="text"
                      placeholder="e.g. her dimples, warm gaze, making hot coffee"
                      value={reasonsTraits}
                      onChange={(e) => setReasonsTraits(e.target.value)}
                      className="w-full bg-[#1d110d] border border-[#5d4037] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#a1887f]/55 focus:outline-none"
                    />
                    <button
                      id="generate-reasons-btn"
                      onClick={generateReasons}
                      disabled={isLosingReasons}
                      className="w-full py-1.5 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isLosingReasons ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Generate 10 Reasons with Gemini</span>
                    </button>
                  </div>
                </div>
              )}


              {activeTab === "quiz" && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#d5bdaf]">Active Questions ({quizQuestions.length})</label>
                    <div className="max-h-36 overflow-y-auto border border-[#5d4037] rounded-lg bg-[#1d110d]/40 p-2 divide-y divide-[#5d4037]/40">
                      {quizQuestions.map((q, i) => (
                        <div key={i} className="py-1 text-[11px] text-[#efebe9]">
                          <span className="font-semibold text-[#d5bdaf]">{i + 1}.</span> {q.question}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Trivia Quiz Builder */}
                  <div className="bg-[#efebe9]/5 p-4 rounded-xl border border-[#5d4037] space-y-3">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> AI Trivia Builder
                    </span>
                    <p className="text-xs text-[#efebe9] font-sans">
                      Provide some facts about your relationship (e.g. "first movie together was La La Land, first date at Cafe Nero, my favorite color green") and let Gemini compose a beautiful trivia quiz!
                    </p>
                    <textarea
                      id="input-quiz-facts"
                      rows={3}
                      placeholder="Enter key facts here..."
                      value={quizFacts}
                      onChange={(e) => setQuizFacts(e.target.value)}
                      className="w-full bg-[#1d110d] border border-[#5d4037] rounded-lg p-2.5 text-xs text-white placeholder-[#a1887f]/55 focus:outline-none resize-none"
                    />
                    <button
                      id="generate-quiz-btn"
                      onClick={generateQuiz}
                      disabled={isLosingQuiz}
                      className="w-full py-1.5 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {isLosingQuiz ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Generate 5 Trivia Questions with Gemini</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "poem" && (
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> AI Custom Love Poem Generator
                  </span>
                  <p className="text-xs text-[#efebe9] leading-normal">
                    Generate a customized, stunning 4-stanza poem to print, save, or share with her. Detail some traits, memories, or select a tone, and hit generate!
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[#d5bdaf] uppercase font-semibold">Her Traits</label>
                      <input
                        id="input-poem-traits"
                        type="text"
                        placeholder="beautiful hair, kind eyes"
                        value={poemPromptTraits}
                        onChange={(e) => setPoemPromptTraits(e.target.value)}
                        className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-[#d5bdaf] uppercase font-semibold">Her Hobbies</label>
                      <input
                        id="input-poem-hobbies"
                        type="text"
                        placeholder="painting, baking"
                        value={poemPromptHobbies}
                        onChange={(e) => setPoemPromptHobbies(e.target.value)}
                        className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#d5bdaf] uppercase font-semibold">Special Shared Memories</label>
                    <input
                      id="input-poem-memories"
                      type="text"
                      placeholder="first walk under the rain at sunset"
                      value={poemPromptMemories}
                      onChange={(e) => setPoemPromptMemories(e.target.value)}
                      className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-2.5 py-1 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#d5bdaf] uppercase font-semibold">Poem Tone</label>
                    <select
                      id="input-poem-tone"
                      value={poemPromptTone}
                      onChange={(e) => setPoemPromptTone(e.target.value)}
                      className="bg-[#efebe9]/5 border border-[#8d6e63] rounded-lg px-2 py-1 text-xs text-white"
                    >
                      <option value="sweet, deep, and deeply romantic">Sweet & Deeply Romantic</option>
                      <option value="humorous and playful">Humorous & Playful</option>
                      <option value="highly emotional and touching">Highly Emotional & Touching</option>
                      <option value="classic Shakespearean style">Classic Shakespearean</option>
                    </select>
                  </div>

                  <button
                    id="generate-poem-btn"
                    onClick={generatePoem}
                    disabled={isLosingPoem}
                    className="w-full py-1.5 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {isLosingPoem ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Generate Love Poem with Gemini</span>
                  </button>

                  {/* Generated Poem Display */}
                  {generatedPoem && (
                    <div className="bg-amber-50 text-[#2d1b15] p-4 rounded-xl border border-rose-200 mt-2 text-center relative max-h-48 overflow-y-auto font-cursive text-lg leading-relaxed select-all">
                      <p className="whitespace-pre-line">
                        {generatedPoem}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#5d4037]/80 mt-4 flex items-center justify-between shrink-0">
              {saveStatus ? (
                <div className="text-emerald-400 flex items-center gap-1 text-xs font-semibold">
                  <Check className="w-4 h-4" />
                  <span>{saveStatus}</span>
                </div>
              ) : (
                <span className="text-[10px] text-[#a1887f]">Remember to Save all changes!</span>
              )}

              <button
                id="save-dashboard-changes-btn"
                onClick={() => handleSaveAll()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
