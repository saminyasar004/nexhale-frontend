import { motion } from "framer-motion";
import { Trophy, AlertCircle, User } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  value: number;
  unit: string;
  hasSubmittedToday: boolean;
}

interface LeaderboardCardProps {
  title: string;
  users: LeaderboardUser[];
  type: "tar" | "nicotine";
}

// Current user ID for highlighting
const currentUserId = "USR-0042";

const LeaderboardCard = ({ title, users, type }: LeaderboardCardProps) => {
  const getMedalEmoji = (rank: number, hasSubmitted: boolean) => {
    if (!hasSubmitted) return null;
    switch (rank) {
      case 1:
        return <span className="text-2xl medal-gold">🥇</span>;
      case 2:
        return <span className="text-2xl medal-silver">🥈</span>;
      case 3:
        return <span className="text-2xl medal-bronze">🥉</span>;
      default:
        return (
          <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const isCurrentUser = (userName: string) => userName === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">Daily Rankings</p>
        </div>
      </div>

      <div className="space-y-3">
        {users.map((user, index) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
              user.rank <= 3 && user.hasSubmittedToday ? "bg-muted/50" : "hover:bg-muted/30"
            } ${!user.hasSubmittedToday ? "opacity-70" : ""} ${
              isCurrentUser(user.name) ? "ring-2 ring-primary ring-offset-2 ring-offset-background animate-neon-pulse" : ""
            }`}
          >
            {user.hasSubmittedToday ? (
              getMedalEmoji(user.rank, user.hasSubmittedToday)
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <p className={`font-mono text-sm font-medium truncate ${
                  isCurrentUser(user.name) ? "text-primary" : "text-foreground"
                }`}>
                  {user.name}
                  {isCurrentUser(user.name) && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </p>
              </div>
              {!user.hasSubmittedToday && (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <AlertCircle className="w-3 h-3" />
                  No input submitted today, rank unavailable
                </div>
              )}
            </div>
            <div className="text-right">
              {user.hasSubmittedToday ? (
                <>
                  <p className="font-display font-bold text-foreground">
                    {user.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.unit}</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">No data</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LeaderboardCard;
