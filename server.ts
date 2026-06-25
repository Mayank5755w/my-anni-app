import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI features will be unavailable.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
// 1. Generate Love Poem
app.post("/api/gemini/poem", async (req, res) => {
  const { sender, receiver, hobbies, traits, keyMemories, tone } = req.body;
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ error: "Gemini API client is not configured. Please add GEMINI_API_KEY to secrets." });
  }

  try {
    const prompt = `Write a beautiful, personalized, and high-quality romantic love poem from ${sender || "Kiku"} to their girlfriend ${receiver || "Miku"}.
Here are some details to incorporate:
- Her traits: ${traits || "beautiful smile, kind soul, warm hugs"}
- Her hobbies/interests: ${hobbies || "reading, stargazing, listening to music"}
- Special memory: ${keyMemories || "our first long walk under the rain"}
- Tone: ${tone || "sweet, romantic, and slightly emotional"}

Make it a stunning 4-stanza poem. Format with clean line breaks. Do not include markdown code block syntax.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class romantic poet. Write touching, expressive, and deeply affectionate poetry that feels authentic, heartfelt, and personal. Avoid generic, cliché phrases; instead focus on the beautiful details provided.",
        temperature: 0.8,
      }
    });

    res.json({ poem: response.text });
  } catch (error: any) {
    console.error("Poem Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate love poem" });
  }
});

// 2. Rewrite/Polish Love Letter
app.post("/api/gemini/letter-help", async (req, res) => {
  const { sender, receiver, draftLetter, pointsToInclude } = req.body;
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ error: "Gemini API client is not configured. Please add GEMINI_API_KEY to secrets." });
  }

  try {
    const prompt = `Rewrite and polish the following rough draft of a 1-year anniversary love letter from ${sender || "Miku"} to ${receiver || "Kiku"}. Make it sound incredibly elegant, deeply moving, romantic, and beautifully written.
Rough draft:
"""
${draftLetter || "Happy anniversary! I love you so much. It's been a whole year and you are my favorite person. Thanks for always being there for me."}
"""

Key details to weave in beautifully:
- ${pointsToInclude || "our late night video calls, how you make me laugh, our future plans"}

Ensure it remains highly personal and emotional, and expands on the feeling of loving someone more and more every single day. Keep a natural, sincere human voice. Do not wrap in markdown quotes or code blocks, just output the plain formatted text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master romantic writer. Your specialty is taking raw, sincere human emotions and drafting them into timeless, elegant, and moving letters of affection. Keep the draft's core message but make the vocabulary rich, poetic, and beautifully cohesive.",
        temperature: 0.7,
      }
    });

    res.json({ letter: response.text });
  } catch (error: any) {
    console.error("Letter Polish Error:", error);
    res.status(500).json({ error: error.message || "Failed to polish love letter" });
  }
});

// 3. Generate 10 Reasons I Love You
app.post("/api/gemini/reasons", async (req, res) => {
  const { sender, receiver, traits, memories } = req.body;
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ error: "Gemini API client is not configured. Please add GEMINI_API_KEY to secrets." });
  }

  try {
    const prompt = `Generate a list of exactly 10 cute, highly romantic, and personalized reasons why ${sender || "Mayank"} loves ${receiver || "his girlfriend"}.
Incorporate details like:
- Her traits: ${traits || "her adorable laugh, the way she curls up, her kindness"}
- Milestones or memories: ${memories || "our late night conversations, our shared coffees"}

Keep them playful, deeply affectionate, sweet, and intimate (not generic). Output as a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an affectionate and romantic boyfriend drafting reasons why you love your partner. Be specific, sweet, slightly playful, and deeply genuine.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "A list of exactly 10 customized reasons to love someone."
        }
      }
    });

    const reasons = JSON.parse(response.text || "[]");
    res.json({ reasons });
  } catch (error: any) {
    console.error("Reasons Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate love reasons" });
  }
});

// 4. Generate Relationship Trivia Quiz
app.post("/api/gemini/trivia", async (req, res) => {
  const { sender, receiver, keyFacts } = req.body;
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({ error: "Gemini API client is not configured. Please add GEMINI_API_KEY to secrets." });
  }

  try {
    const prompt = `Generate a playful, cute relationship trivia quiz with exactly 5 questions based on these relationship facts:
"""
${keyFacts || "First date was at Starbucks, her favorite color is lavender, Mayank's favorite nickname for her is Cupcake, first movie together was La La Land, first trip was to the beach"}
"""

Each question must test the girlfriend ${receiver || "Kiku"} on how well she knows her boyfriend ${sender || "Miku"} or their shared story.
Format the output as a JSON array of objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a fun relationship quiz host. Generate cute, engaging trivia. Ensure there is only one correct answer and provide three fun, plausible but wrong choices. Include an explanation field that says something sweet or funny.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The quiz question." },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of exactly 4 choices."
              },
              correctAnswerIndex: { type: Type.INTEGER, description: "The 0-based index of the correct option." },
              explanation: { type: Type.STRING, description: "A sweet or playful explanation shown when revealed." }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const quiz = JSON.parse(response.text || "[]");
    res.json({ quiz });
  } catch (error: any) {
    console.error("Trivia Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate relationship trivia" });
  }
});

// Serve Frontend (Vite Setup)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
