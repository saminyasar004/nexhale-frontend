import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Target,
	Activity,
	TrendingDown,
	Heart,
	Shield,
	RefreshCcw,
	Brain,
	Clock,
	Smile,
	AlertCircle,
	ChevronRight,
	Zap,
} from "lucide-react";
import { api, AIQuitPlan, AIQuitPlanStats } from "@/lib/api";
import StatCard from "./StatCard";
import ZoneIndicator from "./ZoneIndicator";

interface AIQuitPlanViewProps {
	planData: { plan: AIQuitPlan; stats: AIQuitPlanStats };
	onRefresh: () => void;
}

const AIQuitPlanView = ({ planData, onRefresh }: AIQuitPlanViewProps) => {
	const { plan, stats } = planData;
	const [recommendations, setRecommendations] = useState<any>(null);
	const [brandSwitch, setBrandSwitch] = useState<any>(null);
	const [isLoadingRecs, setIsLoadingRecs] = useState(false);

	useEffect(() => {
		fetchRecommendations();
	}, []);

	const fetchRecommendations = async (mood?: string) => {
		setIsLoadingRecs(true);
		try {
			const recs = await api.aiQuitPlan.getRecommendations(mood);
			setRecommendations(recs);
		} catch (err) {
			console.error("Error fetching recommendations:", err);
		} finally {
			setIsLoadingRecs(false);
		}
	};

	const handleSimulateSwitch = async () => {
		try {
			const sim = await api.aiQuitPlan.simulateSwitch();
			setBrandSwitch(sim);
		} catch (err) {
			console.error("Error simulating switch:", err);
		}
	};

	return (
		<div className="space-y-6">
			{/* AI Header */}
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
						<Brain className="w-6 h-6 text-primary" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-foreground">
							AI Quit Companion
						</h2>
						<p className="text-sm text-muted-foreground">
							Personalized reduction path
						</p>
					</div>
				</div>
				<button
					onClick={onRefresh}
					className="p-2 hover:bg-muted rounded-full transition-colors"
				>
					<RefreshCcw className="w-5 h-5 text-muted-foreground" />
				</button>
			</div>

			{/* Main Stats */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<StatCard
					title="Daily Nicotine Allowed"
					value={Number(
						plan.daily_nicotine_allowance_mg || 0,
					).toFixed(1)}
					unit="mg"
					icon={<Zap className="w-6 h-6" />}
					color="primary"
				/>
				<StatCard
					title="Monthly Goal"
					value={plan.target_nicotine_amount.toString()}
					unit="mg"
					icon={<Target className="w-6 h-6" />}
					color="success"
				/>
				<StatCard
					title="Progress"
					value={Number(stats.progressPercent || 0).toFixed(0)}
					unit="%"
					icon={<Activity className="w-6 h-6" />}
					color={
						stats.statusZone === "Green"
							? "success"
							: stats.statusZone === "Yellow"
								? "warning"
								: "destructive"
					}
				/>
			</div>

			{/* Nicotine Progress Bar (mg based) */}
			<div className="glass-card rounded-2xl p-6 relative overflow-hidden">
				<div className="flex justify-between items-center mb-4">
					<h3 className="font-semibold text-foreground">
						Monthly Nicotine Intake
					</h3>
					<span className="text-sm font-medium">
						{Number(stats.currentMonthlyIntake || 0).toFixed(1)} /{" "}
						{plan.target_nicotine_amount} mg
					</span>
				</div>
				<div className="h-6 w-full bg-muted/30 rounded-full overflow-hidden p-1">
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${stats.progressPercent}%` }}
						className={`h-full rounded-full transition-all duration-500 ${
							stats.statusZone === "Green"
								? "bg-success"
								: stats.statusZone === "Yellow"
									? "bg-warning"
									: "bg-destructive"
						}`}
					/>
				</div>
				<div className="mt-3 flex justify-between text-xs text-muted-foreground">
					<span>
						Targeting {plan.target_timeline_months} months reduction
					</span>
					<span>
						{Number(stats.totalNicotineAvoided || 0).toFixed(1)} mg
						avoided so far 🎉
					</span>
				</div>
			</div>

			{/* AI Recommendations Section */}
			<div className="grid md:grid-cols-2 gap-6">
				<div className="glass-card rounded-2xl p-6 space-y-4">
					<div className="flex items-center gap-3 mb-2">
						<Clock className="w-5 h-5 text-primary" />
						<h3 className="font-semibold text-foreground">
							Time-Based Distribution
						</h3>
					</div>
					<p className="text-sm text-muted-foreground italic">
						"
						{recommendations?.ai_insight ||
							"Analyze your patterns for better recovery."}
						"
					</p>
					<div className="space-y-3">
						{recommendations?.interventions?.map(
							(item: any, i: number) => (
								<div
									key={i}
									className="flex gap-3 p-3 bg-muted/30 rounded-lg border border-border/50"
								>
									<div className="mt-1">
										{item.type === "mental" ? (
											<Brain className="w-4 h-4 text-blue-500" />
										) : (
											<Activity className="w-4 h-4 text-green-500" />
										)}
									</div>
									<div>
										<p className="text-sm font-medium">
											{item.title}
										</p>
										<p className="text-xs text-muted-foreground">
											{item.description}
										</p>
									</div>
								</div>
							),
						)}
					</div>
				</div>

				<div className="glass-card rounded-2xl p-6 space-y-4">
					<div className="flex items-center gap-3 mb-2">
						<TrendingDown className="w-5 h-5 text-success" />
						<h3 className="font-semibold text-foreground">
							Smart Brand Adjustment
						</h3>
					</div>
					{!brandSwitch ? (
						<div className="text-center py-6">
							<p className="text-sm text-muted-foreground mb-4">
								Simulate switching to lower nicotine brands for
								easier transitions.
							</p>
							<button
								onClick={handleSimulateSwitch}
								className="btn-secondary w-full"
							>
								Analyze Alternatives
							</button>
						</div>
					) : (
						<div className="space-y-3">
							{brandSwitch.suggestions.map(
								(s: any, i: number) => (
									<div
										key={i}
										className="flex justify-between items-center p-3 bg-success/5 border border-success/10 rounded-lg"
									>
										<div>
											<p className="text-sm font-bold text-foreground">
												{s.brand_name}
											</p>
											<p className="text-xs text-muted-foreground">
												{s.nicotine_per_stick} mg •{" "}
												{s.allowed_sticks_per_month}{" "}
												sticks/mo
											</p>
										</div>
										<ChevronRight className="w-4 h-4 text-success" />
									</div>
								),
							)}
							<p className="text-xs text-muted-foreground italic mt-2">
								{brandSwitch.analysis}
							</p>
							<button
								onClick={() => setBrandSwitch(null)}
								className="text-xs text-primary underline"
							>
								Back to dashboard
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Health Impact Indicators */}
			<div className="glass-card rounded-2xl p-6">
				<div className="flex items-center gap-3 mb-6">
					<Shield className="w-5 h-5 text-success" />
					<h3 className="font-semibold text-foreground">
						Your Recovery Journey
					</h3>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<div className="p-4 bg-muted/20 rounded-xl text-center space-y-2">
						<Heart className="w-6 h-6 text-red-500 mx-auto" />
						<p className="text-xs font-medium">BP Control</p>
						<p className="text-[10px] text-muted-foreground">
							Improving...
						</p>
					</div>
					<div className="p-4 bg-muted/20 rounded-xl text-center space-y-2">
						<Activity className="w-6 h-6 text-blue-500 mx-auto" />
						<p className="text-xs font-medium">Oxygen Level</p>
						<p className="text-[10px] text-muted-foreground">
							Stabilizing
						</p>
					</div>
					<div className="p-4 bg-muted/20 rounded-xl text-center space-y-2">
						<Smile className="w-6 h-6 text-yellow-500 mx-auto" />
						<p className="text-xs font-medium">Mood Stability</p>
						<p className="text-[10px] text-muted-foreground">
							Adaptive
						</p>
					</div>
					<div className="p-4 bg-muted/20 rounded-xl text-center space-y-2">
						<Shield className="w-6 h-6 text-green-500 mx-auto" />
						<p className="text-xs font-medium">Lung Health</p>
						<p className="text-[10px] text-muted-foreground">
							Clearing
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIQuitPlanView;
