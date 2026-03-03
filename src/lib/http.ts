import { useAppStore } from "@/store";
import type { User } from "./types";

const BASE_URL = "/api";

export function getToken(): User | null {
	const raw = sessionStorage.getItem("token");
	if (!raw) return null;
	return JSON.parse(raw) as User;
}

export function setToken(user: User): void {
	sessionStorage.setItem("token", JSON.stringify(user));
}

export function removeToken(): void {
	sessionStorage.removeItem("token");
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
	const { setLoading } = useAppStore.getState();
	setLoading(true);
	try {
		const res = await fetch(`${BASE_URL}${url}`, {
			headers: {
				"Content-Type": "application/json",
			},
			...options,
		});
		if (!res.ok) {
			throw new Error(`HTTP ${res.status}: ${res.statusText}`);
		}
		const data = (await res.json()) as T;
		return data;
	} finally {
		setLoading(false);
	}
}

export const http = {
	get<T>(url: string): Promise<T> {
		return request<T>(url);
	},
	post<T>(url: string, body: unknown): Promise<T> {
		return request<T>(url, {
			method: "POST",
			body: JSON.stringify(body),
		});
	},
	patch<T>(url: string, body: unknown): Promise<T> {
		return request<T>(url, {
			method: "PATCH",
			body: JSON.stringify(body),
		});
	},
	delete<T>(url: string): Promise<T> {
		return request<T>(url, { method: "DELETE" });
	},
};
