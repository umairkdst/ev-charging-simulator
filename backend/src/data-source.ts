import { DataSource } from "typeorm";
import { SimulationParameters } from "./entities/SimulationParameters";
import { SimulationResults } from "./entities/SimulationResults";

const isTest = process.env.NODE_ENV === "test";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: isTest ? ":memory:" : "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [SimulationParameters, SimulationResults],
});
