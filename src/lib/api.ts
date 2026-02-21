// const BASE_URL = "http://localhost:5000/api";
const BASE_URL =
	"https://existing-concerts-pro-foundation.trycloudflare.com/api";

const getHeaders = () => {
	const token = localStorage.getItem("token");
	return {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "69420",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
};

export interface AIQuitPlan {
	plan_id: number;
	target_nicotine_amount: number;
	starting_date: string;
	target_timeline_months: number;
	starting_nicotine_mg: number;
	daily_nicotine_allowance_mg: number;
	selected_brand_id: number;
	selected_brand_type: "Cigarette" | "Vape";
	current_status: string;
	cigarette_brand?: string;
	vape_brand?: string;
}

export interface AIQuitPlanStats {
	currentMonthlyIntake: number;
	targetMonthlyIntake: number;
	dailyAllowanceMg: number;
	totalNicotineAvoided: number;
	progressPercent: number;
	statusZone: "Green" | "Yellow" | "Red";
}

export const api = {
	async get(endpoint: string) {
		const res = await fetch(`${BASE_URL}${endpoint}`, {
			headers: getHeaders(),
		});
		if (!res.ok) throw await res.json();
		return res.json();
	},

	async post(endpoint: string, data: any) {
		const res = await fetch(`${BASE_URL}${endpoint}`, {
			method: "POST",
			headers: getHeaders(),
			body: JSON.stringify(data),
		});
		if (!res.ok) throw await res.json();
		return res.json();
	},

	async patch(endpoint: string, data: any) {
		const res = await fetch(`${BASE_URL}${endpoint}`, {
			method: "PATCH",
			headers: getHeaders(),
			body: JSON.stringify(data),
		});
		if (!res.ok) throw await res.json();
		return res.json();
	},

	async delete(endpoint: string) {
		const res = await fetch(`${BASE_URL}${endpoint}`, {
			method: "DELETE",
			headers: getHeaders(),
		});
		if (!res.ok) throw await res.json();
		return res.json();
	},

	// AI Quit Plan methods
	aiQuitPlan: {
		setup: (data: any) => api.post("/ai-quit-plan/setup", data),
		getDashboard: () => api.get("/ai-quit-plan/dashboard"),
		getRecommendations: (mood?: string, cravingLevel?: string) =>
			api.get(
				`/ai-quit-plan/recommendations?mood=${mood || ""}&cravingLevel=${cravingLevel || ""}`,
			),
		simulateSwitch: () => api.get("/ai-quit-plan/simulate-switch"),
	},
};
