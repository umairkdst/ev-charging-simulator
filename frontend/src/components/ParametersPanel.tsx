/*
- Parameters Panel where user can adjust simulation parameters.
- Number of charge points and arrival probability multiplier act as weights for mock data generation.
- Input fields are validated to ensure they are within the defined limits.
- Reset button allows users to revert to default parameters.
*/

import { useEffect, useState } from "react";
import type { SimulationParameters } from "../types";
import {
  defaultParameters,
  MIN_CAR_CONS,
  MIN_CP_POWER,
} from "../types/constants";

interface ParameterPanelProps {
  parameters: SimulationParameters;
  onParametersChange: (params: SimulationParameters) => void;
  simulating: boolean;
}

const ParameterPanel = ({
  parameters,
  onParametersChange,
  simulating,
}: ParameterPanelProps) => {
  const [localParameters, setLocalParameters] =
    useState<SimulationParameters>(parameters);

  const handleInputChange = (
    field: keyof SimulationParameters,
    value: number
  ) => {
    const updated = { ...localParameters, [field]: value };
    setLocalParameters(updated);
    onParametersChange(updated);
  };

  const isAtDefaults =
    localParameters.chargePoints === defaultParameters.chargePoints &&
    localParameters.arrivalMultiplier === defaultParameters.arrivalMultiplier &&
    localParameters.carConsumption === defaultParameters.carConsumption &&
    localParameters.chargingPower === defaultParameters.chargingPower;

  useEffect(() => {
    setLocalParameters(parameters);
  }, [parameters]);

  const resetToDefaults = () => {
    setLocalParameters(defaultParameters);
    onParametersChange(defaultParameters);
  };
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Simulation Parameters
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Charge Points
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={localParameters.chargePoints}
              onChange={(e) =>
                handleInputChange("chargePoints", parseInt(e.target.value) || 1)
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arrival Probability Multiplier
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="20"
                max="200"
                value={localParameters.arrivalMultiplier}
                onChange={(e) =>
                  handleInputChange(
                    "arrivalMultiplier",
                    parseInt(e.target.value)
                  )
                }
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                {localParameters.arrivalMultiplier}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              20% - 200% (default: 100%)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Car Consumption (kWh per 100km)
            </label>
            <input
              type="number"
              min={MIN_CAR_CONS}
              step="0.1"
              value={localParameters.carConsumption}
              onChange={(e) =>
                handleInputChange(
                  "carConsumption",
                  parseFloat(e.target.value) || 18
                )
              }
              aria-invalid={localParameters.carConsumption < MIN_CAR_CONS}
              className={`input-field ${
                localParameters.carConsumption < MIN_CAR_CONS
                  ? "border-red-300 focus:ring-red-200"
                  : ""
              }`}
            />
            {localParameters.carConsumption < MIN_CAR_CONS && (
              <p className="mt-1 text-xs text-red-600">
                Minimum is {MIN_CAR_CONS} kWh/100km.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Charging Power per Chargepoint (kW)
            </label>
            <input
              type="number"
              min={MIN_CP_POWER}
              step={0.1}
              value={localParameters.chargingPower}
              onChange={(e) => {
                const v = e.currentTarget.valueAsNumber;
                handleInputChange(
                  "chargingPower",
                  Number.isNaN(v) ? localParameters.chargingPower : v
                );
              }}
              aria-invalid={localParameters.chargingPower < MIN_CP_POWER}
              className={`input-field ${
                localParameters.chargingPower < MIN_CP_POWER
                  ? "border-red-300 focus:ring-red-200"
                  : ""
              }`}
            />
            {localParameters.chargingPower < MIN_CP_POWER && (
              <p className="mt-1 text-xs text-red-600">
                Minimum is {MIN_CP_POWER} kW.
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-300 flex justify-end">
          <button
            onClick={resetToDefaults}
            disabled={isAtDefaults || simulating}
            className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterPanel;
