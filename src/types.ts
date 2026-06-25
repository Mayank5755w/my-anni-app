export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isRedeemed: boolean;
  redeemedDate: string | null;
}

export interface MemoryItem {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface AnniversaryConfig {
  senderName: string;
  receiverName: string;
  anniversaryDate: string; // YYYY-MM-DD
  letterTitle: string;
  letterContent: string;
  reasons: string[];
  coupons: LoveCoupon[];
  memories: MemoryItem[];
  quizQuestions: QuizQuestion[];
  bgPhotos?: string[];
  bgOpacity?: number; // 0 to 100
  bgBlur?: number; // 0 to 20
  activeBgMode?: "solid" | "photo";
}
