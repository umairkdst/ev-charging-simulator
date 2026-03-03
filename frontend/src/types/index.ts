export interface SimulationParameters {
  chargePoints: number;
  arrivalMultiplier: number; // 20-200%, default 100%
  carConsumption: number; // kWh per 100km, default 18
  chargingPower: number; // kW per chargepoint, default 11
}

export interface SimulationResults {
  totalEnergyCharged: number;
  chargingEvents: {
    year: number;
    month: number;
    week: number;
    day: number;
  };
  concurrencyFactor: number; // percentage
  peakPower: number;
  exemplaryDay: HourlyData[];
  chargepointPower: ChargepointPowerData[];
}

export interface HourlyData {
  hour: number;
  power: number;
  activeStations: number;
}

export interface ChargepointPowerData {
  stationId: number;
  averagePower: number;
  peakPower: number;
  utilization: number; // percentage
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Backend DTOs
export interface ApiParameters {
  id: number;
  chargePoints: number;
  arrivalMultiplier: number;
  carConsumption: number;
  chargingPower: number;
}

export interface ApiSimulationResult {
  id: number;
  totalEnergyCharged: number;
  peakPower: number;
  concurrencyFactor: number;
  exemplaryDay: Array<{ hour: number; power: number; activeStations: number }>;
  chargepointPower: Array<{
    stationId: number;
    averagePower: number;
    peakPower: number;
    utilization: number;
  }>;
  chargingEventsYear: number;
  chargingEventsMonth: number;
  chargingEventsWeek: number;
  chargingEventsDay: number;
}
