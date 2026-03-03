import axios from "axios";
import type {
  ApiParameters,
  ApiSimulationResult,
  SimulationParameters,
  SimulationResults,
} from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const DELAY = Number(import.meta.env.VITE_API_DELAY_MS ?? 0);

// Delay before sending each request to simulate network latency
api.interceptors.request.use(async (config) => {
  if (DELAY && import.meta.env.MODE !== "production") {
    await sleep(DELAY);
  }
  return config;
});

export function normalizeResults(r: ApiSimulationResult): SimulationResults {
  return {
    totalEnergyCharged: r.totalEnergyCharged,
    peakPower: r.peakPower,
    concurrencyFactor: r.concurrencyFactor,
    exemplaryDay: r.exemplaryDay,
    chargepointPower: r.chargepointPower,
    chargingEvents: {
      year: r.chargingEventsYear,
      month: r.chargingEventsMonth,
      week: r.chargingEventsWeek,
      day: r.chargingEventsDay,
    },
  };
}

// Create simulation parameters
export async function createParameters(
  p: SimulationParameters
): Promise<ApiParameters> {
  const { data } = await api.post<ApiParameters>("/api/parameters", p);
  return data;
}

// Run simulation for given parameters
export async function simulate(
  parametersId: number
): Promise<ApiSimulationResult> {
  const { data } = await api.post<ApiSimulationResult>("/api/simulate", {
    parametersId,
  });
  return data;
}
