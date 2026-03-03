/**
  How it works
- The year is split into 15-minute ticks (35,040 in total).
- Each chargepoint can be idle or busy.
- If idle, once per tick we roll against the hourly probability distribution (T1) to decide if a new EV arrives.
- If an EV arrives, its demand (in km) is sampled from distribution T2, then converted into kWh.
- If busy, the chargepoint delivers up to `powerKW × 0.25h` each tick until the session is complete.
- No queuing: if a new EV arrives at a busy charger, it is ignored.
**/

export type inputs = {
  chargePoints: number;
  powerKW: number; // max charging power per charge point
  consumptionKWhPer100km: number;
  arrivalScale?: number;
};

export type outputs = {
  totalEnergyKWh: number;
  theoreticalMaxKW: number; // chargePoints × powerKW
  actualMaxKW: number; // max observed power in any 15 mins tick
  concurrencyFactor: number; // actualMaxKW / theoreticalMaxKW
  eventsYear: number; // total events in a year
};

// T1: hourly arrival
export const ARRIVAL_PROB_BY_HOUR = [
  0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 2.83, 2.83, 5.66, 5.66, 5.66,
  7.55, 7.55, 7.55, 10.38, 10.38, 10.38, 4.72, 4.72, 4.72, 0.94, 0.94,
];

// T2: demand distribution ~ round up to 1
export const DEMAND_DIST: { p: number; km: number | null }[] = [
  { p: 34.31, km: null },
  { p: 4.9, km: 5 },
  { p: 9.8, km: 10 },
  { p: 11.76, km: 20 },
  { p: 8.82, km: 30 },
  { p: 11.76, km: 50 },
  { p: 10.78, km: 100 },
  { p: 4.9, km: 200 },
  { p: 2.94, km: 300 },
];

// Time constants
const TICKS_PER_HOUR = 4; // 15-min ticks
const HOURS_PER_DAY = 24;
const TICKS_PER_DAY = TICKS_PER_HOUR * HOURS_PER_DAY;
const DAYS_PER_YEAR = 365;
const TICKS_PER_YEAR = DAYS_PER_YEAR * TICKS_PER_DAY;
const HOURS_PER_TICK = 0.25;

function getDemandProbability(): number | null {
  // helper function to sample demand
  const r = Math.random();
  let acc = 0;
  for (const { p, km } of DEMAND_DIST) {
    acc += p / 100;
    if (r <= acc) return km;
  }
  return null;
}

export function simulate(inp: inputs): outputs {
  const scale = Math.max(0, inp.arrivalScale ?? 1);
  const energyPerKm = inp.consumptionKWhPer100km / 100;
  const remaining = Array.from({ length: inp.chargePoints }, () => 0);

  let totalEnergy = 0;
  let actualMaxKW = 0;
  let eventsYear = 0;

  for (let tick = 0; tick < TICKS_PER_YEAR; tick++) {
    const hourOfDay = Math.floor(tick / TICKS_PER_HOUR) % 24; // how many hours into the day
    const baseProb = ARRIVAL_PROB_BY_HOUR[hourOfDay]! / 100;
    const arrivalProb = Math.min(1, baseProb * scale);

    let tickKW = 0;

    for (let i = 0; i < inp.chargePoints; i++) {
      if (remaining[i]! <= 1e-12 && Math.random() < arrivalProb) {
        // If idle and arrival
        const km = getDemandProbability();
        if (km !== null) {
          remaining[i] = km * energyPerKm;
          eventsYear++;
        }
      }
      // Deliver energy if not idle
      if (remaining[i]! > 1e-12) {
        const deliver = Math.min(remaining[i]!, inp.powerKW * HOURS_PER_TICK);
        remaining[i]! -= deliver;
        totalEnergy += deliver;
        tickKW += deliver / HOURS_PER_TICK;
      }
    }

    if (tickKW > actualMaxKW) actualMaxKW = tickKW;
  }

  const theoreticalMaxKW = inp.chargePoints * inp.powerKW;
  const concurrencyFactor =
    theoreticalMaxKW > 0 ? actualMaxKW / theoreticalMaxKW : 0;

  return {
    totalEnergyKWh: +totalEnergy.toFixed(1),
    theoreticalMaxKW,
    actualMaxKW: +actualMaxKW.toFixed(1),
    concurrencyFactor: +concurrencyFactor.toFixed(4),
    eventsYear,
  };
}

const [, , cpArg, powerArg, consArg, arrArg] = process.argv;

const chargePoints = Number(cpArg) || 20;
const powerKW = Number(powerArg) || 11;
const consumption = Number(consArg) || 18;
const arrivalScale = Number(arrArg) || 1;

const out = simulate({
  chargePoints,
  powerKW,
  consumptionKWhPer100km: consumption,
  // arrivalScale,
});

console.log(JSON.stringify(out, null, 2));
