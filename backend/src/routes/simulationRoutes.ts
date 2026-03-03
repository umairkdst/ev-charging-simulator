import { Router } from "express";
import * as ctrl from "../controllers/simulation.controller";

const router = Router();

// Parameters
router.post("/parameters", ctrl.createParameters);
router.get("/parameters/:id", ctrl.getParameters);
router.patch("/parameters/:id", ctrl.updateParameters);
router.delete("/parameters/:id", ctrl.deleteParameters);

// Simulation
router.post("/simulate", ctrl.simulate);

// Results
router.patch("/results/:id", ctrl.updateResult);

export default router;
