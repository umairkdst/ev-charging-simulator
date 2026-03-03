import LightningIcon from "../assets/LightningIcon";

interface HeaderProps {
  simulating: boolean;
  hasInputError: boolean;
  onSimulate: () => void | Promise<void>;
}

const Header = ({ simulating, hasInputError, onSimulate }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <LightningIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="md:text-2xl font-bold text-gray-900">Reonic</h1>
              <p className="text-sm text-gray-600">EV Charging Simulation</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  !simulating && !hasInputError && "bg-green-500"
                } ${hasInputError && "bg-red-500"}`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {hasInputError ? "Input Error" : !simulating ? "Ready" : ""}
              </span>
            </div>

            {hasInputError ? (
              <button
                disabled
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed bg-red-500 text-white`}
              >
                Fix Inputs
              </button>
            ) : (
              <button
                onClick={onSimulate}
                disabled={simulating}
                className={`px-4 py-1.5 rounded-md text-sm font-medium text-white transition-colors duration-200 ${
                  simulating
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {simulating ? "Running..." : "Simulate"}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
