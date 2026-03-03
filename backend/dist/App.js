"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simulationRoutes_1 = __importDefault(require("./routes/simulationRoutes"));
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use("/api", simulationRoutes_1.default);
    app.use((err, _req, res, _next) => {
        console.error(err);
        const code = Number(err?.status || err?.statusCode || 500);
        res
            .status(code >= 400 && code <= 599 ? code : 500)
            .json({ error: "Server error" });
    });
    return app;
}
