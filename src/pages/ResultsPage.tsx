import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
	Calendar,
	TrendingUp,
	DollarSign,
	Activity,
	Flame,
	Wind,
	Smile,
	AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";

interface ResultsPageProps {
	onBack: () => void;
}

const ResultsPage = ({ onBack }: ResultsPageProps) => {
	const last12Months = useMemo(() => {
		const result = [];
		const date = new Date();
		for (let i = 0; i < 12; i++) {
			const m = date.getMonth();
			const y = date.getFullYear();
			result.push({
				label: `${new Intl.DateTimeFormat("en-US", { month: "long" }).format(date)} ${y}`,
				month: m + 1,
				year: y,
			});
			date.setMonth(date.getMonth() - 1);
		}
		return result;
	}, []);

	const [selectedOption, setSelectedOption] = useState(last12Months[0]);
	const [summary, setSummary] = useState<any>(null);
	const [weeklyData, setWeeklyData] = useState<any[]>([]);
	const [moodData, setMoodData] = useState<any[]>([]);
	const [healthImpact, setHealthImpact] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const [sum, weekly, moods, health] = await Promise.all([
					api.get(
						`/stats/summary?month=${selectedOption.month}&year=${selectedOption.year}`,
					),
					api.get(
						`/stats/weekly?month=${selectedOption.month}&year=${selectedOption.year}`,
					),
					api.get(`/stats/moods`),
					api.get(`/stats/health`),
				]);
				setSummary(sum);
				setWeeklyData(weekly);
				setHealthImpact(health);

				if (moods && moods.length > 0) {
					const total = moods.reduce(
						(s: number, m: any) => s + m.count,
						0,
					);
					const processed = moods.map((m: any, i: number) => ({
						name: m.mood,
						value:
							total > 0 ? Math.round((m.count / total) * 100) : 0,
						color: `hsl(${i * 45}, 70%, 50%)`,
					}));
					setMoodData(processed);
				} else {
					setMoodData([]);
				}
			} catch (err: any) {
				console.error("Error fetching results:", err);
				setError(err.message || "Failed to load statistics.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [selectedOption]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.reload();
	};

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center font-display text-primary">
				Loading Results...
			</div>
		);

	if (error || !summary) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
				<div className="glass-card rounded-2xl p-8 max-w-md w-full space-y-6">
					<AlertCircle className="w-12 h-12 text-destructive mx-auto" />
					<h2 className="text-xl font-bold">Data Unreachable</h2>
					<p className="text-muted-foreground">
						{error || "Your statistics session has expired."}
					</p>
					<button
						onClick={handleLogout}
						className="btn-primary w-full"
					>
						Re-login
					</button>
					<button
						onClick={onBack}
						className="text-sm hover:underline"
					>
						Return Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background font-sans pb-10">
			<header className="sticky top-0 z-50 glass-card border-b border-border/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between h-16">
						<button
							onClick={onBack}
							className="text-muted-foreground"
						>
							← Back
						</button>
						<h1 className="font-display font-bold text-lg text-primary">
							Monthly Results
						</h1>
						<div className="w-12" />
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
				{/* Month Selector */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="glass-card rounded-2xl p-4 flex items-center gap-3"
				>
					<Calendar className="w-5 h-5 text-primary" />
					<select
						value={selectedOption.label}
						onChange={(e) => {
							const selected = last12Months.find(
								(m) => m.label === e.target.value,
							);
							if (selected) setSelectedOption(selected);
						}}
						className="input-field flex-1"
					>
						{last12Months.map((m) => (
							<option key={m.label} value={m.label}>
								{m.label}
							</option>
						))}
					</select>
				</motion.div>

				{/* Daily Health Zone */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className={`glass-card rounded-2xl p-6 border-2 flex items-center justify-between ${summary.dailyZone === "Red"
							? "border-destructive/30 bg-destructive/5"
							: summary.dailyZone === "Yellow"
								? "border-warning/30 bg-warning/5"
								: "border-primary/30 bg-primary/5"
						}`}
				>
					<div className="flex items-center gap-4">
						<div
							className={`w-12 h-12 rounded-full flex items-center justify-center ${summary.dailyZone === "Red"
									? "bg-destructive/20 text-destructive"
									: summary.dailyZone === "Yellow"
										? "bg-warning/20 text-warning"
										: "bg-primary/20 text-primary"
								}`}
						>
							<Activity className="w-6 h-6" />
						</div>
						<div>
							<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
								Daily Health Status
							</h3>
							<p
								className={`text-2xl font-bold ${summary.dailyZone === "Red"
										? "text-destructive"
										: summary.dailyZone === "Yellow"
											? "text-warning"
											: "text-primary"
									}`}
							>
								{summary.dailyZone} Zone
							</p>
						</div>
					</div>
					<div className="text-right hidden sm:block">
						<p className="text-[10px] text-muted-foreground italic">
							Based on today's exposure
						</p>
						<p className="text-xs font-medium">Worst-case analysis</p>
					</div>
				</motion.div>

				{/* Summary Stats */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<SummaryItem
						icon={<Flame className="text-primary" />}
						label="Nicotine"
						value={`${parseFloat(summary.totalNicotine).toFixed(1)}mg`}
					/>
					<SummaryItem
						icon={<Activity className="text-destructive" />}
						label="Tar / CEI"
						value={`${parseFloat(summary.totalChemical).toFixed(1)}mg`}
					/>
					<SummaryItem
						icon={<Wind className="text-accent" />}
						label="Vape CEI"
						value={`${parseFloat(summary.totalVapeCEI).toFixed(1)}`}
					/>
					<SummaryItem
						icon={<DollarSign className="text-warning" />}
						label="Cost"
						value={`৳${parseFloat(summary.totalCost).toLocaleString()}`}
					/>
				</div>

				{/* Charts Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Nicotine Chart */}
					<ChartCard
						title="Nicotine Trends (mg)"
						icon={<Flame className="w-5 h-5 text-primary" />}
						data={weeklyData}
						dataKey="nicotine"
						color="#8b5cf6"
					/>

					{/* TAR Chart */}
					<ChartCard
						title="TAR Trends (mg)"
						icon={<Activity className="w-5 h-5 text-destructive" />}
						data={weeklyData}
						dataKey="tar"
						color="#ef4444"
					/>

					{/* Chemical Chart */}
					<ChartCard
						title="Chemical Exposure (mg)"
						icon={<Wind className="w-5 h-5 text-accent" />}
						data={weeklyData}
						dataKey="chemical"
						color="#0ea5e9"
					/>

					{/* Mood Chart */}
					{moodData.length > 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="glass-card rounded-2xl p-6"
						>
							<h3 className="font-display font-semibold mb-6 flex items-center gap-2">
								<Smile className="w-5 h-5 text-primary" /> Mood
								Triggers
							</h3>
							<div className="flex flex-col items-center gap-8">
								<div className="h-40 w-40">
									<ResponsiveContainer>
										<PieChart>
											<Pie
												data={moodData}
												innerRadius={30}
												outerRadius={60}
												dataKey="value"
											>
												{moodData.map((d, i) => (
													<Cell
														key={i}
														fill={d.color}
													/>
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
								</div>
								<div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
									{moodData.map((m, i) => (
										<div
											key={i}
											className="flex items-center gap-2"
										>
											<div
												className="w-2 h-2 rounded-full"
												style={{
													backgroundColor: m.color,
												}}
											/>
											<span className="text-[10px] whitespace-nowrap">
												{m.name}: {m.value}%
											</span>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</div>

				{/* Health Impact Analysis - Detailed Report */}
				{healthImpact && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="glass-card rounded-3xl p-8 space-y-6"
					>
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
							<div>
								<h2 className="text-2xl font-display font-black text-primary flex items-center gap-2">
									<AlertCircle className="w-6 h-6" /> Health
									Impact Report
								</h2>
								<p className="text-muted-foreground text-sm">
									Comprehensive data analysis based on intake
								</p>
							</div>
							<div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-center">
								<p className="text-[10px] text-muted-foreground uppercase font-bold">
									Risk Tier
								</p>
								<p className="text-xl font-display font-bold text-primary italic">
									{healthImpact.riskTier}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{healthImpact.details.map((detail: any, i: number) => (
								<div key={i} className="space-y-2">
									<div className="flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-primary" />
										<h4 className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
											{detail.type} Analysis
										</h4>
									</div>
									<p className="text-sm leading-relaxed border-l-2 border-primary/20 pl-4 py-1 italic">
										"{detail.description}"
									</p>
								</div>
							))}
						</div>

						<div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
							<span className="text-xs text-muted-foreground">
								Projected Statistical Risk Score
							</span>
							<span className="text-xl font-black text-primary">
								{healthImpact.riskPercentage}%
							</span>
						</div>
					</motion.div>
				)}

				{/* Monthly Total Cost Display below charts */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="glass-card rounded-3xl p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 text-center"
				>
					<div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/20 mb-4">
						<DollarSign className="w-6 h-6 text-primary" />
					</div>
					<h3 className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
						Total Spending for {selectedOption.label}
					</h3>
					<p className="text-4xl font-display font-black text-primary">
						৳{parseFloat(summary.totalCost).toLocaleString()}
					</p>
				</motion.div>

				{/* Year to Date Cost Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="glass-card rounded-3xl p-8 border-accent/20 bg-accent/5"
				>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-xl font-display font-bold text-accent">
								Annual Financial Summary
							</h3>
							<p className="text-sm text-muted-foreground">
								Jan {selectedOption.year} —{" "}
								{selectedOption.label}
							</p>
						</div>
						<div className="p-3 rounded-2xl bg-accent/10">
							<TrendingUp className="w-6 h-6 text-accent" />
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex justify-between items-end">
							<span className="text-muted-foreground text-sm">
								Total year-to-date spending
							</span>
							<span className="text-2xl font-bold text-accent">
								৳{parseFloat(summary.ytdCost).toLocaleString()}
							</span>
						</div>
						<div className="h-4 w-full bg-accent/10 rounded-full overflow-hidden">
							<motion.div
								initial={{ width: 0 }}
								animate={{
									width: `${Math.min(100, (parseFloat(summary.ytdCost) / 50000) * 100)}%`,
								}}
								className="h-full bg-accent"
							/>
						</div>
						<p className="text-[10px] text-muted-foreground text-right italic">
							* ProgressBar relative to ৳50k annual limit
						</p>
					</div>
				</motion.div>
			</main>
		</div>
	);
};
const ChartCard = ({
	title,
	icon,
	data,
	dataKey,
	color,
}: {
	title: string;
	icon: any;
	data: any[];
	dataKey: string;
	color: string;
}) => (
	<motion.div
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		className="glass-card rounded-2xl p-6"
	>
		<h3 className="font-display font-semibold mb-6 flex items-center gap-2">
			{icon} {title}
		</h3>
		<div className="h-48">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={data}>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke="rgba(255,255,255,0.05)"
						vertical={false}
					/>
					<XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} />
					<YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
					<Tooltip
						contentStyle={{
							backgroundColor: "#0f172a",
							border: "1px solid #1e293b",
							borderRadius: "8px",
						}}
					/>
					<Bar
						dataKey={dataKey}
						name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)}
						fill={color}
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	</motion.div>
);

const SummaryItem = ({
	icon,
	label,
	value,
}: {
	icon: any;
	label: string;
	value: string;
}) => (
	<div className="glass-card rounded-2xl p-4 text-center">
		<div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
			{icon}
		</div>
		<p className="text-lg font-bold">{value}</p>
		<p className="text-[10px] uppercase tracking-wider text-muted-foreground">
			{label}
		</p>
	</div>
);

export default ResultsPage;
