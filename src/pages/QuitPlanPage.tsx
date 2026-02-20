import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, AIQuitPlan, AIQuitPlanStats } from "@/lib/api";
import AIQuitPlanSetup from "@/components/AIQuitPlanSetup";
import AIQuitPlanView from "@/components/AIQuitPlanView";
import { Brain } from "lucide-react";

interface QuitPlanPageProps {
	onBack: () => void;
}

const QuitPlanPage = ({ onBack }: QuitPlanPageProps) => {
	const [activePlan, setActivePlan] = useState<{
		plan: AIQuitPlan;
		stats: AIQuitPlanStats;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPlan = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await api.aiQuitPlan.getDashboard();
			setActivePlan(data);
		} catch (err: any) {
			console.log("No active AI quit plan found or error:", err);
			// If it's a 404, we just keep activePlan as null to show setup
			if (err.message !== "No active quit plan found") {
				// setError("Failed to load quit plan. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPlan();
	}, []);

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-4">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="font-display text-primary animate-pulse">
						Personalizing your path...
					</p>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-background pb-10">
			<header className="sticky top-0 z-50 glass-card border-b border-border/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between h-16">
						<button
							onClick={onBack}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							← Back
						</button>
						<div className="flex items-center gap-2">
							<Brain className="w-5 h-5 text-primary" />
							<h1 className="font-display font-bold text-lg gradient-text">
								AI Quit Plan
							</h1>
						</div>
						<div className="w-12" />
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
				<AnimatePresence mode="wait">
					{!activePlan ? (
						<motion.div
							key="setup"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
						>
							<div className="mb-8 text-center space-y-2">
								<h2 className="text-2xl font-bold text-foreground">
									Scientific Nicotine Reduction
								</h2>
								<p className="text-muted-foreground">
									AI-driven targets based on your preferred
									brands and biology.
								</p>
							</div>
							<AIQuitPlanSetup onPlanCreated={fetchPlan} />
						</motion.div>
					) : (
						<motion.div
							key="dashboard"
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 1.02 }}
						>
							<AIQuitPlanView
								planData={activePlan}
								onRefresh={fetchPlan}
							/>

							<div className="mt-8 text-center">
								<button
									onClick={() => setActivePlan(null)}
									className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
								>
									Create New Plan / Edit Targets
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</main>
		</div>
	);
};

export default QuitPlanPage;
