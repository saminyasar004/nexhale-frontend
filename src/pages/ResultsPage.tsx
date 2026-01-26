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

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const currentYear = new Date().getFullYear();

const ResultsPage = ({ onBack }: ResultsPageProps) => {
	const [selectedMonth, setSelectedMonth] = useState(
		months[new Date().getMonth()],
	);
	const [summary, setSummary] = useState<any>(null);
	const [weeklyData, setWeeklyData] = useState<any[]>([]);
	const [moodData, setMoodData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const monthNum = months.indexOf(selectedMonth) + 1;
				const [sum, weekly, moods] = await Promise.all([
					api.get(
						`/stats/summary?month=${monthNum}&year=${currentYear}`,
					),
					api.get(
						`/stats/weekly?month=${monthNum}&year=${currentYear}`,
					),
					api.get(`/stats/moods`),
				]);
				setSummary(sum);
				setWeeklyData(weekly);

				// Process mood data for pie chart
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
	}, [selectedMonth]);

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
						value={selectedMonth}
						onChange={(e) => setSelectedMonth(e.target.value)}
						className="input-field flex-1"
					>
						{months.map((m) => (
							<option key={m} value={m}>
								{m} {currentYear}
							</option>
						))}
					</select>
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
						label="TAR"
						value={`${(parseFloat(summary.totalTar) / 1000).toFixed(1)}g`}
					/>
					<SummaryItem
						icon={<Wind className="text-accent" />}
						label="Chemical"
						value={`${parseFloat(summary.totalChemical).toFixed(1)}mg`}
					/>
					<SummaryItem
						icon={<DollarSign className="text-warning" />}
						label="Cost"
						value={`৳${parseFloat(summary.totalCost).toLocaleString()}`}
					/>
				</div>

				{/* Weekly Chart */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="glass-card rounded-2xl p-6"
				>
					<h3 className="font-display font-semibold mb-6 flex items-center gap-2">
						<TrendingUp className="w-5 h-5 text-primary" /> Weekly
						Trends
					</h3>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={weeklyData}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="rgba(255,255,255,0.05)"
									vertical={false}
								/>
								<XAxis
									dataKey="name"
									tick={{ fill: "#94a3b8", fontSize: 12 }}
								/>
								<YAxis
									tick={{ fill: "#94a3b8", fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#0f172a",
										border: "1px solid #1e293b",
										borderRadius: "8px",
									}}
								/>
								<Bar
									dataKey="nicotine"
									name="Nicotine"
									fill="#8b5cf6"
									radius={[4, 4, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</motion.div>

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
						<div className="flex flex-col md:flex-row items-center gap-8">
							<div className="h-48 w-48">
								<ResponsiveContainer>
									<PieChart>
										<Pie
											data={moodData}
											innerRadius={40}
											outerRadius={70}
											dataKey="value"
										>
											{moodData.map((d, i) => (
												<Cell key={i} fill={d.color} />
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="grid grid-cols-2 gap-x-6 gap-y-2">
								{moodData.map((m, i) => (
									<div
										key={i}
										className="flex items-center gap-2"
									>
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: m.color }}
										/>
										<span className="text-sm whitespace-nowrap">
											{m.name}: {m.value}%
										</span>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</main>
		</div>
	);
};

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
