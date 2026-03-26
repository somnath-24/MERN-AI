import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { Progress, Roadmap } from "./models/Progress";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGO_URI not found. Database features will not work.");
}

// AI Service Helper
const callGroq = async (messages: any[]) => {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
    model: "llama-3.3-70b-versatile",
    messages,
    response_format: { type: "json_object" }
  }, {
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  return response.data.choices[0].message.content;
};

// API Routes
app.post("/api/ai/roadmap", async (req, res) => {
  const { focus, level, userId } = req.body;
  try {
    const prompt = `Generate a structured full-stack JavaScript roadmap for a ${level} level learner focusing on ${focus}. 
    Return a JSON object with two arrays: "frontend" and "backend". 
    Each array should contain objects with a "title" property.
    Frontend topics should include: DOM, Events, Fetch API, Promises, Async/Await, LocalStorage, ES6+.
    Backend topics should include: Node.js, modules, fs, http, Express.js, REST APIs, middleware.
    Adapt the depth based on the level.`;

    const result = await callGroq([
      { role: "system", content: "You are a JavaScript mentor for full-stack developers. Output JSON only." },
      { role: "user", content: prompt }
    ]);

    const data = JSON.parse(result);
    
    // Save or update roadmap in DB
    if (userId) {
      await Roadmap.findOneAndUpdate(
        { userId },
        { focus, level, tracks: data, createdAt: new Date() },
        { upsert: true, new: true }
      );
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/practice", async (req, res) => {
  const { topic, difficulty } = req.body;
  try {
    const prompt = `Generate 3 practice questions for the topic "${topic}" at "${difficulty}" difficulty.
    Include:
    1. One Multiple Choice Question (MCQ) with a code snippet.
    2. One Debugging question with a broken code snippet.
    3. One small coding challenge.
    Return a JSON object with a "questions" array. Each question should have: "type" (mcq, debug, challenge), "question", "code", "options" (for mcq), "correctAnswer", "explanation", "realWorldUseCase".`;

    const result = await callGroq([
      { role: "system", content: "You are a JavaScript mentor. Output JSON only." },
      { role: "user", content: prompt }
    ]);

    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/teach", async (req, res) => {
  const { topic } = req.body;
  try {
    const prompt = `Provide a clear, intermediate-to-advanced explanation for the JavaScript topic: "${topic}".
    Include:
    1. Clear explanation (no basics).
    2. Annotated frontend + backend code snippets.
    3. A real-world mini-project snippet.
    4. Common mistakes.
    5. Two practice exercises.
    Return a JSON object with fields: "explanation", "codeSnippets", "miniProject", "commonMistakes", "exercises".`;

    const result = await callGroq([
      { role: "system", content: "You are a JavaScript mentor. Output JSON only." },
      { role: "user", content: prompt }
    ]);

    res.json(JSON.parse(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a JavaScript mentor for full-stack developers. Help with debugging, concept explanations, and comparisons between Browser and Node.js environments." },
        ...messages
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data.choices[0].message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/progress/:userId", async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.params.userId });
    res.json(progress || { completedTopics: [], scores: [], totalAttempted: 0, accuracy: 0 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/progress", async (req, res) => {
  const { userId, topic, score, total, difficulty, completed } = req.body;
  try {
    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = new Progress({ userId, completedTopics: [], scores: [], totalAttempted: 0, accuracy: 0 });
    }

    if (completed && !progress.completedTopics.includes(topic)) {
      progress.completedTopics.push(topic);
    }

    if (score !== undefined) {
      progress.scores.push({ topic, score, total, difficulty });
      progress.totalAttempted += total;
      
      const totalScore = progress.scores.reduce((acc: number, s: any) => acc + s.score, 0);
      const totalPossible = progress.scores.reduce((acc: number, s: any) => acc + s.total, 0);
      progress.accuracy = (totalScore / totalPossible) * 100;
    }

    await progress.save();
    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
