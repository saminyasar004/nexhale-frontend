import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface QuitPlanAlertProps {
  consumedNicotine: number;
  nicotineLimit: number;
  daysRemaining: number;
}

const QuitPlanAlert = ({
  consumedNicotine,
  nicotineLimit,
  daysRemaining,
}: QuitPlanAlertProps) => {
  const percentUsed = Math.round((consumedNicotine / nicotineLimit) * 100);
  const remainingNicotine = Math.max(0, nicotineLimit - consumedNicotine);
  const isOverLimit = consumedNicotine > nicotineLimit;

  // Only show if consumption is above 50% of limit
  if (percentUsed <= 50) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative overflow-hidden rounded-2xl border p-6 ${
        isOverLimit 
          ? "bg-gradient-to-r from-destructive/20 to-destructive/10 border-destructive/30" 
          : "bg-gradient-to-r from-warning/20 to-primary/10 border-warning/30"
      }`}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

      <div className="relative flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isOverLimit ? "bg-destructive/20" : "bg-warning/20"
        }`}>
          <Target className={`w-6 h-6 ${isOverLimit ? "text-destructive" : "text-warning"}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-lg text-foreground mb-2">
            {isOverLimit ? "⚠️ Goal Exceeded" : "Quit Plan Tracker"}
          </h3>
          
          {/* Consumption Status Text */}
          <p className="text-foreground/90 font-medium mb-1">
            You have consumed{" "}
            <span className={isOverLimit ? "text-destructive" : "text-warning"}>
              {consumedNicotine} mg
            </span>{" "}
            out of{" "}
            <span className="text-primary">{nicotineLimit} mg</span>
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 mb-3">
            <div className="h-3 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full relative ${
                  isOverLimit
                    ? "bg-destructive"
                    : percentUsed > 80
                    ? "bg-warning"
                    : "bg-primary"
                }`}
              >
                {/* Overflow indicator */}
                {isOverLimit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-destructive"
                  />
                )}
              </motion.div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0 mg</span>
              <span className="font-semibold">{percentUsed}%</span>
              <span>{nicotineLimit} mg</span>
            </div>
          </div>

          {/* Remaining Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
            <p className="text-foreground/80">
              {isOverLimit ? (
                <>
                  Exceeded by{" "}
                  <span className="font-bold text-destructive">
                    {consumedNicotine - nicotineLimit} mg
                  </span>
                </>
              ) : (
                <>
                  You can still consume{" "}
                  <span className="font-bold text-success">{remainingNicotine} mg</span>
                </>
              )}
            </p>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <p className="text-muted-foreground">
              Remaining days this month:{" "}
              <span className="font-bold text-foreground">{daysRemaining} days</span>
            </p>
          </div>

          {/* Awareness Note */}
          <p className="text-xs text-muted-foreground mt-4 p-2 bg-background/30 rounded-lg">
            💡 This is for awareness and tracking only. You can still log your consumption.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QuitPlanAlert;
