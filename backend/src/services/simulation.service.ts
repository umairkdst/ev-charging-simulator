import { AppDataSource } from "../data-source";
import { SimulationParameters } from "../entities/SimulationParameters";
import { SimulationResults } from "../entities/SimulationResults";
import {
  generateChargepointPower,
  generateExemplaryDay,
} from "../lib/mockData";
import { simulate } from "../lib/simulate";

const notFound = (msg: string) =>
  Object.assign(new Error(msg), { status: 404 });

export async function createParameters(body: Partial<SimulationParameters>) {
  const repo = AppDataSource.getRepository(SimulationParameters);
  const row = repo.create({
    chargePoints: Number(body.chargePoints),
    arrivalMultiplier: Number(body.arrivalMultiplier ?? 100),
    carConsumption: Number(body.carConsumption ?? 18),
    chargingPower: Number(body.chargingPower ?? 11),
  });
  return repo.save(row);
}

// Runs a simulation for a given parameters.
export async function runSimulation(parametersId: number) {
  const paramsRepo = AppDataSource.getRepository(SimulationParameters);
  const resultsRepo = AppDataSource.getRepository(SimulationResults);

  const parameters = await paramsRepo.findOne({ where: { id: parametersId } });
  if (!parameters) throw notFound("Parameters not found");

  const simulateResults = simulate({
    chargePoints: parameters.chargePoints,
    powerKW: parameters.chargingPower,
    consumptionKWhPer100km: parameters.carConsumption,
    arrivalScale: parameters.arrivalMultiplier / 100,
  });

  const exemplaryDay = generateExemplaryDay(parameters);
  const chargepointPower = generateChargepointPower(parameters);

  const row = resultsRepo.create({
    parameters,
    totalEnergyCharged: simulateResults.totalEnergyKWh,
    peakPower: simulateResults.actualMaxKW,
    concurrencyFactor: simulateResults.concurrencyFactor * 100,
    exemplaryDay,
    chargepointPower,
    chargingEventsYear: Math.round(700 + Math.random() * 400),
    chargingEventsMonth: Math.round(40 + Math.random() * 70),
    chargingEventsWeek: Math.round(20 + Math.random() * 40),
    chargingEventsDay: Math.round(3 + Math.random() * 30),
  });

  return resultsRepo.save(row);
}

// Following are not being used by frontend

export async function getParameters(id: number) {
  if (!Number.isFinite(id)) return null;
  const repo = AppDataSource.getRepository(SimulationParameters);
  return repo.findOne({ where: { id } });
}

export async function updateParameters(
  id: number,
  patch: Partial<SimulationParameters>
) {
  const repo = AppDataSource.getRepository(SimulationParameters);

  const { id: _ignore, ...rest } = patch ?? {};
  if (rest.carConsumption != null)
    rest.carConsumption = Math.max(18, +rest.carConsumption);
  if (rest.chargingPower != null)
    rest.chargingPower = Math.max(11, +rest.chargingPower);

  await repo.update(id, rest);
  const saved = await repo.findOneBy({ id });
  if (!saved) throw notFound("Parameters not found");
  return saved;
}

export async function deleteParameters(id: number) {
  const repo = AppDataSource.getRepository(SimulationParameters);
  const exists = await repo.exist({ where: { id } });
  if (!exists) throw notFound("Parameters not found");
  await repo.delete(id);
}

export async function updateResult(
  id: number,
  patch: Partial<SimulationResults>
) {
  const repo = AppDataSource.getRepository(SimulationResults);
  const row = await repo.findOne({ where: { id }, relations: ["parameters"] });
  if (!row) throw notFound("Result not found");

  // block FK changes using PATCH
  const copy: any = { ...(patch ?? {}) };
  delete copy.id;
  delete copy.parameters;
  delete copy.parametersId;

  Object.assign(row, copy);
  return repo.save(row);
}
