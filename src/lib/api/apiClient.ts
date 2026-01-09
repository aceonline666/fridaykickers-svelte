import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import { storage } from '$lib/storage/localStorage';
import { base } from '$app/paths';

// API base URL - use environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fridaykickers-zhg62jfgha-ey.a.run.app';

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: API_BASE_URL,
			headers: {
				'Content-Type': 'application/json',
			},
			// Don't use withCredentials when backend CORS allows all origins
			// withCredentials: true,
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request interceptor - Add Bearer token
		this.client.interceptors.request.use(
			(config) => {
				const token = storage.getToken();
				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		// Response interceptor - Handle errors
		this.client.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				if (error.response?.status === 401) {
					// Unauthorized - clear token and redirect to login
					storage.removeToken();
					if (typeof window !== 'undefined') {
						window.location.href = base + '/login';
					}
				}

				return Promise.reject(this.normalizeError(error));
			}
		);
	}

	private normalizeError(error: AxiosError): Error {
		if (error.response) {
			// Server responded with error status
			const message = (error.response.data as any)?.message || error.message;
			return new Error(message);
		} else if (error.request) {
			// Request made but no response
			return new Error('Keine Antwort vom Server. Bitte überprüfen Sie Ihre Internetverbindung.');
		} else {
			// Something else happened
			return new Error(error.message || 'Ein unbekannter Fehler ist aufgetreten');
		}
	}

	async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.get<T>(endpoint, config);
		return response.data;
	}

	async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.post<T>(endpoint, data, config);
		return response.data;
	}

	async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.put<T>(endpoint, data, config);
		return response.data;
	}

	async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.delete<T>(endpoint, config);
		return response.data;
	}
}

// Export singleton instance
export const apiClient = new ApiClient();
