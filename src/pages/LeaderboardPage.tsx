import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Trophy,
	Medal,
	Activity,
	Flame,
	AlertCircle,
	User,
} from "lucide-react";
import { api } from "@/lib/api";

interface LeaderboardPageProps {
	onBack: () => void;
}

const LeaderboardPage = ({ onBack }: LeaderboardPageProps) => {
	const [activeTab, setActiveTab] = useState<"tar" | "nicotine">("tar");
	const [leaderboard, setLeaderboard] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const data = await api.get(
					`/leaderboard?type=${activeTab}&period=daily`,
				);
				setLeaderboard(data);
			} catch (err: any) {
				console.error("Error fetching leaderboard:", err);
				setError(err.message || "Failed to load leaderboard.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [activeTab]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.reload();
	};

	return (
		<div className="min-h-screen bg-background font-sans">
			<header className="sticky top-0 z-50 glass-card border-b border-border/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between h-16">
						<button
							onClick={onBack}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							← Back
						</button>
						<h1 className="font-display font-bold text-lg text-primary">
							Daily Leaderboard
						</h1>
						<div className="w-12" />
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
				<div className="flex gap-2 p-1 bg-muted rounded-xl">
					<button
						onClick={() => setActiveTab("tar")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
							activeTab === "tar"
								? "bg-card text-foreground shadow-sm"
								: "text-muted-foreground"
						}`}
					>
						<Activity className="w-5 h-5" />
						Lowest TAR
					</button>
					<button
						onClick={() => setActiveTab("nicotine")}
						className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
							activeTab === "nicotine"
								? "bg-card text-foreground shadow-sm"
								: "text-muted-foreground"
						}`}
					>
						<Flame className="w-5 h-5" />
						Lowest Nicotine
					</button>
				</div>

				{isLoading ? (
					<div className="text-center p-12 font-display text-primary animate-pulse">
						Loading ranks...
					</div>
				) : error ? (
					<div className="glass-card rounded-2xl p-8 text-center space-y-4">
						<AlertCircle className="w-12 h-12 text-destructive mx-auto" />
						<h3 className="font-bold text-foreground">
							Connection Error
						</h3>
						<p className="text-sm text-muted-foreground">{error}</p>
						<div className="flex flex-col gap-2">
							<button
								onClick={() => window.location.reload()}
								className="btn-primary"
							>
								Retry
							</button>
							<button
								onClick={handleLogout}
								className="text-sm text-muted-foreground hover:underline"
							>
								Login Again
							</button>
						</div>
					</div>
				) : (
					<div className="glass-card rounded-2xl overflow-hidden divide-y divide-border/50">
						{leaderboard.length > 0 ? (
							leaderboard.map((u, index) => {
								const userVal = localStorage.getItem("user");
								const currentUser = userVal
									? JSON.parse(userVal)
									: null;
								const currentUserId = currentUser
									? currentUser.id || currentUser.user_id
									: null;
								const isCurrentUser =
									currentUserId &&
									String(u.id) === String(currentUserId);

								return (
									<div
										key={u.id || index}
										className={`flex items-center gap-4 p-4 transition-colors ${
											isCurrentUser
												? "bg-primary/10 border-l-4 border-primary"
												: "hover:bg-muted/30"
										}`}
									>
										<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
											{u.medal === "gold"
												? "🥇"
												: u.medal === "silver"
													? "🥈"
													: u.medal === "bronze"
														? "🥉"
														: u.rank || index + 1}
										</div>
										<div className="flex-1">
											<p className="font-medium text-foreground">
												{u.name || "Anonymous"}
											</p>
											{isCurrentUser && (
												<span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
													You
												</span>
											)}
										</div>
										<div className="text-right">
											<p className="font-bold text-foreground">
												{parseFloat(
													u.value || 0,
												).toFixed(1)}
												mg
											</p>
											<p className="text-[10px] text-muted-foreground uppercase">
												{activeTab}
											</p>
										</div>
									</div>
								);
							})
						) : (
							<div className="p-12 text-center text-muted-foreground italic">
								No rankings available for today yet.
							</div>
						)}
					</div>
				)}
			</main>
		</div>
	);
};

export default LeaderboardPage;
