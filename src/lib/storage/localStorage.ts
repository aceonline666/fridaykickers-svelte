// Browser storage abstraction with SSR safety

const TOKEN_KEY = 'authToken';

class LocalStorage {
	private isAvailable(): boolean {
		return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
	}

	setToken(token: string): void {
		if (this.isAvailable()) {
			window.localStorage.setItem(TOKEN_KEY, token);
		}
	}

	getToken(): string | null {
		if (this.isAvailable()) {
			return window.localStorage.getItem(TOKEN_KEY);
		}
		return null;
	}

	removeToken(): void {
		if (this.isAvailable()) {
			window.localStorage.removeItem(TOKEN_KEY);
		}
	}

	setItem<T>(key: string, value: T): void {
		if (this.isAvailable()) {
			window.localStorage.setItem(key, JSON.stringify(value));
		}
	}

	getItem<T>(key: string): T | null {
		if (this.isAvailable()) {
			const item = window.localStorage.getItem(key);
			if (item) {
				try {
					return JSON.parse(item) as T;
				} catch {
					return null;
				}
			}
		}
		return null;
	}

	removeItem(key: string): void {
		if (this.isAvailable()) {
			window.localStorage.removeItem(key);
		}
	}

	clear(): void {
		if (this.isAvailable()) {
			window.localStorage.clear();
		}
	}
}

export const storage = new LocalStorage();
