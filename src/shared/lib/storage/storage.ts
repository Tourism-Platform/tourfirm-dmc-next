import { ENUM_LOCAL_STORAGE } from "@/shared/config/constants/local-storage.config";

function isBrowser(): boolean {
	return typeof window !== "undefined";
}

export const storage = {
	get<T>(key: string, fallback: T): T {
		if (!isBrowser()) {
			return fallback;
		}

		try {
			const raw = window.localStorage.getItem(key);

			if (raw === null) {
				return fallback;
			}

			return JSON.parse(raw) as T;
		} catch {
			return fallback;
		}
	},
	set<T>(key: string, value: T): void {
		if (!isBrowser()) {
			return;
		}

		window.localStorage.setItem(key, JSON.stringify(value));
	},
	remove(key: string): void {
		if (!isBrowser()) {
			return;
		}

		window.localStorage.removeItem(key);
	}
};

export { ENUM_LOCAL_STORAGE };
