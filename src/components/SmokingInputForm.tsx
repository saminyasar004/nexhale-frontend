import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Cigarette,
	DollarSign,
	Smile,
	AlertTriangle,
	Lock,
} from "lucide-react";
import { getCigaretteBrandOptions } from "@/data/cigaretteBrands";
import smokingMoods, { getMoodsByCategory } from "@/data/smokingMoods";

interface SmokingInputFormProps {
	onSubmit: (data: SmokingEntry) => void;
	userAge?: number;
	preferredBrand?: string;
}

export interface SmokingEntry {
	brand: string;
	sticks: number;
	pricePerStick: number;
	mood: string;
	timestamp: Date;
}

const MIN_AGE = 15;

const SmokingInputForm = ({
	onSubmit,
	userAge = 18,
	preferredBrand = "",
}: SmokingInputFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		brand: preferredBrand,
		sticks: 1,
		pricePerStick: "0",
		mood: "",
	});
	const [ageError, setAgeError] = useState<string | null>(null);

	// Update initial brand when preferredBrand prop arrives
	useEffect(() => {
		if (preferredBrand && !formData.brand) {
			setFormData((prev) => ({ ...prev, brand: preferredBrand }));
		}
	}, [preferredBrand]);

	const isUnderAge = userAge < MIN_AGE;
	const cigaretteBrandOptions = getCigaretteBrandOptions();
	const moodCategories = getMoodsByCategory();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (isUnderAge) {
			setAgeError(`You must be ${MIN_AGE}+ years old to use Nexhale`);
			return;
		}

		onSubmit({
			...formData,
			pricePerStick: parseFloat(formData.pricePerStick as string) || 0,
			timestamp: new Date(),
		});
		setFormData({
			brand: preferredBrand || "",
			sticks: 1,
			pricePerStick: "0",
			mood: "",
		});
		setIsOpen(false);
	};

	const handleOpenForm = () => {
		if (isUnderAge) {
			setAgeError(`You must be ${MIN_AGE}+ years old to use Nexhale`);
			return;
		}
		setIsOpen(!isOpen);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`glass-card rounded-2xl overflow-hidden ${isUnderAge ? "opacity-75" : ""}`}
		>
			{/* Age Warning Banner */}
			{ageError && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					className="p-4 bg-destructive/10 border-b border-destructive/20"
				>
					<div className="flex items-center gap-3">
						<AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
						<p className="text-sm text-destructive font-medium">
							{`You must be ${MIN_AGE}+ years old to use Nexhale`}
						</p>
					</div>
				</motion.div>
			)}

			<button
				onClick={handleOpenForm}
				disabled={isUnderAge}
				className={`w-full p-6 flex items-center justify-between transition-colors ${
					isUnderAge ? "cursor-not-allowed" : "hover:bg-muted/30"
				}`}
			>
				<div className="flex items-center gap-4">
					<div
						className={`w-12 h-12 rounded-xl flex items-center justify-center ${
							isUnderAge ? "bg-muted/50" : "bg-primary/10"
						}`}
					>
						{isUnderAge ? (
							<Lock className="w-6 h-6 text-muted-foreground" />
						) : (
							<Cigarette className="w-6 h-6 text-primary" />
						)}
					</div>
					<div className="text-left">
						<h3 className="font-display font-semibold text-foreground">
							Log Smoking
						</h3>
						<p className="text-sm text-muted-foreground">
							{isUnderAge
								? "Age restriction applies"
								: "Record your daily consumption"}
						</p>
					</div>
				</div>
				<motion.div
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{ duration: 0.2 }}
					className={`w-10 h-10 rounded-full flex items-center justify-center ${
						isUnderAge ? "bg-muted" : "bg-primary"
					}`}
				>
					<Plus
						className={`w-5 h-5 ${isUnderAge ? "text-muted-foreground" : "text-primary-foreground"}`}
					/>
				</motion.div>
			</button>

			<motion.div
				initial={false}
				animate={{
					height: isOpen && !isUnderAge ? "auto" : 0,
					opacity: isOpen && !isUnderAge ? 1 : 0,
				}}
				transition={{ duration: 0.3 }}
				className="overflow-hidden"
			>
				<form onSubmit={handleSubmit} className="p-6 pt-0 space-y-5">
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							Cigarette Brand
						</label>
						<select
							value={formData.brand}
							onChange={(e) =>
								setFormData({
									...formData,
									brand: e.target.value,
								})
							}
							className="input-field"
							required
						>
							<option value="">Select brand</option>
							{cigaretteBrandOptions.map((brand) => (
								<option key={brand} value={brand}>
									{brand}
								</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Number of Sticks
							</label>
							<div className="relative">
								<Cigarette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type="number"
									min="1"
									max="50"
									value={formData.sticks}
									onChange={(e) =>
										setFormData({
											...formData,
											sticks:
												parseInt(e.target.value) || 1,
										})
									}
									className="input-field pl-12"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Price per Stick (৳)
							</label>
							<div className="relative">
								<DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type="text"
									inputMode="decimal"
									value={formData.pricePerStick}
									onChange={(e) =>
										setFormData({
											...formData,
											pricePerStick:
												e.target.value.replace(
													/[^0-9.]/g,
													"",
												),
										})
									}
									className="input-field pl-12"
									required
								/>
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-3">
							<Smile className="inline w-4 h-4 mr-1" />
							Mood (optional)
						</label>

						{/* Emotional Moods */}
						<div className="mb-3">
							<p className="text-xs text-muted-foreground mb-2">
								Emotional
							</p>
							<div className="flex flex-wrap gap-2">
								{moodCategories.emotional.map((mood) => (
									<button
										key={mood.value}
										type="button"
										onClick={() =>
											setFormData({
												...formData,
												mood:
													formData.mood === mood.value
														? ""
														: mood.value,
											})
										}
										className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
											formData.mood === mood.value
												? "bg-primary text-primary-foreground neon-glow"
												: "bg-muted text-muted-foreground hover:bg-muted/80"
										}`}
									>
										{mood.emoji} {mood.label}
									</button>
								))}
							</div>
						</div>

						{/* Situational Moods */}
						<div className="mb-3">
							<p className="text-xs text-muted-foreground mb-2">
								Situational
							</p>
							<div className="flex flex-wrap gap-2">
								{moodCategories.situational.map((mood) => (
									<button
										key={mood.value}
										type="button"
										onClick={() =>
											setFormData({
												...formData,
												mood:
													formData.mood === mood.value
														? ""
														: mood.value,
											})
										}
										className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
											formData.mood === mood.value
												? "bg-accent text-accent-foreground neon-glow-accent"
												: "bg-muted text-muted-foreground hover:bg-muted/80"
										}`}
									>
										{mood.emoji} {mood.label}
									</button>
								))}
							</div>
						</div>

						{/* Physical Moods */}
						<div>
							<p className="text-xs text-muted-foreground mb-2">
								Physical
							</p>
							<div className="flex flex-wrap gap-2">
								{moodCategories.physical.map((mood) => (
									<button
										key={mood.value}
										type="button"
										onClick={() =>
											setFormData({
												...formData,
												mood:
													formData.mood === mood.value
														? ""
														: mood.value,
											})
										}
										className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
											formData.mood === mood.value
												? "bg-warning text-warning-foreground"
												: "bg-muted text-muted-foreground hover:bg-muted/80"
										}`}
									>
										{mood.emoji} {mood.label}
									</button>
								))}
							</div>
						</div>
					</div>

					<button type="submit" className="btn-primary w-full">
						Save Entry
					</button>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default SmokingInputForm;
