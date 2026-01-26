import { motion } from "framer-motion";

interface NexhaleLogoProps {
	size?: "sm" | "md" | "lg";
	showTagline?: boolean;
	className?: string;
}

const NexhaleLogo = ({
	size = "md",
	showTagline = false,
	className = "",
}: NexhaleLogoProps) => {
	const sizeClasses = {
		sm: "text-xl",
		md: "text-3xl",
		lg: "text-5xl",
	};

	const iconSizes = {
		sm: "w-10 h-10",
		md: "w-14 h-14",
		lg: "w-20 h-20",
	};

	return (
		<div className={`flex flex-col items-center ${className}`}>
			<motion.div
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5, type: "spring" }}
				className={`${iconSizes[size]} rounded-2xl bg-gradient-to-br from-primary via-primary-glow to-accent flex items-center justify-center mb-3 neon-glow relative overflow-hidden`}
			>
				{/* Animated breath effect background */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
					initial={{ x: "-100%" }}
					animate={{ x: "100%" }}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Stylized "N" with modern design */}
				<svg
					viewBox="0 0 48 48"
					fill="none"
					className="w-3/4 h-3/4 relative z-10"
					xmlns="http://www.w3.org/2000/svg"
				>
					{/* Main "N" letter - cleaner, bolder design */}
					<motion.path
						d="M14 36V12L34 36V12"
						stroke="currentColor"
						strokeWidth="4"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-primary-foreground"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1, delay: 0.2 }}
					/>

					{/* Exhale vapor trails - more refined */}
					<motion.g className="text-primary-foreground/60">
						<motion.path
							d="M36 16C38 15 40 16 42 15"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							initial={{ opacity: 0, x: -3 }}
							animate={{ opacity: [0, 0.8, 0], x: [0, 8, 16] }}
							transition={{
								duration: 2.5,
								repeat: Infinity,
								delay: 0,
							}}
						/>
						<motion.path
							d="M36 22C38 21 40 22 42 21"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							initial={{ opacity: 0, x: -3 }}
							animate={{ opacity: [0, 1, 0], x: [0, 10, 20] }}
							transition={{
								duration: 2.5,
								repeat: Infinity,
								delay: 0.4,
							}}
						/>
						<motion.path
							d="M36 28C38 27 40 28 42 27"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							initial={{ opacity: 0, x: -3 }}
							animate={{ opacity: [0, 0.8, 0], x: [0, 8, 16] }}
							transition={{
								duration: 2.5,
								repeat: Infinity,
								delay: 0.8,
							}}
						/>
					</motion.g>
				</svg>
			</motion.div>

			<motion.h1
				initial={{ y: 10, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
				className={`font-display font-bold ${sizeClasses[size]} tracking-tight flex items-center`}
			>
				<span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
					Nex
				</span>
				<motion.span
					className="text-foreground relative"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
				>
					hale
					{/* Subtle underline accent */}
					<motion.span
						className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full"
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 0.6, duration: 0.5 }}
					/>
				</motion.span>
			</motion.h1>

			{showTagline && (
				<motion.p
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.4 }}
					className="text-muted-foreground mt-2 text-center text-sm"
				>
					Breathe awareness into every moment
				</motion.p>
			)}
		</div>
	);
};

export default NexhaleLogo;
