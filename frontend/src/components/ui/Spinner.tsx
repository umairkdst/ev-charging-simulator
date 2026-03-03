const Spinner = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <div
      className="flex items-center justify-center gap-3"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
};

export default Spinner;
