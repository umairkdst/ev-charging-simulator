"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const SimulationParameters_1 = require("./entities/SimulationParameters");
const SimulationResults_1 = require("./entities/SimulationResults");
const isTest = process.env.NODE_ENV === "test";
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: isTest ? ":memory:" : "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [SimulationParameters_1.SimulationParameters, SimulationResults_1.SimulationResults],
});
