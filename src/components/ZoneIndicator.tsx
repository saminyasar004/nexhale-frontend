import { motion } from "framer-motion";
import { Shield, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

interface ZoneIndicatorProps {
  zone: "green" | "yellow" | "orange" | "red";
  cigarettesToday: number;
  tarToday: number;
}

const ZoneIndicator = ({ zone, cigarettesToday, tarToday }: ZoneIndicatorProps) => {
  const zoneConfig = {
    green: {
      label: "Safe Zone",
      icon: <CheckCircle2 className="w-5 h-5" />,
      description: "Great job! Keep up the good work.",
      className: "zone-green",
      bgClass: "bg-zone-green/10",
    },
    yellow: {
      label: "Caution Zone",
      icon: <Shield className="w-5 h-5" />,
      description: "You're approaching your limit.",
      className: "zone-yellow",
      bgClass: "bg-zone-yellow/10",
    },
    orange: {
      label: "Warning Zone",
      icon: <AlertTriangle className="w-5 h-5" />,
      description: "Consider slowing down today.",
      className: "zone-orange",
      bgClass: "bg-zone-orange/10",
    },
    red: {
      label: "Danger Zone",
      icon: <AlertCircle className="w-5 h-5" />,
      description: "You've exceeded your daily goal.",
      className: "zone-red",
      bgClass: "bg-zone-red/10",
    },
  };

  const config = zoneConfig[zone];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-card rounded-2xl p-6 ${config.bgClass}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Daily Zone Status
        </h3>
        <div className={`zone-indicator ${config.className}`}>
          {config.icon}
          {config.label}
        </div>
      </div>

      <p className="text-muted-foreground mb-4">{config.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-background/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Cigarettes Today</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {cigarettesToday}
          </p>
        </div>
        <div className="bg-background/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-1">TAR Today</p>
          <p className="text-2xl font-display font-bold text-foreground">
            {tarToday} <span className="text-sm text-muted-foreground">mg</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ZoneIndicator;
