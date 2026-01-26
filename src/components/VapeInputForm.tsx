import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Wind,
	Droplets,
	FlaskConical,
	Smile,
	AlertTriangle,
	Lock,
} from "lucide-react";

interface VapeInputFormProps {
	onSubmit: (data: VapeEntry) => void;
	defaultFlavor?: string;
	userAge?: number;
	preferredFlavor?: string;
	preferredLiquidAmount?: string;
}

export interface VapeEntry {
	puffs: number;
	liquidAmount: number;
	flavor: string;
	pgPercentage?: number;
	mood?: string;
	timestamp: Date;
}

const vapeFlavors = [
	"Mango",
	"Mint",
	"Strawberry",
	"Blueberry",
	"Watermelon",
	"Grape",
	"Tobacco",
	"Vanilla",
	"Mixed Fruits",
	"Other",
];

import { getVapeMoodOptions, getMoodsByCategory } from "@/data/vapeMoods";

const MIN_AGE = 15;

const VapeInputForm = ({
	onSubmit,
	defaultFlavor = "",
	userAge = 18,
	preferredFlavor = "",
	preferredLiquidAmount = "0",
}: VapeInputFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		puffs: 0,
		liquidAmount: preferredLiquidAmount || "0",
		flavor: preferredFlavor || defaultFlavor,
		pgPercentage: 50,
		mood: "",
	});
	const [ageError, setAgeError] = useState<string | null>(null);

	// Sync preferences when props arrive or form resets
	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			flavor: preferredFlavor || prev.flavor,
			liquidAmount:
				preferredLiquidAmount && prev.liquidAmount === "0"
					? preferredLiquidAmount
					: prev.liquidAmount,
		}));
	}, [preferredFlavor, preferredLiquidAmount]);

	const isUnderAge = userAge < MIN_AGE;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (isUnderAge) {
			setAgeError(`You must be ${MIN_AGE}+ years old to use Nexhale`);
			return;
		}

		onSubmit({
			...formData,
			liquidAmount: parseFloat(formData.liquidAmount as string) || 0,
			mood: formData.mood || undefined,
			timestamp: new Date(),
		});
		setFormData({
			puffs: 0,
			liquidAmount: preferredLiquidAmount || "0",
			flavor: preferredFlavor || defaultFlavor,
			pgPercentage: 50,
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
							isUnderAge
								? "bg-muted/50"
								: "bg-accent/20 neon-glow-accent"
						}`}
					>
						{isUnderAge ? (
							<Lock className="w-6 h-6 text-muted-foreground" />
						) : (
							<Wind className="w-6 h-6 text-accent" />
						)}
					</div>
					<div className="text-left">
						<h3 className="font-display font-semibold text-foreground">
							Log Vape Session
						</h3>
						<p className="text-sm text-muted-foreground">
							{isUnderAge
								? "Age restriction applies"
								: "Record your puffs and liquid usage"}
						</p>
					</div>
				</div>
				<motion.div
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{ duration: 0.2 }}
					className={`w-10 h-10 rounded-full flex items-center justify-center ${
						isUnderAge ? "bg-muted" : "bg-primary neon-glow"
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
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Number of Puffs
							</label>
							<div className="relative">
								<Wind className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type="number"
									min="1"
									value={formData.puffs}
									onChange={(e) =>
										setFormData({
											...formData,
											puffs:
												parseInt(e.target.value) || 0,
										})
									}
									className="input-field pl-12"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								E-Liquid (ml)
							</label>
							<div className="relative">
								<Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type="text"
									inputMode="decimal"
									value={formData.liquidAmount}
									onChange={(e) =>
										setFormData({
											...formData,
											liquidAmount:
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
						<label className="block text-sm font-medium text-foreground mb-2">
							E-Liquid Flavor
						</label>
						<select
							value={formData.flavor}
							onChange={(e) =>
								setFormData({
									...formData,
									flavor: e.target.value,
								})
							}
							className="input-field"
							required
						>
							<option value="">Select flavor</option>
							{vapeFlavors.map((flavor) => (
								<option key={flavor} value={flavor}>
									{flavor}
								</option>
							))}
						</select>
					</div>

					{/* Mood Field - Optional */}
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							<Smile className="inline w-4 h-4 mr-1" />
							Mood (optional)
						</label>
						<select
							value={formData.mood}
							onChange={(e) =>
								setFormData({
									...formData,
									mood: e.target.value,
								})
							}
							className="input-field"
						>
							<option value="">How are you feeling?</option>
							<optgroup label="Emotional">
								{getMoodsByCategory().emotional.map((mood) => (
									<option key={mood.value} value={mood.value}>
										{mood.emoji} {mood.label}
									</option>
								))}
							</optgroup>
							<optgroup label="Situational">
								{getMoodsByCategory().situational.map(
									(mood) => (
										<option
											key={mood.value}
											value={mood.value}
										>
											{mood.emoji} {mood.label}
										</option>
									),
								)}
							</optgroup>
							<optgroup label="Physical">
								{getMoodsByCategory().physical.map((mood) => (
									<option key={mood.value} value={mood.value}>
										{mood.emoji} {mood.label}
									</option>
								))}
							</optgroup>
							<optgroup label="Social">
								{getMoodsByCategory().social.map((mood) => (
									<option key={mood.value} value={mood.value}>
										{mood.emoji} {mood.label}
									</option>
								))}
							</optgroup>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-foreground mb-2">
							<FlaskConical className="inline w-4 h-4 mr-1" />
							PG Percentage (optional)
						</label>
						<div className="flex items-center gap-4">
							<input
								type="range"
								min="0"
								max="100"
								value={formData.pgPercentage}
								onChange={(e) =>
									setFormData({
										...formData,
										pgPercentage: parseInt(e.target.value),
									})
								}
								className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
							/>
							<span className="text-sm font-medium text-foreground w-16 text-right">
								{formData.pgPercentage}% PG
							</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							VG: {100 - formData.pgPercentage}%
						</p>
					</div>

					<button type="submit" className="btn-primary w-full">
						Save Entry
					</button>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default VapeInputForm;
