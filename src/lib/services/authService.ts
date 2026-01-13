import { apiClient } from '$lib/api/apiClient';
import { ENDPOINTS } from '$lib/api/endpoints';
import { authStore } from '$lib/stores/authStore';
import type { LoginResponse } from '$lib/types/api.types';

class AuthService {
	async login(email: string, password: string): Promise<void> {
		authStore.setLoading(true);

		try {
			// Backend expects multipart/form-data
			const formData = new FormData();
			formData.append('email', email);
			formData.append('password', password);

			const response = await apiClient.post<LoginResponse>(
				ENDPOINTS.LOGIN,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.token) {
				authStore.login(response.token);
			} else {
				throw new Error('Kein Token in der Antwort erhalten');
			}
		} catch (error) {
			authStore.setLoading(false);
			throw error;
		} finally {
			authStore.setLoading(false);
		}
	}

	async logout(): Promise<void> {
		try {
			await apiClient.get(ENDPOINTS.LOGOUT);
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			authStore.logout();
		}
	}

	validateToken(): boolean {
		// Simple token existence check
		// In a real app, you might want to verify token expiration
		const token = authStore;
		let isValid = false;

		token.subscribe(state => {
			isValid = state.isAuthenticated && !!state.token;
		})();

		return isValid;
	}
}

export const authService = new AuthService();
