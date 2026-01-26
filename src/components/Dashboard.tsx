import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import {
	Cigarette,
	DollarSign,
	Flame,
	Activity,
	Wind,
	Droplets,
	FlaskConical,
} from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import BottomNav from "@/components/BottomNav";
import StatCard from "@/components/StatCard";
import SmokingInputForm, { SmokingEntry } from "@/components/SmokingInputForm";
import VapeInputForm, { VapeEntry } from "@/components/VapeInputForm";
import AnalyticsChart from "@/components/AnalyticsChart";
import ZoneIndicator from "@/components/ZoneIndicator";
import LeaderboardCard from "@/components/LeaderboardCard";
import QuitPlanAlert from "@/components/QuitPlanAlert";
import HealthImpact from "@/components/HealthImpact";
import VapeHealthImpact from "@/components/VapeHealthImpact";
import QuitPlanPage from "@/pages/QuitPlanPage";
import ResultsPage from "@/pages/ResultsPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProfilePage from "@/pages/ProfilePage";
import DonationPage from "@/pages/DonationPage";

interface DashboardProps {
	onLogout: () => void;
	userAge?: number;
}

type PageType =
	| "dashboard"
	| "quit-plan"
	| "results"
	| "leaderboard"
	| "profile"
	| "donation";

const Dashboard = ({ onLogout, userAge = 18 }: DashboardProps) => {
	const [activeTab, setActiveTab] = useState<"smoking" | "vape">("smoking");
	const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
	const [showAlert, setShowAlert] = useState(true);
	const [stats, setStats] = useState<any>(null);
	const [chartData, setChartData] = useState<{ daily: any[], weekly: any[], monthly: any[] }>({
		daily: [],
		weekly: [],
		monthly: []
	});
	const [leaderboardTar, setLeaderboardTar] = useState<any[]>([]);
	const [leaderboardNicotine, setLeaderboardNicotine] = useState<any[]>([]);
	const [quitPlan, setQuitPlan] = useState<any>(null);
	const [brands, setBrands] = useState<any[]>([]);
	const [healthData, setHealthData] = useState<any>(null);
	const [userProfile, setUserProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const [sum, daily, weekly, monthly, lbTar, lbNic, qp, b, h, profile] = await Promise.all([
					api.get("/stats/summary"),
					api.get("/stats/daily"),
					api.get("/stats/weekly"),
					api.get("/stats/monthly"),
					api.get("/leaderboard?type=tar"),
					api.get("/leaderboard?type=nicotine"),
					api.get("/quit-plan"),
					api.get("/brands"),
					api.get("/stats/health"),
					api.get("/user/profile"),
				]);
				setStats(sum);
				setChartData({ daily, weekly, monthly });
				setLeaderboardTar(lbTar);
				setLeaderboardNicotine(lbNic);
				setQuitPlan(qp);
				setBrands(b);
				setHealthData(h);
				setUserProfile(profile);
			} catch (err: any) {
				console.error("Error fetching dashboard data:", err);
				setError(err.message || "Failed to load dashboard data.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleLogoutClick = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		onLogout();
	};

	// Smoking stats
	const todayCigarettes = stats?.dailyCigarettes || 0;
	const monthlyCost = stats?.totalCost || 0;
	const monthlyNicotine = parseFloat(stats?.totalNicotine) || 0;
	const monthlyTar = parseFloat(stats?.totalTar) || 0;
	const monthlyChemical = stats?.totalChemical || 0;

	// Vape stats
	const todayPuffs = stats?.totalPuffs || 0;
	const todayLiquid = stats?.totalLiquid || 0;

	// Quit plan data (using combined totalNicotine from backend)
	const nicotineLimit = quitPlan?.plan?.nicotine_limit || 500;
	const currentNicotine = monthlyNicotine;
	const percentUsed = Math.round((currentNicotine / nicotineLimit) * 100);

	const handleNavigate = (page: string) => {
		setCurrentPage(page as PageType);
	};

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center font-display text-primary">
				Loading Nexhale...
			</div>
		);

	if (error) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<div className="glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6">
					<div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto text-destructive">
						<Activity className="w-10 h-10" />
					</div>
					<h2 className="text-xl font-bold text-foreground">
						Dashboard Error
					</h2>
					<p className="text-muted-foreground">{error}</p>
					<div className="flex flex-col gap-3">
						<button
							onClick={() => window.location.reload()}
							className="btn-primary w-full"
						>
							Retry Connection
						</button>
						<button
							onClick={handleLogoutClick}
							className="btn-secondary w-full"
						>
							Logout & Re-login
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Render sub-pages
	if (currentPage === "quit-plan") {
		return <QuitPlanPage onBack={() => setCurrentPage("dashboard")} />;
	}
	if (currentPage === "results") {
		return <ResultsPage onBack={() => setCurrentPage("dashboard")} />;
	}
	if (currentPage === "leaderboard") {
		return <LeaderboardPage onBack={() => setCurrentPage("dashboard")} />;
	}
	if (currentPage === "profile") {
		return <ProfilePage onBack={() => setCurrentPage("dashboard")} />;
	}
	if (currentPage === "donation") {
		return <DonationPage onBack={() => setCurrentPage("dashboard")} />;
	}

	return (
		<div className="min-h-screen bg-background pb-20 md:pb-0 font-sans">
			<DashboardNav
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onLogout={handleLogoutClick}
				userName={
					JSON.parse(localStorage.getItem("user") || "{}").username ||
					"User"
				}
				onNavigate={handleNavigate}
			/>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
				<AnimatePresence>
					{showAlert && percentUsed > 50 && (
						<div className="mb-6">
							<QuitPlanAlert
								consumedNicotine={currentNicotine}
								nicotineLimit={nicotineLimit}
								daysRemaining={12}
							/>
						</div>
					)}
				</AnimatePresence>

				{activeTab === "smoking" ? (
					<motion.div
						key="smoking"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="space-y-6"
					>
						{/* Stats Overview */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<StatCard
								title="Monthly Cost"
								value={`৳${parseFloat(monthlyCost).toLocaleString()}`}
								icon={<DollarSign className="w-6 h-6" />}
								color="warning"
								trend="up"
								trendValue="+12%"
							/>
							<StatCard
								title="Total Nicotine"
								value={currentNicotine.toFixed(1)}
								unit="mg"
								icon={<Flame className="w-6 h-6" />}
								color="primary"
								trend="down"
								trendValue="-8%"
							/>
							<StatCard
								title="Total TAR"
								value={(monthlyTar / 1000).toFixed(1)}
								unit="g"
								icon={<Activity className="w-6 h-6" />}
								color="destructive"
								trend="neutral"
								trendValue="0%"
							/>
							<StatCard
								title="Today's Sticks"
								value={todayCigarettes.toString()}
								icon={<Cigarette className="w-6 h-6" />}
								color="success"
							/>
						</div>

						{/* Input Form */}
						<SmokingInputForm
							onSubmit={async (entry) => {
								const brandMatch = brands.find(
									(b) => b.displayName === entry.brand,
								);
								await api.post("/quit-plan/log", {
									date: new Date().toLocaleDateString('en-CA'),
									cigaretteCount: entry.sticks,
									brandId: brandMatch?.id || 1,
									cost: entry.sticks * entry.pricePerStick,
									mood: entry.mood,
								});
								window.location.reload();
							}}
							userAge={userAge}
							preferredBrand={userProfile?.preferred_brand}
						/>

						{/* Charts */}
						<div className="grid md:grid-cols-2 gap-6">
							<AnalyticsChart
								title="Nicotine Intake"
								data={chartData}
								color="nicotine"
								unit="mg"
							/>
							<AnalyticsChart
								title="TAR Intake"
								data={chartData}
								color="tar"
								unit="mg"
							/>
						</div>

						{/* Zone Status */}
						<ZoneIndicator
							zone={
								todayCigarettes <= 3
									? "green"
									: todayCigarettes <= 6
										? "yellow"
										: todayCigarettes <= 10
											? "orange"
											: "red"
							}
							cigarettesToday={todayCigarettes}
							tarToday={stats?.dailyTar || 0}
						/>

						{/* Leaderboards */}
						<div className="grid md:grid-cols-2 gap-6">
							<LeaderboardCard
								title="Lowest TAR Intake"
								users={leaderboardTar}
								type="tar"
							/>
							<LeaderboardCard
								title="Lowest Nicotine Intake"
								users={leaderboardNicotine}
								type="nicotine"
							/>
						</div>

						{/* Health Impact */}
						{healthData && <HealthImpact healthData={healthData} />}
					</motion.div>
				) : (
					<motion.div
						key="vape"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="space-y-6"
					>
						{/* Vape Stats Overview */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<StatCard
								title="Today's Puffs"
								value={todayPuffs.toString()}
								icon={<Wind className="w-6 h-6" />}
								color="primary"
							/>
							<StatCard
								title="E-Liquid Used"
								value={parseFloat(todayLiquid).toFixed(1)}
								unit="ml"
								icon={<Droplets className="w-6 h-6" />}
								color="success"
							/>
							<StatCard
								title="Monthly Nicotine"
								value={currentNicotine.toFixed(1)}
								unit="mg"
								icon={<Flame className="w-6 h-6" />}
								color="warning"
							/>
							<StatCard
								title="Chemical Exposure"
								value={parseFloat(monthlyChemical).toFixed(1)}
								unit="mg"
								icon={<FlaskConical className="w-6 h-6" />}
								color="destructive"
							/>
						</div>

						{/* Vape Input Form */}
						<VapeInputForm
							onSubmit={async (entry) => {
								await api.post("/quit-plan/log-vape", {
									date: new Date().toLocaleDateString('en-CA'),
									puffs: entry.puffs,
									liquidAmount: entry.liquidAmount,
									flavor: entry.flavor,
									pgPercentage: entry.pgPercentage,
									nicotineAmount: entry.liquidAmount * 20,
									mood: entry.mood,
								});
								window.location.reload();
							}}
							defaultFlavor="Mint"
							userAge={userAge}
							preferredFlavor={userProfile?.preferred_vape_flavor}
							preferredLiquidAmount={userProfile?.preferred_vape_liquid_amount}
						/>

						{/* Vape Charts */}
						<div className="grid md:grid-cols-2 gap-6">
							<AnalyticsChart
								title="Nicotine Intake"
								data={chartData}
								color="nicotine"
								unit="mg"
							/>
							<AnalyticsChart
								title="Chemical Exposure"
								data={chartData}
								color="tar"
								unit="mg"
							/>
						</div>

						{/* Vape Health Impact */}
						{healthData && (
							<VapeHealthImpact healthData={healthData} />
						)}
					</motion.div>
				)}
			</main>

			<BottomNav
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onNavigate={handleNavigate}
			/>
		</div>
	);
};

export default Dashboard;
