import { Hono } from "hono";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { registerRoutes } from "../../server/routes";

// Create a Hono app instance and register shared routes
const app = new Hono();

// Initialize the app with shared routes
await registerRoutes(app);

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
