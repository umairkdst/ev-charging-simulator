/*
  Generic KeyMetricCard component for displaying key metrics with an icon and value or children.
 */
import type { ReactNode } from "react";

interface KeyMetricCardProps {
  icon: ReactNode;
  iconBgClass?: string;
  title: string;
  valueText?: string;
  valueNode?: ReactNode;
  className?: string;
}

const KeyMetricCard = ({
  icon,
  iconBgClass = "p-2 bg-gray-100 rounded-lg",
  title,
  valueText,
  valueNode,
  className = "",
}: KeyMetricCardProps) => {
  return (
    <div className={`card min-h-[96px] ${className}`}>
      <div className="flex items-center">
        <div className={iconBgClass}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {valueNode ? (
            valueNode
          ) : (
            <p className="text-2xl font-bold text-gray-900">{valueText}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyMetricCard;
