import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, Sparkles } from "lucide-react";
import { QuizQuestion } from "../types";

interface LoveQuizProps {
  questions: QuizQuestion[];
  onCorrectAnswer: () => void;
}

export const LoveQuiz: React.FC<LoveQuizProps> = ({ questions, onCorrectAnswer }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleOptionClick = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasSubmitted) return;

    setHasSubmitted(true);
    const isCorrect = selectedOption === questions[currentIndex].correctAnswerIndex;

    if (isCorrect) {
      setScore((s) => s + 1);
      onCorrectAnswer();
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setHasSubmitted(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  const getCustomScoreMessage = () => {
    const ratio = score / (questions.length || 1);
    if (ratio === 1) return { title: "Soulmates Forever! 🏆", msg: "You know our story flawlessly down to every single detail! I love you so much!" };
    if (ratio >= 0.7) return { title: "My Sweet Expert! ❤️", msg: "You got almost everything! You have a wonderful memory of our best days." };
    return { title: "We Should Make More Memories! 🌸", msg: "You got a few, but that's just an excuse for us to talk, laugh and do more kuchupuchu :)" };
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-[#a1887f] font-serif italic">
        No quiz questions loaded yet. Use the 'Boyfriend Panel' to generate trivia!
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const resultsInfo = getCustomScoreMessage();

  return (
    <div id="love-quiz-widget" className="bg-white/80 border border-[#e3d5ca] backdrop-blur-md rounded-3xl p-6 shadow-xl max-w-lg mx-auto overflow-hidden min-h-[380px] flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {!showResults ? (
          /* Question View */
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-between h-full flex-grow"
          >
            {/* Header / Progress bar */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#8d6e63] font-semibold">
                  How Well Do You Know Me?
                </span>
                <span className="text-xs font-serif font-bold text-[#5d4037]">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full h-1 bg-[#efebe9] rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-[#8d6e63] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h4 className="font-serif font-bold text-[#5d4037] text-lg md:text-xl mb-4 flex items-start gap-2 leading-snug">
                <HelpCircle className="w-5 h-5 text-[#8d6e63] shrink-0 mt-0.5" />
                <span>{currentQ.question}</span>
              </h4>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 gap-2.5 mb-5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswerIndex;

                  let optionClass = "border-[#efebe9] hover:border-[#d5bdaf] hover:bg-[#efebe9]/40 text-[#5d4037]";
                  if (isSelected && !hasSubmitted) {
                    optionClass = "border-[#8d6e63] bg-[#efebe9] text-[#5d4037] font-semibold ring-1 ring-[#d5bdaf]";
                  } else if (hasSubmitted) {
                    if (isCorrect) {
                      optionClass = "border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold";
                    } else if (isSelected) {
                      optionClass = "border-[#c62828] bg-[#fdfaf6] text-[#c62828] opacity-90";
                    } else {
                      optionClass = "border-[#efebe9] opacity-60 text-[#5d4037]/80";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`quiz-option-${idx}`}
                      onClick={() => handleOptionClick(idx)}
                      disabled={hasSubmitted}
                      className={`w-full text-left p-3 rounded-xl border-2 text-xs md:text-sm transition-all cursor-pointer flex items-center justify-between ${optionClass}`}
                    >
                      <span>{option}</span>
                      {hasSubmitted && isCorrect && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />}
                      {hasSubmitted && isSelected && !isCorrect && <XCircle className="w-4.5 h-4.5 text-[#c62828] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer feedback or submit controls */}
            <div className="pt-2 border-t border-[#efebe9]/50">
              {hasSubmitted ? (
                <div className="flex flex-col gap-3">
                  <div className="bg-[#efebe9]/60 p-3 rounded-xl border border-[#efebe9]">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-sans text-[#8d6e63] block mb-0.5">
                      {selectedOption === currentQ.correctAnswerIndex ? "That's Correct! 🎉" : "Sweet Attempt! ❤️"}
                    </span>
                    <p className="text-xs text-[#5d4037] leading-normal italic font-serif">
                      "{currentQ.explanation}"
                    </p>
                  </div>
                  <button
                    id="quiz-next-btn"
                    onClick={handleNext}
                    className="w-full py-2 bg-[#8d6e63] hover:bg-[#5d4037] text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-colors text-center"
                  >
                    {currentIndex + 1 < questions.length ? "Next Question" : "View Results"}
                  </button>
                </div>
              ) : (
                <button
                  id="quiz-submit-btn"
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className={`w-full py-2 font-semibold text-xs rounded-xl shadow-md transition-all text-center ${
                    selectedOption !== null
                      ? "bg-[#8d6e63] hover:bg-[#5d4037] text-white cursor-pointer"
                      : "bg-[#efebe9] text-[#a1887f] cursor-not-allowed"
                  }`}
                >
                  Confirm Choice
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          /* Results summary view */
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center flex flex-col justify-between h-full flex-grow py-4"
          >
            <div className="my-auto flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 bg-[#efebe9] rounded-full flex items-center justify-center border-4 border-[#efebe9]">
                  <Award className="w-10 h-10 text-[#8d6e63] animate-bounce" />
                </div>
                <div className="absolute top-0 right-0 p-1 pointer-events-none">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>

              <h4 className="font-serif font-bold text-[#5d4037] text-2xl mb-1">
                {resultsInfo.title}
              </h4>
              <p className="font-sans text-xs text-[#8d6e63] uppercase tracking-widest font-semibold mb-3">
                Final Score: {score} / {questions.length}
              </p>

              <p className="text-sm text-[#5d4037] leading-relaxed italic max-w-sm px-4">
                "{resultsInfo.msg}"
              </p>
            </div>

            <button
              id="quiz-retry-btn"
              onClick={handleReset}
              className="w-full mt-6 py-2 border border-[#d5bdaf] hover:bg-[#efebe9] text-[#8d6e63] font-semibold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4.5 h-4.5" />
              <span>Retry Relationship Trivia</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
