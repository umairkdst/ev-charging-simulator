import type { SimulationResults } from ".";

export const defaultParameters = {
  chargePoints: 20,
  arrivalMultiplier: 100,
  carConsumption: 18,
  chargingPower: 11,
};

export const initialResults: SimulationResults = {
  totalEnergyCharged: 0,
  chargingEvents: {
    year: 0,
    month: 0,
    week: 0,
    day: 0,
  },
  concurrencyFactor: 0,
  peakPower: 0,
  exemplaryDay: [],
  chargepointPower: [],
};

export const MIN_CAR_CONS = 18;
export const MIN_CP_POWER = 11;
