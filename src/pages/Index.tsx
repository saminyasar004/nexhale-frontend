import { useState, useEffect } from "react";
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";

const Index = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
		setIsLoading(false);
	}, []);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const handleLogout = () => {
		setIsLoggedIn(false);
	};

	if (isLoading) return null;

	return (
		<div className="min-h-screen bg-background text-foreground">
			{isLoggedIn ? (
				<Dashboard onLogout={handleLogout} />
			) : (
				<AuthPage onLogin={handleLogin} />
			)}
		</div>
	);
};

export default Index;
