import { motion } from "framer-motion";
import {
	Activity,
	AlertTriangle,
	Brain,
	Wind,
	ShieldCheck,
	ShieldAlert,
	ShieldX,
} from "lucide-react";

interface HealthImpactProps {
	healthData: {
		riskTier: string;
		riskPercentage: number;
		nicotineIntake: string;
		tarIntake: string;
		details: Array<{ type: string; description: string }>;
	};
}

const HealthImpact = ({ healthData }: HealthImpactProps) => {
	if (!healthData || !healthData.riskTier) {
		return null;
	}

	const getRiskColor = () => {
		const tier = (healthData.riskTier || "").toLowerCase();
		if (tier.includes("safe")) return "success";
		if (tier.includes("monitoring") || tier.includes("elevated"))
			return "warning";
		return "destructive";
	};

	const riskColor = getRiskColor();

	const getRiskIcon = () => {
		switch (riskColor) {
			case "success":
				return <ShieldCheck className="w-5 h-5 text-success" />;
			case "warning":
				return <ShieldAlert className="w-5 h-5 text-warning" />;
			case "destructive":
				return <ShieldX className="w-5 h-5 text-destructive" />;
			default:
				return <ShieldCheck className="w-5 h-5 text-success" />;
		}
	};

	const getRiskBgColor = () => {
		switch (riskColor) {
			case "success":
				return "bg-success/10 border-success/30";
			case "warning":
				return "bg-warning/10 border-warning/30";
			case "destructive":
				return "bg-destructive/10 border-destructive/30";
			default:
				return "bg-success/10 border-success/30";
		}
	};

	const getRiskTextColor = () => {
		switch (riskColor) {
			case "success":
				return "text-success";
			case "warning":
				return "text-warning";
			case "destructive":
				return "text-destructive";
			default:
				return "text-success";
		}
	};

	const behavioralImpact = healthData.details?.find(
		(d) => d.type === "Behavioral",
	)?.description;
	const addictionImpact = healthData.details?.find(
		(d) => d.type === "Addiction",
	)?.description;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="glass-card rounded-2xl p-6"
		>
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
					<Activity className="w-5 h-5 text-destructive" />
				</div>
				<div>
					<h3 className="font-display font-semibold text-foreground">
						Health Impact
					</h3>
					<p className="text-sm text-muted-foreground">
						Database-driven awareness (not medical advice)
					</p>
				</div>
			</div>

			{/* Risk Tier Badge */}
			<div className={`rounded-xl p-4 border mb-6 ${getRiskBgColor()}`}>
				<div className="flex items-center gap-3">
					<div
						className={`w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center`}
					>
						{getRiskIcon()}
					</div>
					<div>
						<p className="text-sm text-muted-foreground">
							Current Risk Tier
						</p>
						<p
							className={`font-display font-bold text-lg ${getRiskTextColor()}`}
						>
							{healthData.riskTier}
						</p>
					</div>
				</div>
			</div>

			{/* Monthly Stats */}
			<div className="grid grid-cols-2 gap-3 mb-6">
				<div className="bg-muted/50 rounded-xl p-4 text-center">
					<Wind className="w-5 h-5 text-chart-tar mx-auto mb-2" />
					<p className="text-xs text-muted-foreground">Monthly TAR</p>
					<p className="font-display font-bold text-foreground">
						{healthData.tarIntake} mg
					</p>
				</div>
				<div className="bg-muted/50 rounded-xl p-4 text-center">
					<Brain className="w-5 h-5 text-chart-nicotine mx-auto mb-2" />
					<p className="text-xs text-muted-foreground">
						Monthly Nicotine
					</p>
					<p className="font-display font-bold text-foreground">
						{healthData.nicotineIntake} mg
					</p>
				</div>
			</div>

			{/* Health Impact Message */}
			<div className="space-y-4">
				{behavioralImpact && (
					<div className="bg-muted/50 rounded-xl p-5">
						<div className="flex items-start gap-3 mb-3">
							<div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
								<Wind className="w-4 h-4 text-chart-tar" />
							</div>
							<div>
								<p className="text-sm font-semibold text-foreground mb-1">
									Behavioral Impact
								</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{behavioralImpact}
								</p>
							</div>
						</div>
					</div>
				)}

				{addictionImpact && (
					<div className="bg-muted/50 rounded-xl p-5">
						<div className="flex items-start gap-3 mb-3">
							<div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
								<Brain className="w-4 h-4 text-chart-nicotine" />
							</div>
							<div>
								<p className="text-sm font-semibold text-foreground mb-1">
									Addiction Analysis
								</p>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{addictionImpact}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="mt-4 p-4 bg-warning/10 rounded-xl flex items-start gap-3">
				<AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
				<p className="text-sm text-foreground/80">
					This is awareness-based statistical information only. For
					medical diagnosis, please consult a healthcare professional.
				</p>
			</div>
		</motion.div>
	);
};

export default HealthImpact;
