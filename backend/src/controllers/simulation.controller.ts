import type { Request, Response } from "express";
import * as svc from "../services/simulation.service";

export async function createParameters(req: Request, res: Response) {
  const saved = await svc.createParameters(req.body);
  res.json(saved);
}

export async function simulate(req: Request, res: Response) {
  const saved = await svc.runSimulation(Number(req.body.parametersId));
  res.json(saved);
}

// Following are not being used by frontend but are used for testing

export async function getParameters(req: Request, res: Response) {
  const row = await svc.getParameters(Number(req.params.id));
  if (!row) return res.status(404).json({ error: "Parameters not found" });
  res.json(row);
}

export async function updateParameters(req: Request, res: Response) {
  const saved = await svc.updateParameters(
    Number(req.params.id),
    req.body ?? {}
  );
  res.json(saved);
}

export async function deleteParameters(req: Request, res: Response) {
  await svc.deleteParameters(Number(req.params.id));
  res.status(204).end();
}

export async function updateResult(req: Request, res: Response) {
  const saved = await svc.updateResult(Number(req.params.id), req.body ?? {});
  res.json(saved);
}
