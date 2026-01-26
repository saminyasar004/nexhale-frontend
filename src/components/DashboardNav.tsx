import { useState } from "react";
import { motion } from "framer-motion";
import {
	User,
	Target,
	BarChart3,
	Trophy,
	Gift,
	LogOut,
	Cigarette,
	Wind,
	Menu,
	X,
} from "lucide-react";

interface DashboardNavProps {
	activeTab: "smoking" | "vape";
	onTabChange: (tab: "smoking" | "vape") => void;
	onLogout: () => void;
	userName: string;
	onNavigate?: (page: string) => void;
}

const DashboardNav = ({
	activeTab,
	onTabChange,
	onLogout,
	userName,
	onNavigate,
}: DashboardNavProps) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navItems = [
		{
			icon: <Target className="w-5 h-5" />,
			label: "Quit Plan",
			page: "quit-plan",
		},
		{
			icon: <BarChart3 className="w-5 h-5" />,
			label: "Results",
			page: "results",
		},
		{
			icon: <Trophy className="w-5 h-5" />,
			label: "Leaderboard",
			page: "leaderboard",
		},
		{
			icon: <User className="w-5 h-5" />,
			label: "My Profile",
			page: "profile",
		},
		{
			icon: <Gift className="w-5 h-5" />,
			label: "Donation",
			page: "donation",
		},
	];

	const handleNavClick = (page: string) => {
		if (onNavigate) {
			onNavigate(page);
		}
		setIsMobileMenuOpen(false);
	};

	return (
		<nav className="sticky top-0 z-50 glass-card border-b border-border/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
								<Cigarette className="w-5 h-5 text-primary-foreground transform -rotate-45" />
							</div>
							<span className="font-display font-bold text-xl gradient-text hidden sm:block">
								Nexhale
							</span>
						</div>
					</div>

					<div className="hidden md:flex items-center gap-1">
						{navItems.map((item) => (
							<button
								key={item.label}
								onClick={() => handleNavClick(item.page)}
								className="nav-link flex items-center gap-2"
							>
								{item.icon}
								<span>{item.label}</span>
							</button>
						))}
					</div>

					<div className="flex items-center gap-3">
						<div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
							<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
								<span className="text-sm font-semibold text-primary">
									{userName.charAt(0).toUpperCase()}
								</span>
							</div>
							<span className="text-sm font-medium text-foreground">
								{userName}
							</span>
						</div>
						<button
							onClick={onLogout}
							className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
						>
							<LogOut className="w-5 h-5" />
						</button>
						<button
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
							className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
						>
							{isMobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			<motion.div
				initial={false}
				animate={{
					height: isMobileMenuOpen ? "auto" : 0,
					opacity: isMobileMenuOpen ? 1 : 0,
				}}
				className="md:hidden overflow-hidden border-t border-border/50"
			>
				<div className="p-4 space-y-2">
					{navItems.map((item) => (
						<button
							key={item.label}
							onClick={() => handleNavClick(item.page)}
							className="nav-link flex items-center gap-3 w-full"
						>
							{item.icon}
							<span>{item.label}</span>
						</button>
					))}
				</div>
			</motion.div>

			{/* Tab switcher */}
			<div className="border-t border-border/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6">
					<div className="flex gap-4">
						<button
							onClick={() => onTabChange("smoking")}
							className={`flex items-center gap-2 py-4 border-b-2 transition-all ${
								activeTab === "smoking"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							<Cigarette className="w-5 h-5" />
							<span className="font-medium">
								Smoking Dashboard
							</span>
						</button>
						<button
							onClick={() => onTabChange("vape")}
							className={`flex items-center gap-2 py-4 border-b-2 transition-all ${
								activeTab === "vape"
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							<Wind className="w-5 h-5" />
							<span className="font-medium">Vape Dashboard</span>
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default DashboardNav;
