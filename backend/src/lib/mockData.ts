/**
 * Lightweight mock builders: a 24h “exemplary day” and a per-chargepoint table.
 * Numbers react to the same knobs as Task-1 (arrivalMultiplier, chargePoints, chargingPower, carConsumption).
 * `clamp` keeps ranges in check; `rnd` adds a little realism to the randomness.
 */
import { SimulationParameters } from "../entities/SimulationParameters";
import { ARRIVAL_PROB_BY_HOUR, DEMAND_DIST } from "./simulate";

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const rnd = (min: number, max: number) => min + Math.random() * (max - min);

const APB_MAX = Math.max(...ARRIVAL_PROB_BY_HOUR);

const P_TOTAL = DEMAND_DIST.reduce((s, d) => s + d.p, 0);

export const expectedKmPerSession = DEMAND_DIST.reduce(
  (s, d) => s + (d.km ?? 0) * (d.p / P_TOTAL),
  0
);

export const chargeProb =
  DEMAND_DIST.filter((d) => d.km != null).reduce((s, d) => s + d.p, 0) /
  P_TOTAL;

export function generateExemplaryDay(p: SimulationParameters) {
  const a = p.arrivalMultiplier / 100;
  const cf = p.carConsumption / 18;

  return ARRIVAL_PROB_BY_HOUR.map((w, hour) => {
    const hourLoad = w / APB_MAX;
    const active = clamp(
      Math.round(p.chargePoints * hourLoad * a * 0.75),
      0,
      p.chargePoints
    );
    const power = +(
      active *
      p.chargingPower *
      0.6 *
      cf *
      rnd(0.9, 1.1)
    ).toFixed(1);

    return { hour, power, activeStations: active };
  });
}

export function generateChargepointPower(p: SimulationParameters) {
  const a = p.arrivalMultiplier / 100;
  const cf = p.carConsumption / 18;

  return Array.from({ length: p.chargePoints }, (_, i) => {
    const averagePower = +(p.chargingPower * 0.6 * cf * rnd(0.9, 1.1)).toFixed(
      1
    );
    const peakPower = +(averagePower * rnd(1.12, 1.3)).toFixed(1);
    const utilization = clamp(Math.round(45 * a * rnd(0.8, 1.2)), 5, 98);

    return { stationId: i + 1, averagePower, peakPower, utilization };
  });
}
