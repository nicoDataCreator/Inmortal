// Vercel Serverless Function entry point bridging to the compiled CommonJS bundle
// This avoids strict ESM relative path issues and startup crashes at runtime.

export default async function handler(req: any, res: any) {
  try {
    // @ts-ignore
    const modules = await import("../dist/server.cjs");
    // Handle both default and named exports of the Express app
    const app = modules.app || modules.default;
    
    if (!app) {
      throw new Error("Could not extract Express app object from compiled server.cjs");
    }
    
    return app(req, res);
  } catch (err: any) {
    console.error("[Vercel Bridge Failure] Failed to load server bundle:", err);
    res.status(500).json({
      error: "Vercel Bridge Error: Failed to load bundled app server.",
      message: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined
    });
  }
}
