import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = new Hono();

export function log(message: string, source = "hono") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Logging middleware
app.use("*", async (c, next) => {
  const start = Date.now();
  const path = c.req.path;

  await next();

  const duration = Date.now() - start;
  if (path.startsWith("/api")) {
    const logLine = `${c.req.method} ${path} ${c.res.status} in ${duration}ms`;
    log(logLine);
  }
});

(async () => {
  await registerRoutes(app);

  // Error handling middleware
  app.onError((err, c) => {
    const status = (err as any).status || 500;
    const message = err.message || "Internal Server Error";

    console.error(err);
    return c.json({ message }, status);
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 3000 if not specified.
  const port = parseInt(process.env.PORT || "3000", 10);

  // Setup static files and Vite in development
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);

    const server = serve({
      fetch: app.fetch,
      port,
      hostname: "0.0.0.0",
    });

    log(`serving on port ${port}`);
  } else {
    // In development, use a custom HTTP server to integrate both Hono and Vite
    const { setupVite } = await import("./vite");
    const httpServer = createServer();
    await setupVite(httpServer, app);

    httpServer.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  }
})();
