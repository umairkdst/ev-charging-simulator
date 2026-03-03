import ChartIcon from "../assets/ChartIcon";
import ClockIcon from "../assets/ClockIcon";
import HandIcon from "../assets/HandIcon";
import LightningIcon from "../assets/LightningIcon";
import { formatNumber } from "../helpers/utils";
import type { SimulationResults } from "../types";
import KeyMetricCard from "./KeyMetricCard";
import SkeletonCard from "./ui/SkeletonCard";

interface KeyMetricsProps {
  results: SimulationResults;
  simulating: boolean;
}

const KeyMetrics = ({ results, simulating }: KeyMetricsProps) => {
  if (simulating) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <KeyMetricCard
        icon={<LightningIcon className="w-8 h-8 text-blue-600" />}
        iconBgClass="p-2 bg-blue-100 rounded-lg"
        title="Total Energy"
        valueText={`${formatNumber(results.totalEnergyCharged, 0)} kWh`}
      />

      <KeyMetricCard
        icon={<HandIcon className="w-8 h-8 text-orange-600" />}
        iconBgClass="p-2 bg-orange-100 rounded-lg"
        title="Peak Power"
        valueText={`${formatNumber(results.peakPower, 1)} kW`}
      />

      <KeyMetricCard
        icon={<ChartIcon className="w-8 h-8 text-green-600" />}
        iconBgClass="p-2 bg-green-100 rounded-lg"
        title="Concurrency Factor"
        valueText={`${formatNumber(results.concurrencyFactor, 1)}%`}
      />

      <KeyMetricCard
        icon={<ClockIcon className="w-8 h-8 text-purple-600" />}
        iconBgClass="p-2 bg-purple-100 rounded-lg"
        title="Total Events"
        valueText={formatNumber(results.chargingEvents.year, 0)}
      />
    </div>
  );
};

export default KeyMetrics;
