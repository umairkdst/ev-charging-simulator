import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import { createApp } from "../App";
import { AppDataSource } from "../data-source";

let app: ReturnType<typeof createApp>;
let parametersId = 0;
let resultId = 0;

describe("Simulation API", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    app = createApp();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("creates parameters", async () => {
    const res = await request(app).post("/api/parameters").send({
      chargePoints: 20,
      arrivalMultiplier: 100,
      carConsumption: 18,
      chargingPower: 11,
    });

    if (res.status !== 200) console.error("create parameters body:", res.body);
    expect(res.status).toBe(200);
    expect(typeof res.body.id).toBe("number");
    expect(res.body.chargePoints).toBe(20);
    parametersId = res.body.id;
  });

  it("simulates and returns populated arrays", async () => {
    const res = await request(app).post("/api/simulate").send({ parametersId });

    if (res.status !== 200) console.error("simulate body:", res.body);
    expect(res.status).toBe(200);

    expect(Array.isArray(res.body.exemplaryDay)).toBe(true);
    expect(Array.isArray(res.body.chargepointPower)).toBe(true);
    expect(res.body.exemplaryDay.length).toBeGreaterThan(0);
    expect(res.body.chargepointPower.length).toBeGreaterThan(0);

    resultId = res.body.id;
  });

  it("gets parameters by id", async () => {
    const res = await request(app).get(`/api/parameters/${parametersId}`);

    if (res.status !== 200) console.error("get params body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body?.id).toBe(parametersId);
  });

  it("patches parameters", async () => {
    const res = await request(app)
      .patch(`/api/parameters/${parametersId}`)
      .send({ arrivalMultiplier: 140 });

    if (res.status !== 200) console.error("patch params body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.arrivalMultiplier).toBe(140);
  });

  it("patches results", async () => {
    const res = await request(app)
      .patch(`/api/results/${resultId}`)
      .send({ concurrencyFactor: 55.5, peakPower: 123.4 });

    if (res.status !== 200) console.error("patch result body:", res.body);
    expect(res.status).toBe(200);
    expect(res.body.concurrencyFactor).toBe(55.5);
    expect(res.body.peakPower).toBe(123.4);
  });

  it("deletes parameters (cascades if configured)", async () => {
    const res = await request(app).delete(`/api/parameters/${parametersId}`);
    if (res.status !== 204) console.error("delete params body:", res.body);
    expect(res.status).toBe(204);
  });
});
