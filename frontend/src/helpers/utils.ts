const formatNumber = (num: number, decimals: number = 0) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const getPillColor = (factor: number) => {
  if (factor < 30) return "text-red-600 bg-red-100";
  if (factor < 50) return "text-yellow-600 bg-yellow-100";
  return "text-green-600 bg-green-100";
};

export { formatNumber, getPillColor };
