import { motion } from "framer-motion";
import { Cigarette, Wind, Target, BarChart3, Trophy, User, Gift } from "lucide-react";

interface BottomNavProps {
  activeTab: "smoking" | "vape";
  onTabChange: (tab: "smoking" | "vape") => void;
  onNavigate: (page: string) => void;
}

const BottomNav = ({ activeTab, onTabChange, onNavigate }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-card border-t border-border/50">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => onTabChange("smoking")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === "smoking" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Cigarette className="w-5 h-5" />
            <span className="text-xs font-medium">Smoking</span>
            {activeTab === "smoking" && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </button>

          <button
            onClick={() => onTabChange("vape")}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              activeTab === "vape" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Wind className="w-5 h-5" />
            <span className="text-xs font-medium">Vape</span>
            {activeTab === "vape" && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </button>

          <button
            onClick={() => onNavigate("quit-plan")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Target className="w-5 h-5" />
            <span className="text-xs font-medium">Plan</span>
          </button>

          <button
            onClick={() => onNavigate("results")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-medium">Results</span>
          </button>

          <button
            onClick={() => onNavigate("leaderboard")}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs font-medium">Ranks</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
