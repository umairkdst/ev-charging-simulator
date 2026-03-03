"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParameters = createParameters;
exports.runSimulation = runSimulation;
exports.getParameters = getParameters;
exports.updateParameters = updateParameters;
exports.deleteParameters = deleteParameters;
exports.updateResult = updateResult;
const data_source_1 = require("../data-source");
const SimulationParameters_1 = require("../entities/SimulationParameters");
const SimulationResults_1 = require("../entities/SimulationResults");
const mockData_1 = require("../lib/mockData");
const simulate_1 = require("../lib/simulate");
const notFound = (msg) => Object.assign(new Error(msg), { status: 404 });
async function createParameters(body) {
    const repo = data_source_1.AppDataSource.getRepository(SimulationParameters_1.SimulationParameters);
    const row = repo.create({
        chargePoints: Number(body.chargePoints),
        arrivalMultiplier: Number(body.arrivalMultiplier ?? 100),
        carConsumption: Number(body.carConsumption ?? 18),
        chargingPower: Number(body.chargingPower ?? 11),
    });
    return repo.save(row);
}
// Runs a simulation for a given parameters.
async function runSimulation(parametersId) {
    const paramsRepo = data_source_1.AppDataSource.getRepository(SimulationParameters_1.SimulationParameters);
    const resultsRepo = data_source_1.AppDataSource.getRepository(SimulationResults_1.SimulationResults);
    const parameters = await paramsRepo.findOne({ where: { id: parametersId } });
    if (!parameters)
        throw notFound("Parameters not found");
    const simulateResults = (0, simulate_1.simulate)({
        chargePoints: parameters.chargePoints,
        powerKW: parameters.chargingPower,
        consumptionKWhPer100km: parameters.carConsumption,
        arrivalScale: parameters.arrivalMultiplier / 100,
    });
    const exemplaryDay = (0, mockData_1.generateExemplaryDay)(parameters);
    const chargepointPower = (0, mockData_1.generateChargepointPower)(parameters);
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
async function getParameters(id) {
    if (!Number.isFinite(id))
        return null;
    const repo = data_source_1.AppDataSource.getRepository(SimulationParameters_1.SimulationParameters);
    return repo.findOne({ where: { id } });
}
async function updateParameters(id, patch) {
    const repo = data_source_1.AppDataSource.getRepository(SimulationParameters_1.SimulationParameters);
    const { id: _ignore, ...rest } = patch ?? {};
    if (rest.carConsumption != null)
        rest.carConsumption = Math.max(18, +rest.carConsumption);
    if (rest.chargingPower != null)
        rest.chargingPower = Math.max(11, +rest.chargingPower);
    await repo.update(id, rest);
    const saved = await repo.findOneBy({ id });
    if (!saved)
        throw notFound("Parameters not found");
    return saved;
}
async function deleteParameters(id) {
    const repo = data_source_1.AppDataSource.getRepository(SimulationParameters_1.SimulationParameters);
    const exists = await repo.exist({ where: { id } });
    if (!exists)
        throw notFound("Parameters not found");
    await repo.delete(id);
}
async function updateResult(id, patch) {
    const repo = data_source_1.AppDataSource.getRepository(SimulationResults_1.SimulationResults);
    const row = await repo.findOne({ where: { id }, relations: ["parameters"] });
    if (!row)
        throw notFound("Result not found");
    // block FK changes using PATCH
    const copy = { ...(patch ?? {}) };
    delete copy.id;
    delete copy.parameters;
    delete copy.parametersId;
    Object.assign(row, copy);
    return repo.save(row);
}
