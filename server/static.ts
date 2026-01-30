import { serveStatic as honoServeStatic } from "@hono/node-server/serve-static";
import type { Hono } from "hono";
import fs from "fs";
import path from "path";

export function serveStatic(app: Hono) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files from the dist/public directory
  app.use("/*", honoServeStatic({ root: "./dist/public" }));

  // Fall through to index.html for client-side routing
  app.get("*", async (c) => {
    const indexPath = path.resolve(distPath, "index.html");
    const html = await fs.promises.readFile(indexPath, "utf-8");
    return c.html(html);
  });
}
