"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chargeProb = exports.expectedKmPerSession = void 0;
exports.generateExemplaryDay = generateExemplaryDay;
exports.generateChargepointPower = generateChargepointPower;
const simulate_1 = require("./simulate");
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rnd = (min, max) => min + Math.random() * (max - min);
const APB_MAX = Math.max(...simulate_1.ARRIVAL_PROB_BY_HOUR);
const P_TOTAL = simulate_1.DEMAND_DIST.reduce((s, d) => s + d.p, 0);
exports.expectedKmPerSession = simulate_1.DEMAND_DIST.reduce((s, d) => s + (d.km ?? 0) * (d.p / P_TOTAL), 0);
exports.chargeProb = simulate_1.DEMAND_DIST.filter((d) => d.km != null).reduce((s, d) => s + d.p, 0) /
    P_TOTAL;
function generateExemplaryDay(p) {
    const a = p.arrivalMultiplier / 100;
    const cf = p.carConsumption / 18;
    return simulate_1.ARRIVAL_PROB_BY_HOUR.map((w, hour) => {
        const hourLoad = w / APB_MAX;
        const active = clamp(Math.round(p.chargePoints * hourLoad * a * 0.75), 0, p.chargePoints);
        const power = +(active *
            p.chargingPower *
            0.6 *
            cf *
            rnd(0.9, 1.1)).toFixed(1);
        return { hour, power, activeStations: active };
    });
}
function generateChargepointPower(p) {
    const a = p.arrivalMultiplier / 100;
    const cf = p.carConsumption / 18;
    return Array.from({ length: p.chargePoints }, (_, i) => {
        const averagePower = +(p.chargingPower * 0.6 * cf * rnd(0.9, 1.1)).toFixed(1);
        const peakPower = +(averagePower * rnd(1.12, 1.3)).toFixed(1);
        const utilization = clamp(Math.round(45 * a * rnd(0.8, 1.2)), 5, 98);
        return { stationId: i + 1, averagePower, peakPower, utilization };
    });
}
