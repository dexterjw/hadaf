import type { Hono } from "hono";
import { storage } from "./storage";

export async function registerRoutes(app: Hono): Promise<Hono> {
  // AI Chat endpoint for Hifz Companion
  app.post('/api/chat', async (c) => {
    try {
      const body = await c.req.json();
      const { message } = body;

      if (!message) {
        return c.json({ error: 'Message is required' }, 400);
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

      return c.json({ reply });
    } catch (error) {
      console.error('Chat API error:', error);
      return c.json({ error: 'Failed to process chat message' }, 500);
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return app;
}
