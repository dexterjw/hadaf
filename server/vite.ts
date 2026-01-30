import { type Hono } from "hono";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export async function setupVite(httpServer: Server, app: Hono) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server: httpServer, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  // Create a request handler that combines Hono and Vite
  httpServer.on("request", async (req, res) => {
    const url = req.url || "/";

    // Let Hono handle API routes first
    if (url.startsWith("/api")) {
      const request = new Request(`http://${req.headers.host}${url}`, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: req.method !== "GET" && req.method !== "HEAD" ? await getBody(req) : undefined,
      });

      const honoResponse = await app.fetch(request);

      res.statusCode = honoResponse.status;
      honoResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      const body = await honoResponse.text();
      res.end(body);
      return;
    }

    // For non-API routes, use Vite middleware for module/asset requests
    // @ts-ignore - vite middlewares is a connect instance
    vite.middlewares(req, res, async () => {
      try {
        const clientTemplate = path.resolve(
          import.meta.dirname,
          "..",
          "client",
          "index.html",
        );

        // Always reload the index.html file from disk in case it changes
        let template = await fs.promises.readFile(clientTemplate, "utf-8");
        template = template.replace(
          `src="/src/main.tsx"`,
          `src="/src/main.tsx?v=${nanoid()}"`,
        );
        const page = await vite.transformIndexHtml(url, template);
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(page);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        res.statusCode = 500;
        res.end((e as Error).message);
      }
    });
  });
}

// Helper function to read request body
function getBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk: any) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", reject);
  });
}
