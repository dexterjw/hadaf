import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // AI Chat endpoint for Hifz Companion
  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Placeholder response - integrate with Gemini API when API key is available
      // For now, provide helpful canned responses
      const responses = [
        "MashaAllah, you're doing great! Keep up the consistent effort in your memorization journey.",
        "Remember, the Prophet (PBUH) said: 'The best among you are those who learn the Quran and teach it.' You're on a blessed path.",
        "For Tajweed, focus on proper pronunciation of the letters from their correct articulation points (makhaarij). Practice slowly with a teacher.",
        "The key to retention is consistent revision. Try to review what you've memorized multiple times throughout the day.",
        "May Allah make your journey easy. Remember that even small, consistent efforts compound over time."
      ];

      const reply = responses[Math.floor(Math.random() * responses.length)];

      res.json({ reply });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}

