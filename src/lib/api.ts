const BASE_URL = "http://localhost:5000/api";

const getHeaders = () => {
	const token = localStorage.getItem("token");
	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
};

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
};
