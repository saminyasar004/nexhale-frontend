import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: React.ReactNode;
  color?: "primary" | "warning" | "destructive" | "success";
}

const StatCard = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = "primary",
}: StatCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    success: "bg-success/10 text-success",
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />,
  };

  const trendColors = {
    up: "text-destructive",
    down: "text-success",
    neutral: "text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
            {trendIcons[trend]}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-3xl font-display font-bold text-foreground">
        {value}
        {unit && (
          <span className="text-lg text-muted-foreground ml-1">{unit}</span>
        )}
      </p>
    </motion.div>
  );
};

export default StatCard;
