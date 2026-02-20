import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Target,
	Calendar,
	Cigarette,
	Wind,
	Sparkles,
	ChevronRight,
	Check,
} from "lucide-react";
import { api } from "@/lib/api";

interface AIQuitPlanSetupProps {
	onPlanCreated: () => void;
}

const AIQuitPlanSetup = ({ onPlanCreated }: AIQuitPlanSetupProps) => {
	const [step, setStep] = useState(1);
	const [currentIntake, setCurrentIntake] = useState(360);
	const [targetIntake, setTargetIntake] = useState(240);
	const [timeline, setTimeline] = useState(2);
	const [brands, setBrands] = useState<any[]>([]);
	const [vapeBrands, setVapeBrands] = useState<any[]>([]);
	const [selectedBrand, setSelectedBrand] = useState<any>(null);
	const [brandType, setBrandType] = useState<"Cigarette" | "Vape">(
		"Cigarette",
	);
	const [isLoading, setIsLoading] = useState(false);
	const [aiAdvice, setAiAdvice] = useState<any>(null);

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const [cigBrands, vapeBrandsData] = await Promise.all([
					api.get("/brands"),
					api.get("/brands/vape"), // Assuming this exists or using general /brands
				]);
				setBrands(cigBrands);
				setVapeBrands(vapeBrandsData);
				if (cigBrands.length > 0) setSelectedBrand(cigBrands[0]);
				else if (vapeBrandsData.length > 0) {
					setBrandType("Vape");
					setSelectedBrand(vapeBrandsData[0]);
				}
			} catch (err) {
				console.error("Error fetching brands:", err);
			}
		};
		fetchBrands();
	}, []);

	const handleNext = () => setStep(step + 1);
	const handleBack = () => setStep(step - 1);

	const handleCreatePlan = async () => {
		setIsLoading(true);
		try {
			await api.aiQuitPlan.setup({
				currentIntake,
				targetIntake,
				timelineMonths: timeline,
				brandId: selectedBrand.brand_id || selectedBrand.id,
				brandType,
			});
			onPlanCreated();
		} catch (err) {
			console.error("Error creating plan:", err);
		} finally {
			setIsLoading(false);
		}
	};

	const allowedDailySticks = selectedBrand
		? Math.round(
				(targetIntake /
					parseFloat(selectedBrand.nicotineMg || 0.1) /
					30) *
					10,
			) / 10
		: 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
					<Sparkles className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h2 className="text-xl font-bold text-foreground">
						AI Quit Plan Setup
					</h2>
					<p className="text-sm text-muted-foreground">
						Step {step} of 3
					</p>
				</div>
			</div>

			<div className="glass-card rounded-2xl p-6">
				{step === 1 && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="space-y-6"
					>
						<h3 className="text-lg font-semibold mb-4">
							Select Your Brand
						</h3>
						<div className="flex gap-4 mb-4">
							<button
								onClick={() => setBrandType("Cigarette")}
								className={`flex-1 py-3 rounded-xl border-2 transition-all ${brandType === "Cigarette" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted/30"}`}
							>
								<Cigarette className="w-6 h-6 mx-auto mb-1" />
								Cigarette
							</button>
							<button
								onClick={() => setBrandType("Vape")}
								className={`flex-1 py-3 rounded-xl border-2 transition-all ${brandType === "Vape" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted/30"}`}
							>
								<Wind className="w-6 h-6 mx-auto mb-1" />
								Vape
							</button>
						</div>

						<div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
							{(brandType === "Cigarette"
								? brands
								: vapeBrands
							).map((brand) => (
								<button
									key={brand.brand_id || brand.id}
									onClick={() => setSelectedBrand(brand)}
									className={`w-full p-4 rounded-xl text-left transition-all border ${selectedBrand?.brand_id === brand.brand_id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/50"}`}
								>
									<div className="flex justify-between items-center">
										<span className="font-medium">
											{brand.brand_name || brand.name}
										</span>
										<span className="text-sm text-muted-foreground">
											{brand.nicotineMg} mg/stick
										</span>
									</div>
								</button>
							))}
						</div>

						<button
							onClick={handleNext}
							className="btn-primary w-full mt-4"
						>
							Next Step
						</button>
					</motion.div>
				)}

				{step === 2 && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="space-y-6"
					>
						<h3 className="text-lg font-semibold">
							Set Nicotine Targets
						</h3>
						<div className="space-y-4">
							<div>
								<label className="text-sm text-muted-foreground mb-2 block">
									Current Monthly Nicotine (mg)
								</label>
								<input
									type="number"
									value={currentIntake}
									onChange={(e) =>
										setCurrentIntake(
											parseInt(e.target.value),
										)
									}
									className="input-field text-xl font-bold"
								/>
							</div>
							<div>
								<label className="text-sm text-muted-foreground mb-2 block">
									Target Monthly Nicotine (mg)
								</label>
								<input
									type="number"
									value={targetIntake}
									onChange={(e) =>
										setTargetIntake(
											parseInt(e.target.value),
										)
									}
									className="input-field text-xl font-bold text-primary"
								/>
							</div>
							<div>
								<label className="text-sm text-muted-foreground mb-2 block">
									Timeline (Months)
								</label>
								<div className="grid grid-cols-3 gap-3">
									{[1, 2, 3].map((m) => (
										<button
											key={m}
											onClick={() => setTimeline(m)}
											className={`py-3 rounded-xl border-2 transition-all ${timeline === m ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted/30"}`}
										>
											{m} Month{m > 1 ? "s" : ""}
										</button>
									))}
								</div>
							</div>
						</div>
						<div className="flex gap-4">
							<button
								onClick={handleBack}
								className="btn-secondary flex-1"
							>
								Back
							</button>
							<button
								onClick={handleNext}
								className="btn-primary flex-1"
							>
								Preview Analysis
							</button>
						</div>
					</motion.div>
				)}

				{step === 3 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="space-y-6"
					>
						<div className="text-center p-6 bg-primary/5 rounded-2xl border border-primary/20">
							<div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Target className="w-8 h-8 text-primary" />
							</div>
							<h3 className="text-xl font-bold mb-2">
								AI Projection
							</h3>
							<p className="text-muted-foreground text-sm">
								Based on your selected brand and target
							</p>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 bg-muted/50 rounded-xl text-center">
								<p className="text-2xl font-bold text-primary">
									{allowedDailySticks}
								</p>
								<p className="text-xs text-muted-foreground">
									Allowed Sticks/Day
								</p>
							</div>
							<div className="p-4 bg-muted/50 rounded-xl text-center">
								<p className="text-2xl font-bold text-foreground">
									{(targetIntake / 30).toFixed(1)}
								</p>
								<p className="text-xs text-muted-foreground">
									Max Daily Nicotine (mg)
								</p>
							</div>
						</div>

						<div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
							<Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0" />
							<p className="text-sm text-yellow-800">
								"To reach your goal of {targetIntake}mg, you can
								have a maximum of {allowedDailySticks} sticks
								per day. This is a{" "}
								{Math.round(
									(1 - targetIntake / currentIntake) * 100,
								)}
								% reduction."
							</p>
						</div>

						<div className="flex gap-4">
							<button
								onClick={handleBack}
								className="btn-secondary flex-1"
							>
								Back
							</button>
							<button
								onClick={handleCreatePlan}
								disabled={isLoading || !selectedBrand}
								className="btn-primary flex-1 flex items-center justify-center gap-2"
							>
								{isLoading ? (
									"Generating..."
								) : (
									<>
										<Check className="w-5 h-5" />
										Activate Plan
									</>
								)}
							</button>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
};

export default AIQuitPlanSetup;
