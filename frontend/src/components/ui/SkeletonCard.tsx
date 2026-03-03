interface Props {
  className?: string;
}

const SkeletonCard = ({ className = "" }: Props) => {
  return (
    <div className={`card min-h-[102px] ${className}`}>
      <div className="flex items-center animate-pulse">
        <div className="rounded-lg bg-gray-200">
          <div className="w-8 h-8 bg-gray-300 rounded" />
        </div>

        <div className="ml-4 flex-1">
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
