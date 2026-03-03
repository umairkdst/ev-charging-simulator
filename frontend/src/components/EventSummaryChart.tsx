/*
 *   - We render one Chart.js bar chart using the canvas.
 *   - On data/simulating changes, we destroy any existing charts and recreate them
 *   - Tight scale: `beginAtZero`, few ticks (`maxTicksLimit: 4`), + some headroom (`suggestedMax`) to avoid top crowding.
 */

import { useEffect, useMemo, useRef } from "react";
import Chart, { type ChartConfiguration } from "chart.js/auto";
import type { SimulationResults } from "../types";
import Spinner from "./ui/Spinner";
import { formatNumber } from "../helpers/utils";

interface ChargingEventsChartProps {
  data: SimulationResults["chargingEvents"];
  simulating?: boolean;
}

const ChargingEventsChart = ({
  data,
  simulating,
}: ChargingEventsChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const periods = [
    { label: "Year", value: data.year, color: "bg-blue-500" },
    { label: "Month", value: data.month, color: "bg-green-500" },
    { label: "Week", value: data.week, color: "bg-yellow-500" },
    { label: "Day", value: data.day, color: "bg-purple-500" },
  ];

  // Memoize to avoid recalculating between renders.

  const labels = useMemo(() => ["Year", "Month", "Week", "Day"], []);

  const values = useMemo(
    () => [data?.year ?? 0, data?.month ?? 0, data?.week ?? 0, data?.day ?? 0],
    [data]
  );

  const hasData = values.some((v) => v > 0);
  const maxVal = Math.max(1, ...values);

  useEffect(() => {
    if (!canvasRef.current || simulating || !hasData) return;

    chartRef.current?.destroy();

    const config: ChartConfiguration<"bar"> = {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Charging events",
            data: values,
            backgroundColor: [
              "rgba(59,130,246,0.6)",
              "rgba(16,185,129,0.6)",
              "rgba(234,179,8,0.6)",
              "rgba(168,85,247,0.6)",
            ],
            borderColor: [
              "rgb(59,130,246)",
              "rgb(16,185,129)",
              "rgb(234,179,8)",
              "rgb(168,85,247)",
            ],
            borderWidth: 1,
            borderRadius: 8,
            barThickness: 28,
            categoryPercentage: 0.7,
            barPercentage: 0.85,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${formatNumber(Number(ctx.raw) || 0)} events`,
            },
          },
        },

        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
          y: {
            beginAtZero: true,
            grace: "5%",
            suggestedMax: maxVal * 1.1,
            ticks: {
              maxTicksLimit: 4,
              callback: (v) => {
                const n = Number(v);
                return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
              },
              precision: 0,
            },
            grid: { color: "rgba(148,163,184,0.2)" },
          },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [simulating, hasData, maxVal, labels, values]);

  return (
    <div className="card h-full min-h-[420px] flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Charging Events
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
          <div className="border border-gray-200 rounded-lg p-3 h-64">
            <canvas ref={canvasRef} />
          </div>

          <div className="grid grid-cols-2 mt-2 gap-4">
            {periods.map((period, index) => (
              <div
                key={index}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(period.value)}
                </p>
                <p className="text-sm text-gray-600">
                  per {period.label.toLowerCase()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-600">Average Events/Day</p>
              <p className="font-semibold text-gray-900">
                {formatNumber(Math.round((data?.year ?? 0) / 365), 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Peak Hour Events</p>
              <p className="font-semibold text-gray-900">
                ~{formatNumber(Math.round((data?.day ?? 0) * 0.15), 0)}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChargingEventsChart;
