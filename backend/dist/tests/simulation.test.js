"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const App_1 = require("../App");
const data_source_1 = require("../data-source");
let app;
let parametersId = 0;
let resultId = 0;
(0, vitest_1.describe)("Simulation API", () => {
    (0, vitest_1.beforeAll)(async () => {
        await data_source_1.AppDataSource.initialize();
        app = (0, App_1.createApp)();
    });
    (0, vitest_1.afterAll)(async () => {
        await data_source_1.AppDataSource.destroy();
    });
    (0, vitest_1.it)("creates parameters", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/parameters").send({
            chargePoints: 20,
            arrivalMultiplier: 100,
            carConsumption: 18,
            chargingPower: 11,
        });
        if (res.status !== 200)
            console.error("create parameters body:", res.body);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(typeof res.body.id).toBe("number");
        (0, vitest_1.expect)(res.body.chargePoints).toBe(20);
        parametersId = res.body.id;
    });
    (0, vitest_1.it)("simulates and returns populated arrays", async () => {
        const res = await (0, supertest_1.default)(app).post("/api/simulate").send({ parametersId });
        if (res.status !== 200)
            console.error("simulate body:", res.body);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(Array.isArray(res.body.exemplaryDay)).toBe(true);
        (0, vitest_1.expect)(Array.isArray(res.body.chargepointPower)).toBe(true);
        (0, vitest_1.expect)(res.body.exemplaryDay.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(res.body.chargepointPower.length).toBeGreaterThan(0);
        resultId = res.body.id;
    });
    (0, vitest_1.it)("gets parameters by id", async () => {
        const res = await (0, supertest_1.default)(app).get(`/api/parameters/${parametersId}`);
        if (res.status !== 200)
            console.error("get params body:", res.body);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body?.id).toBe(parametersId);
    });
    (0, vitest_1.it)("patches parameters", async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/parameters/${parametersId}`)
            .send({ arrivalMultiplier: 140 });
        if (res.status !== 200)
            console.error("patch params body:", res.body);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.arrivalMultiplier).toBe(140);
    });
    (0, vitest_1.it)("patches results", async () => {
        const res = await (0, supertest_1.default)(app)
            .patch(`/api/results/${resultId}`)
            .send({ concurrencyFactor: 55.5, peakPower: 123.4 });
        if (res.status !== 200)
            console.error("patch result body:", res.body);
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.concurrencyFactor).toBe(55.5);
        (0, vitest_1.expect)(res.body.peakPower).toBe(123.4);
    });
    (0, vitest_1.it)("deletes parameters (cascades if configured)", async () => {
        const res = await (0, supertest_1.default)(app).delete(`/api/parameters/${parametersId}`);
        if (res.status !== 204)
            console.error("delete params body:", res.body);
        (0, vitest_1.expect)(res.status).toBe(204);
    });
});
