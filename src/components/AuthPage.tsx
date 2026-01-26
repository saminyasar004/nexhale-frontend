import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Eye,
	EyeOff,
	Mail,
	Lock,
	User,
	Calendar,
	Cigarette,
	ArrowLeft,
	CheckCircle,
	AlertCircle,
	KeyRound,
} from "lucide-react";
import NexhaleLogo from "./NexhaleLogo";
import { getCigaretteBrandOptions } from "@/data/cigaretteBrands";
import { api } from "@/lib/api";

interface AuthPageProps {
	onLogin: () => void;
}

const cigaretteBrandOptions = getCigaretteBrandOptions();

type AuthView =
	| "login"
	| "register"
	| "forgot-email"
	| "forgot-code"
	| "forgot-reset";

const AuthPage = ({ onLogin }: AuthPageProps) => {
	const [currentView, setCurrentView] = useState<AuthView>("login");
	const [showPassword, setShowPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		age: "",
		preferredBrand: "",
	});
	const [forgotData, setForgotData] = useState({
		email: "",
		code: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [successMessage, setSuccessMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (currentView === "register") {
			if (!formData.name) {
				newErrors.name = "Name is required";
			}
			if (!formData.age) {
				newErrors.age = "Age is required";
			} else if (parseInt(formData.age) < 15) {
				newErrors.age = "You must be 15 or older";
			}
			if (!formData.preferredBrand) {
				newErrors.preferredBrand = "Please select your preferred brand";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateForgotEmail = () => {
		const newErrors: { [key: string]: string } = {};
		if (!forgotData.email) {
			newErrors.forgotEmail = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(forgotData.email)) {
			newErrors.forgotEmail = "Please enter a valid email";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateCode = () => {
		const newErrors: { [key: string]: string } = {};
		if (!forgotData.code) {
			newErrors.code = "Verification code is required";
		} else if (forgotData.code.length !== 6) {
			newErrors.code = "Code must be 6 digits";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateNewPassword = () => {
		const newErrors: { [key: string]: string } = {};
		if (!forgotData.newPassword) {
			newErrors.newPassword = "New password is required";
		} else if (forgotData.newPassword.length < 6) {
			newErrors.newPassword = "Password must be at least 6 characters";
		}
		if (!forgotData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (forgotData.newPassword !== forgotData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForm()) {
			setIsLoading(true);
			try {
				if (currentView === "login") {
					const data = await api.post("/auth/login", {
						email: formData.email,
						password: formData.password,
					});
					localStorage.setItem("user", JSON.stringify(data));
					localStorage.setItem("token", data.token);
					onLogin();
				} else {
					const data = await api.post("/auth/register", {
						username: formData.name,
						email: formData.email,
						password: formData.password,
						// age: formData.age, // Backend doesn't support age yet but we can add it if needed
					});
					localStorage.setItem("user", JSON.stringify(data));
					localStorage.setItem("token", data.token);
					onLogin();
				}
			} catch (err: any) {
				setErrors({ submit: err.message || "Authentication failed" });
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleSendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateForgotEmail()) {
			setIsLoading(true);
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			setSuccessMessage("Verification code sent to your email!");
			setTimeout(() => {
				setSuccessMessage("");
				setCurrentView("forgot-code");
			}, 1500);
		}
	};

	const handleVerifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateCode()) {
			setIsLoading(true);
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			setSuccessMessage("Code verified successfully!");
			setTimeout(() => {
				setSuccessMessage("");
				setCurrentView("forgot-reset");
			}, 1500);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (validateNewPassword()) {
			setIsLoading(true);
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setIsLoading(false);
			setSuccessMessage("Password reset successfully! Please login.");
			setTimeout(() => {
				setSuccessMessage("");
				setForgotData({
					email: "",
					code: "",
					newPassword: "",
					confirmPassword: "",
				});
				setCurrentView("login");
			}, 2000);
		}
	};

	const renderForgotPasswordFlow = () => {
		if (currentView === "forgot-email") {
			return (
				<motion.div
					key="forgot-email"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					className="space-y-6"
				>
					<button
						onClick={() => setCurrentView("login")}
						className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Login
					</button>

					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4 neon-glow">
							<Mail className="w-8 h-8 text-primary" />
						</div>
						<h2 className="text-2xl font-display font-bold text-foreground">
							Forgot Password?
						</h2>
						<p className="text-muted-foreground mt-2">
							Enter your email and we'll send you a verification
							code
						</p>
					</div>

					<form onSubmit={handleSendCode} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-1.5">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type="email"
									placeholder="you@example.com"
									value={forgotData.email}
									onChange={(e) =>
										setForgotData({
											...forgotData,
											email: e.target.value,
										})
									}
									className={`input-field pl-12 ${errors.forgotEmail ? "border-destructive" : ""}`}
								/>
							</div>
							{errors.forgotEmail && (
								<p className="text-xs text-destructive mt-1 flex items-center gap-1">
									<AlertCircle className="w-3 h-3" />
									{errors.forgotEmail}
								</p>
							)}
						</div>

						<button
							type="submit"
							className="btn-primary w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="flex items-center justify-center gap-2">
									<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Sending...
								</span>
							) : (
								"Send Verification Code"
							)}
						</button>
					</form>
				</motion.div>
			);
		}

		if (currentView === "forgot-code") {
			return (
				<motion.div
					key="forgot-code"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					className="space-y-6"
				>
					<button
						onClick={() => setCurrentView("forgot-email")}
						className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back
					</button>

					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4 neon-glow">
							<KeyRound className="w-8 h-8 text-primary" />
						</div>
						<h2 className="text-2xl font-display font-bold text-foreground">
							Enter Verification Code
						</h2>
						<p className="text-muted-foreground mt-2">
							We sent a code to{" "}
							<span className="text-primary">
								{forgotData.email}
							</span>
						</p>
					</div>

					<form onSubmit={handleVerifyCode} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-1.5">
								6-Digit Code
							</label>
							<input
								type="text"
								maxLength={6}
								placeholder="000000"
								value={forgotData.code}
								onChange={(e) =>
									setForgotData({
										...forgotData,
										code: e.target.value.replace(/\D/g, ""),
									})
								}
								className={`input-field text-center text-2xl tracking-[0.5em] font-mono ${errors.code ? "border-destructive" : ""}`}
							/>
							{errors.code && (
								<p className="text-xs text-destructive mt-1 flex items-center gap-1">
									<AlertCircle className="w-3 h-3" />
									{errors.code}
								</p>
							)}
						</div>

						<button
							type="submit"
							className="btn-primary w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="flex items-center justify-center gap-2">
									<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Verifying...
								</span>
							) : (
								"Verify Code"
							)}
						</button>

						<p className="text-center text-sm text-muted-foreground">
							Didn't receive the code?{" "}
							<button
								type="button"
								onClick={() =>
									handleSendCode({
										preventDefault: () => {},
									} as React.FormEvent)
								}
								className="text-primary hover:underline"
							>
								Resend
							</button>
						</p>
					</form>
				</motion.div>
			);
		}

		if (currentView === "forgot-reset") {
			return (
				<motion.div
					key="forgot-reset"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					className="space-y-6"
				>
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4 neon-glow">
							<Lock className="w-8 h-8 text-primary" />
						</div>
						<h2 className="text-2xl font-display font-bold text-foreground">
							Reset Password
						</h2>
						<p className="text-muted-foreground mt-2">
							Create a new secure password
						</p>
					</div>

					<form onSubmit={handleResetPassword} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-1.5">
								New Password
							</label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type={showNewPassword ? "text" : "password"}
									placeholder="••••••••"
									value={forgotData.newPassword}
									onChange={(e) =>
										setForgotData({
											...forgotData,
											newPassword: e.target.value,
										})
									}
									className={`input-field pl-12 pr-12 ${errors.newPassword ? "border-destructive" : ""}`}
								/>
								<button
									type="button"
									onClick={() =>
										setShowNewPassword(!showNewPassword)
									}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showNewPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
							{errors.newPassword && (
								<p className="text-xs text-destructive mt-1 flex items-center gap-1">
									<AlertCircle className="w-3 h-3" />
									{errors.newPassword}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-1.5">
								Confirm Password
							</label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type={
										showConfirmPassword
											? "text"
											: "password"
									}
									placeholder="••••••••"
									value={forgotData.confirmPassword}
									onChange={(e) =>
										setForgotData({
											...forgotData,
											confirmPassword: e.target.value,
										})
									}
									className={`input-field pl-12 pr-12 ${errors.confirmPassword ? "border-destructive" : ""}`}
								/>
								<button
									type="button"
									onClick={() =>
										setShowConfirmPassword(
											!showConfirmPassword,
										)
									}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									{showConfirmPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="text-xs text-destructive mt-1 flex items-center gap-1">
									<AlertCircle className="w-3 h-3" />
									{errors.confirmPassword}
								</p>
							)}
						</div>

						<button
							type="submit"
							className="btn-primary w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<span className="flex items-center justify-center gap-2">
									<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Resetting...
								</span>
							) : (
								"Reset Password"
							)}
						</button>
					</form>
				</motion.div>
			);
		}

		return null;
	};

	const renderAuthForm = () => (
		<motion.div
			key="auth-form"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
		>
			<NexhaleLogo size="md" showTagline={true} />

			<div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
				<button
					onClick={() => setCurrentView("login")}
					className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
						currentView === "login"
							? "bg-card text-foreground shadow-sm neon-glow"
							: "text-muted-foreground"
					}`}
				>
					Login
				</button>
				<button
					onClick={() => setCurrentView("register")}
					className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
						currentView === "register"
							? "bg-card text-foreground shadow-sm neon-glow"
							: "text-muted-foreground"
					}`}
				>
					Register
				</button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				{currentView === "register" && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="space-y-4"
					>
						<div>
							<label className="block text-sm font-medium text-foreground mb-1.5">
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type="text"
									placeholder="John Doe"
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									className={`input-field pl-12 ${errors.name ? "border-destructive" : ""}`}
								/>
							</div>
							{errors.name && (
								<p className="text-xs text-destructive mt-1">
									{errors.name}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-1.5">
								Age
							</label>
							<div className="relative">
								<Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<input
									type="number"
									placeholder="25"
									min="15"
									max="100"
									value={formData.age}
									onChange={(e) =>
										setFormData({
											...formData,
											age: e.target.value,
										})
									}
									className={`input-field pl-12 ${errors.age ? "border-destructive" : ""}`}
								/>
							</div>
							{errors.age && (
								<p className="text-xs text-destructive mt-1">
									{errors.age}
								</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-1.5">
								<Cigarette className="inline w-4 h-4 mr-1" />
								Preferred Cigarette Brand
							</label>
							<select
								value={formData.preferredBrand}
								onChange={(e) =>
									setFormData({
										...formData,
										preferredBrand: e.target.value,
									})
								}
								className={`input-field ${errors.preferredBrand ? "border-destructive" : ""}`}
							>
								<option value="">Select your brand</option>
								{cigaretteBrandOptions.map((brand) => (
									<option key={brand} value={brand}>
										{brand}
									</option>
								))}
							</select>
							{errors.preferredBrand && (
								<p className="text-xs text-destructive mt-1">
									{errors.preferredBrand}
								</p>
							)}
						</div>
					</motion.div>
				)}

				<div>
					<label className="block text-sm font-medium text-foreground mb-1.5">
						Email
					</label>
					<div className="relative">
						<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={(e) =>
								setFormData({
									...formData,
									email: e.target.value,
								})
							}
							className={`input-field pl-12 ${errors.email ? "border-destructive" : ""}`}
						/>
					</div>
					{errors.email && (
						<p className="text-xs text-destructive mt-1">
							{errors.email}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-foreground mb-1.5">
						Password
					</label>
					<div className="relative">
						<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							value={formData.password}
							onChange={(e) =>
								setFormData({
									...formData,
									password: e.target.value,
								})
							}
							className={`input-field pl-12 pr-12 ${errors.password ? "border-destructive" : ""}`}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						>
							{showPassword ? (
								<EyeOff className="w-5 h-5" />
							) : (
								<Eye className="w-5 h-5" />
							)}
						</button>
					</div>
					{errors.password && (
						<p className="text-xs text-destructive mt-1">
							{errors.password}
						</p>
					)}
				</div>

				{errors.submit && (
					<p className="text-sm text-destructive text-center">
						{errors.submit}
					</p>
				)}
				<button
					type="submit"
					className="btn-primary w-full mt-6"
					disabled={isLoading}
				>
					{isLoading
						? "Please wait..."
						: currentView === "login"
							? "Sign In"
							: "Create Account"}
				</button>
			</form>

			{currentView === "login" && (
				<p className="text-center text-sm text-muted-foreground mt-4">
					<button
						onClick={() => setCurrentView("forgot-email")}
						className="text-primary hover:underline"
					>
						Forgot password?
					</button>
				</p>
			)}
		</motion.div>
	);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse-soft" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md relative"
			>
				<div className="glass-card rounded-3xl p-8">
					{/* Success Message */}
					<AnimatePresence>
						{successMessage && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="mb-6 p-4 rounded-xl bg-success/20 border border-success/30 flex items-center gap-3"
							>
								<CheckCircle className="w-5 h-5 text-success" />
								<p className="text-sm text-success">
									{successMessage}
								</p>
							</motion.div>
						)}
					</AnimatePresence>

					<AnimatePresence mode="wait">
						{currentView === "login" || currentView === "register"
							? renderAuthForm()
							: renderForgotPasswordFlow()}
					</AnimatePresence>
				</div>
			</motion.div>
		</div>
	);
};

export default AuthPage;
