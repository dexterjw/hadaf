import { Hono } from "hono";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const app = new Hono();

// AI Chat endpoint for Hifz Companion
app.post('/chat', async (c) => {
    try {
        const body = await c.req.json();
        const { message } = body;

        if (!message) {
            return c.json({ error: 'Message is required' }, 400);
        }

        // Placeholder responses - same as the original Express endpoint
        const responses = [
            "MashaAllah, you're doing great! Keep up the consistent effort in your memorization journey.",
            "Remember, the Prophet (PBUH) said: 'The best among you are those who learn the Quran and teach it.' You're on a blessed path.",
            "For Tajweed, focus on proper pronunciation of the letters from their correct articulation points (makhaarij). Practice slowly with a teacher.",
            "The key to retention is consistent revision. Try to review what you've memorized multiple times throughout the day.",
            "May Allah make your journey easy. Remember that even small, consistent efforts compound over time.",
        ];

        const reply = responses[Math.floor(Math.random() * responses.length)];

        return c.json({ reply });
    } catch (error) {
        console.error("Chat API error:", error);
        return c.json({ error: "Failed to process chat message" }, 500);
    }
});

// Convert Netlify event to Hono-compatible Request
export const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
) => {
    // Construct a Request object from the Netlify event
    const url = new URL(event.path, `https://${event.headers.host || 'localhost'}`);
    const request = new Request(url.toString(), {
        method: event.httpMethod,
        headers: new Headers(event.headers as Record<string, string>),
        body: event.body || undefined,
    });

    // Execute the Hono app with the request
    const response = await app.fetch(request);

    // Convert Hono Response to Netlify response format
    const responseBody = await response.text();
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
    });

    return {
        statusCode: response.status,
        headers: responseHeaders,
        body: responseBody,
    };
};
