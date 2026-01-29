import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler: Handler = async (
    event: HandlerEvent,
    context: HandlerContext
) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        // Parse request body
        const body = event.body ? JSON.parse(event.body) : {};
        const { message } = body;

        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Message is required" }),
            };
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

        return {
            statusCode: 200,
            body: JSON.stringify({ reply }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error("Chat API error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to process chat message" }),
        };
    }
};
