import type { SimulationResults } from "../types";
import ChargepointValues from "./ChargePointSummary";
import ChargingEventsChart from "./EventSummaryChart";
import ExemplaryDayChart from "./ExemplaryDataChart";
import KeyMetrics from "./KeyMetrics";

const ResultsDashboard = ({
  results,
  simulating,
}: {
  results: SimulationResults;
  simulating: boolean;
}) => {
  return (
    <div className="space-y-6">
      <KeyMetrics results={results} simulating={simulating} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="">
          <ExemplaryDayChart
            data={results.exemplaryDay}
            simulating={simulating}
          />
        </div>
        <div>
          <ChargingEventsChart
            data={results.chargingEvents}
            simulating={simulating}
          />
        </div>
      </div>

      <ChargepointValues
        data={results.chargepointPower}
        simulating={simulating}
      />
    </div>
  );
};

export default ResultsDashboard;
