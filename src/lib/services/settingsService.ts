import { apiClient } from '$lib/api/apiClient';
import { ENDPOINTS } from '$lib/api/endpoints';
import type { Settings, UpdateSettingsRequest } from '$lib/types/api.types';

class SettingsService {
	async getSettings(): Promise<Settings> {
		return await apiClient.get<Settings>(ENDPOINTS.SETTINGS);
	}

	async updateSettings(settings: UpdateSettingsRequest): Promise<void> {
		return await apiClient.post<void>(ENDPOINTS.SETTINGS, settings);
	}
}

export const settingsService = new SettingsService();
