import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Target,
	Cigarette,
	Wind,
	TrendingDown,
	Calendar,
	Check,
	AlertTriangle,
	Lock,
} from "lucide-react";
import { api } from "@/lib/api";

interface QuitPlanPageProps {
	onBack: () => void;
}

interface WeekProgress {
	week: string;
	used: number;
	limit: number;
	color: string;
	bgColor: string;
	icon: string;
}

const QuitPlanPage = ({ onBack }: QuitPlanPageProps) => {
	const [nicotineLimit, setNicotineLimit] = useState(500);
	const [saved, setSaved] = useState(false);
	const [currentNicotine, setCurrentNicotine] = useState(0);
	const [weeklyProgress, setWeeklyProgress] = useState<WeekProgress[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await api.get("/quit-plan");
				setNicotineLimit(data.plan?.nicotine_limit || 500);
				setCurrentNicotine(data.totalConsumed || 0);

				if (data.weeklyProgress) {
					const mapped = data.weeklyProgress.map(
						(w: any, i: number) => ({
							week: `Week ${w.week_num}`,
							used: parseFloat(w.week_total),
							limit: (data.plan?.nicotine_limit || 500) / 4,
							color: i % 2 === 0 ? "bg-blue-500" : "bg-pink-500",
							bgColor:
								i % 2 === 0
									? "bg-blue-500/20"
									: "bg-pink-500/20",
							icon: (i + 1).toString(),
						}),
					);
					setWeeklyProgress(mapped);
				}
			} catch (err) {
				console.error("Error fetching quit plan:", err);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleSave = async () => {
		try {
			await api.post("/quit-plan", { nicotineLimit });
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch (err) {
			console.error("Error saving quit plan:", err);
		}
	};

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading Quit Plan...
			</div>
		);

	const currentMonthDays = new Date(
		new Date().getFullYear(),
		new Date().getMonth() + 1,
		0,
	).getDate();
	const daysRemaining = currentMonthDays - new Date().getDate();
	const percentUsed = Math.round((currentNicotine / nicotineLimit) * 100);
	const limitReached = percentUsed >= 100;

	const SegmentedProgressBar = ({ progress }: { progress: WeekProgress }) => {
		const percentage = Math.min(
			(progress.used / progress.limit) * 100,
			100,
		);
		const totalSegments = 20;
		const filledSegments = Math.round((percentage / 100) * totalSegments);

		return (
			<div className="flex items-center gap-4 p-4 glass-card rounded-xl">
				<div
					className={`w-10 h-10 rounded-full ${progress.bgColor} flex items-center justify-center flex-shrink-0`}
				>
					<span
						className={`font-bold text-sm ${progress.color.replace("bg-", "text-")}`}
					>
						{progress.icon}
					</span>
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-foreground">
							{progress.week}
						</span>
						<span className="text-xs text-muted-foreground">
							{progress.used.toFixed(1)}mg /{" "}
							{progress.limit.toFixed(1)}mg
						</span>
					</div>
					<div className="flex gap-0.5 h-3 rounded-full overflow-hidden bg-muted/30 p-0.5">
						{Array.from({ length: totalSegments }).map(
							(_, index) => (
								<div
									key={index}
									className={`flex-1 rounded-sm transition-all duration-300 ${
										index < filledSegments
											? progress.color
											: "bg-muted/50"
									}`}
								/>
							),
						)}
					</div>
				</div>
				<div className="text-right min-w-[50px]">
					<span
						className={`font-bold text-sm ${progress.color.replace("bg-", "text-")}`}
					>
						{Math.round(percentage)}%
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-50 glass-card border-b border-border/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between h-16">
						<button
							onClick={onBack}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							← Back
						</button>
						<h1 className="font-display font-bold text-lg gradient-text">
							Quit Plan
						</h1>
						<div className="w-12" />
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
				{limitReached && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="alert-accent rounded-2xl p-6"
					>
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
								<AlertTriangle className="w-6 h-6 text-accent animate-pulse" />
							</div>
							<div>
								<h3 className="font-display font-bold text-lg text-foreground mb-2">
									⚠️ Monthly Limit Reached!
								</h3>
								<p className="text-foreground/80">
									You have reached your monthly nicotine limit
									of <strong>{nicotineLimit}mg</strong>. Input
									fields are now disabled until next month.
								</p>
								<div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
									<Lock className="w-4 h-4" />
									<span>
										Inputs locked • {daysRemaining} days
										until reset
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				)}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="glass-card rounded-2xl p-6"
				>
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
							<TrendingDown className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h2 className="font-display font-semibold text-foreground">
								Weekly Progress
							</h2>
							<p className="text-sm text-muted-foreground">
								Track your nicotine consumption by week
							</p>
						</div>
					</div>

					<div className="space-y-3">
						{weeklyProgress.map((week) => (
							<SegmentedProgressBar
								key={week.week}
								progress={week}
							/>
						))}
					</div>

					<div className="mt-6 pt-6 border-t border-border/50">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-medium text-foreground">
								Monthly Total
							</span>
							<span
								className={`font-bold ${limitReached ? "text-destructive" : percentUsed > 80 ? "text-warning" : "text-success"}`}
							>
								{currentNicotine.toFixed(1)}mg / {nicotineLimit}
								mg ({percentUsed}%)
							</span>
						</div>
						<div className="flex gap-0.5 h-4 rounded-full overflow-hidden bg-muted/30 p-0.5">
							{Array.from({ length: 25 }).map((_, index) => (
								<div
									key={index}
									className={`flex-1 rounded-sm transition-all duration-300 ${
										index <
										Math.round((percentUsed / 100) * 25)
											? limitReached
												? "bg-destructive"
												: percentUsed > 80
													? "bg-warning"
													: "bg-primary"
											: "bg-muted/50"
									}`}
								/>
							))}
						</div>
						<div className="flex justify-between mt-2 text-xs text-muted-foreground">
							<span>0%</span>
							<span>50%</span>
							<span>100%</span>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.05 }}
					className="glass-card rounded-2xl p-6"
				>
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
							<Calendar className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h2 className="font-display font-semibold text-foreground">
								Days Remaining
							</h2>
							<p className="text-sm text-muted-foreground">
								{daysRemaining} days left in this month
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="p-4 bg-muted/50 rounded-xl text-center">
							<p className="text-3xl font-bold text-foreground">
								{daysRemaining}
							</p>
							<p className="text-sm text-muted-foreground">
								Days Left
							</p>
						</div>
						<div className="p-4 bg-muted/50 rounded-xl text-center">
							<p
								className={`text-3xl font-bold ${limitReached ? "text-destructive" : "text-success"}`}
							>
								{limitReached
									? 0
									: (nicotineLimit - currentNicotine).toFixed(
											1,
										)}
								mg
							</p>
							<p className="text-sm text-muted-foreground">
								Remaining Allowance
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="glass-card rounded-2xl p-6"
				>
					<div className="flex items-center gap-3 mb-6">
						<div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
							<Target className="w-6 h-6 text-success" />
						</div>
						<div>
							<h2 className="font-display font-semibold text-foreground">
								Set Monthly Nicotine Limit
							</h2>
							<p className="text-sm text-muted-foreground">
								This applies to both smoking and vaping
							</p>
						</div>
					</div>

					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Maximum Nicotine Intake (mg/month)
							</label>
							<input
								type="number"
								min="50"
								max="2000"
								step="10"
								value={nicotineLimit}
								onChange={(e) =>
									setNicotineLimit(
										parseInt(e.target.value) || 500,
									)
								}
								className="input-field text-center text-2xl font-bold"
							/>
						</div>

						<div className="grid grid-cols-4 gap-2">
							{[200, 350, 500, 750].map((preset) => (
								<button
									key={preset}
									onClick={() => setNicotineLimit(preset)}
									className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
										nicotineLimit === preset
											? "bg-primary text-primary-foreground"
											: "bg-muted text-muted-foreground hover:bg-muted/80"
									}`}
								>
									{preset}mg
								</button>
							))}
						</div>

						<button
							onClick={handleSave}
							className="btn-primary w-full flex items-center justify-center gap-2"
						>
							{saved ? (
								<>
									<Check className="w-5 h-5" />
									Saved!
								</>
							) : (
								"Save Quit Plan"
							)}
						</button>
					</div>
				</motion.div>
			</main>
		</div>
	);
};

export default QuitPlanPage;
