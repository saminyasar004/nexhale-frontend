import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	User,
	Mail,
	Lock,
	Eye,
	EyeOff,
	Cigarette,
	Wind,
	Check,
	Save,
	AlertCircle,
	Shield,
	Droplets,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { getCigaretteBrandOptions } from "@/data/cigaretteBrands";

interface ProfilePageProps {
	onBack: () => void;
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

const ProfilePage = ({ onBack }: ProfilePageProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showEmailPassword, setShowEmailPassword] = useState(false);
	const [saved, setSaved] = useState(false);
	const [emailSaved, setEmailSaved] = useState(false);
	const [profile, setProfile] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [passData, setPassData] = useState({
		currentPassword: "",
		newPassword: "",
	});
	const [emailData, setEmailData] = useState({
		oldEmail: "",
		password: "",
		newEmail: "",
	});
	const [isLoading, setIsLoading] = useState(true);

	const cigaretteBrandOptions = getCigaretteBrandOptions();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const data = await api.get("/user/profile");
				setProfile(data);
			} catch (err: any) {
				console.error(err);
				setError(
					err.message ||
						"Failed to load profile. Please login again.",
				);
			} finally {
				setIsLoading(false);
			}
		};
		fetchProfile();
	}, []);

	const handleUpdateProfile = async () => {
		if (!profile) return;
		try {
			await api.patch("/user/profile", {
				username: profile.user_name,
				preferredBrand: profile.preferred_brand,
				preferredVapeFlavor: profile.preferred_vape_flavor,
				preferredVapeLiquidAmount: profile.preferred_vape_liquid_amount,
			});
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} catch (err) {
			console.error(err);
		}
	};

	const handleChangeEmail = async () => {
		try {
			await api.post("/user/change-email", {
				newEmail: emailData.newEmail,
				password: emailData.password,
			});
			if (profile) {
				setProfile({ ...profile, email: emailData.newEmail });
			}
			setEmailSaved(true);
			setTimeout(() => setEmailSaved(false), 2000);
		} catch (err) {
			console.error(err);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.reload();
	};

	if (isLoading)
		return (
			<div className="min-h-screen flex items-center justify-center font-display text-primary">
				Loading Profile...
			</div>
		);

	if (error || !profile) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center p-4">
				<div className="glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6">
					<div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
						<AlertCircle className="w-10 h-10 text-destructive" />
					</div>
					<h2 className="text-xl font-bold text-foreground">
						Session Error
					</h2>
					<p className="text-muted-foreground">
						{error || "Your active session is no longer valid."}
					</p>
					<button
						onClick={handleLogout}
						className="btn-primary w-full"
					>
						Logout & Re-login
					</button>
					<button
						onClick={onBack}
						className="text-sm text-muted-foreground hover:underline"
					>
						Return to Dashboard
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background font-sans pb-20">
			<header className="sticky top-0 z-50 glass-card border-b border-border/50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6">
					<div className="flex items-center justify-between h-16">
						<button
							onClick={onBack}
							className="text-muted-foreground hover:text-foreground transition-colors"
						>
							← Back
						</button>
						<h1 className="font-display font-bold text-lg text-primary">
							Nexhale Profile
						</h1>
						<div className="w-12" />
					</div>
				</div>
			</header>

			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
				<div className="glass-card rounded-2xl p-6 flex items-center gap-4">
					<div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center neon-glow">
						<span className="text-3xl font-bold text-primary">
							{(profile.user_name || "U").charAt(0).toUpperCase()}
						</span>
					</div>
					<div>
						<h2 className="font-bold text-xl">
							{profile.user_name}
						</h2>
						<p className="text-sm text-muted-foreground">
							{profile.email}
						</p>
					</div>
				</div>

				<div className="glass-card rounded-2xl p-6 space-y-4">
					<h3 className="font-semibold flex items-center gap-2 text-foreground">
						<User className="w-5 h-5 text-primary" /> Edit Profile
					</h3>

					<div className="space-y-4">
						<div>
							<label className="text-sm mb-1.5 block text-muted-foreground">
								Username
							</label>
							<input
								className="input-field"
								value={profile.user_name}
								onChange={(e) =>
									setProfile({
										...profile,
										user_name: e.target.value,
									})
								}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm mb-1.5 block text-muted-foreground">
									<Cigarette className="inline w-3 h-3 mr-1" />
									Preferred Brand
								</label>
								<select
									value={profile.preferred_brand || ""}
									onChange={(e) =>
										setProfile({
											...profile,
											preferred_brand: e.target.value,
										})
									}
									className="input-field"
								>
									<option value="">Select your brand</option>
									{cigaretteBrandOptions.map((brand) => (
										<option key={brand} value={brand}>
											{brand}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="text-sm mb-1.5 block text-muted-foreground">
									<Wind className="inline w-3 h-3 mr-1" />
									Preferred Vape Flavor
								</label>
								<select
									value={profile.preferred_vape_flavor || ""}
									onChange={(e) =>
										setProfile({
											...profile,
											preferred_vape_flavor:
												e.target.value,
										})
									}
									className="input-field"
								>
									<option value="">Select your flavor</option>
									{vapeFlavors.map((flavor) => (
										<option key={flavor} value={flavor}>
											{flavor}
										</option>
									))}
								</select>
							</div>

							<div className="md:col-span-2">
								<label className="text-sm mb-1.5 block text-muted-foreground">
									<Droplets className="inline w-3 h-3 mr-1" />
									Preferred Vape E-Liquid Amount (ml)
								</label>
								<input
									className="input-field"
									placeholder="e.g. 2.0"
									value={
										profile.preferred_vape_liquid_amount ||
										""
									}
									onChange={(e) =>
										setProfile({
											...profile,
											preferred_vape_liquid_amount:
												e.target.value.replace(
													/[^0-9.]/g,
													"",
												),
										})
									}
								/>
							</div>
						</div>
					</div>

					<button
						onClick={handleUpdateProfile}
						className="btn-primary w-full flex items-center justify-center gap-2"
					>
						{saved ? (
							<>
								<Check className="w-5 h-5" /> Saved!
							</>
						) : (
							<>
								<Save className="w-5 h-5" /> Save Changes
							</>
						)}
					</button>
				</div>

				<div className="glass-card rounded-2xl p-6 space-y-4">
					<h3 className="font-semibold flex items-center gap-2 text-foreground">
						<Mail className="w-5 h-5 text-primary" /> Update Email
					</h3>
					{emailSaved && (
						<p className="text-success text-sm font-medium">
							Email updated!
						</p>
					)}
					<div className="space-y-3">
						<input
							placeholder="New Email"
							className="input-field"
							value={emailData.newEmail}
							onChange={(e) =>
								setEmailData({
									...emailData,
									newEmail: e.target.value,
								})
							}
						/>
						<input
							placeholder="Verify Password"
							type="password"
							className="input-field"
							value={emailData.password}
							onChange={(e) =>
								setEmailData({
									...emailData,
									password: e.target.value,
								})
							}
						/>
					</div>
					<button
						onClick={handleChangeEmail}
						className="btn-secondary w-full"
					>
						Update Email
					</button>
				</div>
			</main>
		</div>
	);
};

export default ProfilePage;
