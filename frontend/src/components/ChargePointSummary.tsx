import { useEffect, useMemo, useState } from "react";
import type { ChargepointPowerData } from "../types";
import { formatNumber, getPillColor } from "../helpers/utils";
import Spinner from "./ui/Spinner";

interface Props {
  data: ChargepointPowerData[];
  simulating: boolean;
  initialPageSize?: number;
}

const PAGE_OPTIONS = [5, 10, 15, 20, 30, 40];

const ChargePointSummary = ({
  data,
  simulating,
  initialPageSize = 5,
}: Props) => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil((data?.length ?? 0) / pageSize));

  useEffect(() => {
    setPage(1);
  }, [data, pageSize]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return (data ?? []).slice(start, start + pageSize);
  }, [data, page, pageSize]);

  const prev = () => setPage((p) => Math.max(1, p - 1));
  const next = () => setPage((p) => Math.min(pageCount, p + 1));

  return (
    <div className="card">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Chargepoint Power (kW)
        </h2>
      </div>

      {simulating ? (
        <div className="border border-gray-200 rounded-lg py-12 flex items-center justify-center">
          <Spinner label="Generating…" />
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-700">
                  <th className="px-3 py-2.5 text-left font-medium border-b border-gray-200">
                    CP
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium border-b border-gray-200">
                    Avg kW
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium border-b border-gray-200">
                    Peak kW
                  </th>
                  <th className="px-3 py-2.5 text-left font-medium border-b border-gray-200">
                    Util.
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row) => (
                  <tr
                    key={row.stationId}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-3 py-2.5 border-t border-gray-200">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                        #{row.stationId}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 border-t border-gray-200 text-gray-900">
                      {formatNumber(row.averagePower, 1)}
                    </td>
                    <td className="px-3 py-2.5 border-t border-gray-200 text-gray-900">
                      {formatNumber(row.peakPower, 1)}
                    </td>
                    <td className="px-3 py-2.5 border-t border-gray-200">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPillColor(
                          row.utilization
                        )}`}
                      >
                        {formatNumber(row.utilization, 0)}%
                      </span>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-gray-500 border-t border-gray-200"
                    >
                      No data yet — click{" "}
                      <span className="font-medium text-blue-600">
                        Simulate
                      </span>
                      .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={prev}
                disabled={page === 1}
                aria-label="Previous page"
                className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                Page {page} / {pageCount}
              </span>

              <button
                onClick={next}
                disabled={page === pageCount || simulating}
                aria-label="Next page"
                className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-end">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <span>Rows</span>
                <select
                  value={pageSize}
                  onChange={(e) =>
                    setPageSize(parseInt(e.target.value, 10) || 10)
                  }
                  className="select-caret"
                  disabled={simulating || data.length < 1}
                >
                  {PAGE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChargePointSummary;
