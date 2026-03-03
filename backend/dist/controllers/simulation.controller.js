"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParameters = createParameters;
exports.simulate = simulate;
exports.getParameters = getParameters;
exports.updateParameters = updateParameters;
exports.deleteParameters = deleteParameters;
exports.updateResult = updateResult;
const svc = __importStar(require("../services/simulation.service"));
async function createParameters(req, res) {
    const saved = await svc.createParameters(req.body);
    res.json(saved);
}
async function simulate(req, res) {
    const saved = await svc.runSimulation(Number(req.body.parametersId));
    res.json(saved);
}
// Following are not being used by frontend but are used for testing
async function getParameters(req, res) {
    const row = await svc.getParameters(Number(req.params.id));
    if (!row)
        return res.status(404).json({ error: "Parameters not found" });
    res.json(row);
}
async function updateParameters(req, res) {
    const saved = await svc.updateParameters(Number(req.params.id), req.body ?? {});
    res.json(saved);
}
async function deleteParameters(req, res) {
    await svc.deleteParameters(Number(req.params.id));
    res.status(204).end();
}
async function updateResult(req, res) {
    const saved = await svc.updateResult(Number(req.params.id), req.body ?? {});
    res.json(saved);
}
