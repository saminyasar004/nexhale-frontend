import { motion } from "framer-motion";
import { Heart, Gift, Coffee, DollarSign } from "lucide-react";

interface DonationPageProps {
	onBack: () => void;
}

const DonationPage = ({ onBack }: DonationPageProps) => {
	return (
		<div className="min-h-screen bg-background">
			<header className="sticky top-0 z-50 glass-card border-b border-border/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between h-16">
						<button
							onClick={onBack}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							← Back
						</button>
						<h1 className="font-display font-bold text-lg gradient-text">
							Support Us
						</h1>
						<div className="w-12" />
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="glass-card rounded-2xl p-8 text-center"
				>
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
						<Heart className="w-10 h-10 text-primary" />
					</div>
					<h2 className="font-display font-bold text-2xl text-foreground mb-4">
						Coming Soon
					</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-8">
						We're working on adding donation options to support the
						development of Nexhale and help more people track their
						journey to a healthier lifestyle.
					</p>

					<div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
						<div className="p-4 bg-muted/50 rounded-xl">
							<Coffee className="w-8 h-8 text-warning mx-auto mb-2" />
							<p className="text-sm text-muted-foreground">
								Buy us a coffee
							</p>
						</div>
						<div className="p-4 bg-muted/50 rounded-xl">
							<Gift className="w-8 h-8 text-primary mx-auto mb-2" />
							<p className="text-sm text-muted-foreground">
								One-time gift
							</p>
						</div>
						<div className="p-4 bg-muted/50 rounded-xl">
							<DollarSign className="w-8 h-8 text-success mx-auto mb-2" />
							<p className="text-sm text-muted-foreground">
								Monthly support
							</p>
						</div>
					</div>

					<button
						className="btn-primary mt-8 opacity-50 cursor-not-allowed"
						disabled
					>
						Donation Options Coming Soon
					</button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="glass-card rounded-2xl p-6"
				>
					<h3 className="font-display font-semibold text-foreground mb-4">
						💚 Why Support Nexhale?
					</h3>
					<ul className="space-y-3 text-sm text-muted-foreground">
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							Help us maintain and improve the app
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							Support development of new features
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							Keep the app free for everyone
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary">•</span>
							Fund awareness campaigns about smoking
						</li>
					</ul>
				</motion.div>
			</main>
		</div>
	);
};

export default DonationPage;
