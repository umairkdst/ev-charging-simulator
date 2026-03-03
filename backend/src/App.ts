import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import simulationRoutes from "./routes/simulationRoutes";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", simulationRoutes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const code = Number(err?.status || err?.statusCode || 500);
    res
      .status(code >= 400 && code <= 599 ? code : 500)
      .json({ error: "Server error" });
  });
  return app;
}
