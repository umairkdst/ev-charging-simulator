/*
 *   - We render two separate Chart.js line charts, each on its own <canvas>.
 *   - Refs hold the canvases and the chart instances.
 *   - On data/simulating changes, we destroy any existing charts and recreate them
 *   - Tight Y scales and max 4 ticks to keep the charts “small”.
 *   - X axis shows every 3rd label (00:00, 03:00, 06:00, …) to reduce clutter.
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import Chart, { type ChartConfiguration } from "chart.js/auto";
import type { HourlyData } from "../types";
import { formatNumber } from "../helpers/utils";
import Spinner from "./ui/Spinner";

interface ExemplaryDayChartProps {
  data: HourlyData[];
  simulating?: boolean;
}

const ExemplaryDayChart = ({ data, simulating }: ExemplaryDayChartProps) => {
  const powerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stationsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const powerChartRef = useRef<Chart | null>(null);
  const stationsChartRef = useRef<Chart | null>(null);

  const hasData = Array.isArray(data) && data.length > 0;

  // Memoize to avoid recalculating between renders.

  const labels = useMemo(
    () =>
      hasData ? data.map((d) => `${String(d.hour).padStart(2, "0")}:00`) : [],
    [hasData, data]
  );

  const powerSeries = useMemo(
    () => (hasData ? data.map((d) => d.power) : []),
    [hasData, data]
  );
  const stationSeries = useMemo(
    () => (hasData ? data.map((d) => d.activeStations) : []),
    [hasData, data]
  );

  const maxPower = Math.max(1, ...(powerSeries.length ? powerSeries : [1]));
  const maxStations = Math.max(
    1,
    ...(stationSeries.length ? stationSeries : [1])
  );
  const yPowerSuggestedMax = maxPower * 1.08; // Slightly above max for visual padding.
  const yStationsSuggestedMax = maxStations * 1.08;

  // Stable makeOptions ref; prevents effect reruns.

  const makeOptions = useCallback(
    (suggestedMax: number): ChartConfiguration<"line">["options"] => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.parsed.y);
              return `${v}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: "rgba(148,163,184,0.2)" },
          ticks: {
            maxRotation: 0,
            autoSkip: false,
            callback: (_val, idx) =>
              idx % 3 === 0 ? labels[idx as number] : "",
          },
        },
        y: {
          beginAtZero: true,
          suggestedMax,
          ticks: { maxTicksLimit: 4 },
          grid: { color: "rgba(148,163,184,0.2)" },
          title: { display: false },
        },
      },
    }),
    [labels]
  );

  useEffect(() => {
    if (simulating || !hasData) return;

    powerChartRef.current?.destroy();
    stationsChartRef.current?.destroy();

    if (powerCanvasRef.current) {
      powerChartRef.current = new Chart(powerCanvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Power (kW)",
              data: powerSeries,
              borderColor: "rgb(59,130,246)",
              backgroundColor: "rgba(59,130,246,0.18)",
              tension: 0.35,
              pointRadius: 1.5,
              pointHoverRadius: 3,
              fill: true,
            },
          ],
        },
        options: makeOptions(yPowerSuggestedMax),
      });
    }

    if (stationsCanvasRef.current) {
      stationsChartRef.current = new Chart(stationsCanvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Active Stations",
              data: stationSeries,
              borderColor: "rgb(16,185,129)",
              backgroundColor: "rgba(16,185,129,0.12)",
              tension: 0.35,
              pointRadius: 1.5,
              pointHoverRadius: 3,
              fill: false,
            },
          ],
        },
        options: makeOptions(yStationsSuggestedMax),
      });
    }

    return () => {
      powerChartRef.current?.destroy();
      stationsChartRef.current?.destroy();
      powerChartRef.current = null;
      stationsChartRef.current = null;
    };
  }, [
    simulating,
    hasData,
    labels,
    maxPower,
    maxStations,
    powerSeries,
    makeOptions,
    yPowerSuggestedMax,
    stationSeries,
    yStationsSuggestedMax,
  ]);

  const avgPower = powerSeries.length
    ? powerSeries.reduce((s, v) => s + v, 0) / powerSeries.length
    : 0;
  const dailyEnergy = powerSeries.length
    ? powerSeries.reduce((s, v) => s + v, 0) * 0.25
    : 0;

  return (
    <div className="card h-full min-h-[460px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Exemplary Day
      </h3>

      {simulating ? (
        <div className="flex-1 border border-gray-200 rounded-lg flex items-center justify-center">
          <Spinner label="Generating…" />
        </div>
      ) : !hasData ? (
        <div className="flex-1 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          No data yet — click{" "}
          <span className="ml-1 font-medium text-blue-600">Simulate</span>.
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg p-3 h-44">
            <div className="mb-2 text-sm font-medium text-gray-700">
              Power (kW)
            </div>
            <div className="h-[calc(100%-1.25rem)]">
              <canvas ref={powerCanvasRef} />
            </div>
          </div>

          <div className="mt-3 border border-gray-200 rounded-lg p-3 h-44">
            <div className="mb-2 text-sm font-medium text-gray-700">
              Active Stations
            </div>
            <div className="h-[calc(100%-1.25rem)]">
              <canvas ref={stationsCanvasRef} />
            </div>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {formatNumber(maxPower, 0)} kW
              </p>
              <p className="text-xs text-gray-500">Peak Power</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(avgPower, 0)} kW
              </p>
              <p className="text-xs text-gray-500">Average Power</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {formatNumber(dailyEnergy, 0)} kWh
              </p>
              <p className="text-xs text-gray-500">Daily Energy</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExemplaryDayChart;
