/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable large base64 image payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Google GenAI to prevent crashes when API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined. App running in offline local sandbox simulator mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API endpoint to analyze camera frames or uploaded images
app.post("/api/analyze", async (req, res) => {
  try {
    const { image, mode, language } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image base64 data" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY is missing on this server instance.",
        offlineDemo: true
      });
    }

    // Extract base64 mime type and clean data
    let mimeType = "image/jpeg";
    let base64Data = image;

    if (image.startsWith("data:")) {
      const parts = image.split(";base64,");
      const metadata = parts[0];
      mimeType = metadata.replace("data:", "");
      base64Data = parts[1];
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    };

    const systemPromptMessage = `You are NETRA Vision Agent, an autonomous accessibility AI agent designed for the Microsoft Agent League Hackathon.
Your mission is to act as the user's eyes by continuously understanding, reasoning, and narrating the surrounding environment.
Evaluate the camera frame and perform five steps:
1. Observe: list objects (people, vehicles, signs, road markings, personal items).
2. Context: deduce the scene context (bus stop, pedestrian crossing, pharmacy shelf, staircase, busy sidewalk).
3. Risk: assess risks like collision, traffic, falling, or obstacles in pathway.
4. Priority: rank information priority (1. Immediate Danger, 2. Navigation, 3. Awareness).
5. Spoken Guidance: Generate a friendly, reassuring, visual outline spoken in a natural human tone.

IMPORTANT SPECIAL MODE INSTRUCTIONS:
- If Mode is 'medicine', focus heavily on medical information (Drug name, Dosage strength, expiration, instructions, warning notes).
- If Mode is 'crossing', focus on traffic signals, traffic lights, crosswalk lanes, and safely crossing.
- If Mode is 'obstacle', warn of stairs, poles, blockages, or slippery areas.
- If Mode is 'ocr', perform high-accuracy reading/indexing of signboards, menus, or forms.

SPEECH TRANSLATION REQUIREMENT:
The 'guidance' text MUST be written completely and naturally in the target language: "${language}".
Preserve numbers, route numbers (e.g. 'Bus 305'), medicine brand names, or technical terms in Latin alphabet if standard in that language to prevent confusion.`;

    const imageAnalysisResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: `Analyze this image in mode: ${mode || 'general'} for a user preferring spoken speech in: ${language || 'English'}` }
        ]
      },
      config: {
        systemInstruction: systemPromptMessage,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            observe: {
              type: Type.STRING,
              description: "What objects, obstacles, vehicles, signs, and infrastructure elements are present in the scene."
            },
            context: {
              type: Type.STRING,
              description: "The deduced situation or physical context of the user."
            },
            risk: {
              type: Type.STRING,
              description: "Detailed safety and collision risk assessment."
            },
            priority: {
              type: Type.STRING,
              description: "Highest priorities categorized for access navigation."
            },
            guidance: {
              type: Type.STRING,
              description: "Final spoken human narration message in the requested language. Keep it calm, direct, actionable, brief, and highly reassuring."
            },
            collaboration: {
              type: Type.OBJECT,
              properties: {
                ContextAgent: { type: Type.STRING, description: "Shared observation from Context Agent to ecosystem." },
                NavigationAgent: { type: Type.STRING, description: "Step or path vectors calculated by Navigation Agent." },
                SafetyAgent: { type: Type.STRING, description: "Crash/fall prevention thresholds of Safety Agent." },
                MemoryAgent: { type: Type.STRING, description: "Memory recalling preferences, visited routes, or favorite spaces." },
                GuardianAgent: { type: Type.STRING, description: "Emergency bystander alert metrics." }
              },
              required: ["ContextAgent", "NavigationAgent", "SafetyAgent", "MemoryAgent", "GuardianAgent"]
            }
          },
          required: ["observe", "context", "risk", "priority", "guidance", "collaboration"]
        }
      }
    });

    const resultText = imageAnalysisResponse.text;
    res.json(JSON.parse(resultText));

  } catch (error: any) {
    console.error("Gemini analysis server error:", error);
    res.status(500).json({ error: error.message || "Internal server error during vision analysis" });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({ status: "ok", geminiConfigured: hasKey });
});

async function bootServer() {
  // Vite middleware integration for full-stack local rendering
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static assets compiled in `/dist`
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to port 3000 and standard incoming hosts for Cloud Run mapping
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NETRA Vision Server] running at http://localhost:${PORT}`);
  });
}

bootServer().catch((err) => {
  console.error("Failed to start NETRA Vision Server:", err);
});
