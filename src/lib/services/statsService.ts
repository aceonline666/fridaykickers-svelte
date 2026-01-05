import { apiClient } from '$lib/api/apiClient';
import { ENDPOINTS } from '$lib/api/endpoints';
import type { PlayerStats, StatsQueryParams } from '$lib/types/api.types';

class StatsService {
	async getStats(params?: StatsQueryParams): Promise<PlayerStats[]> {
		const queryParams = new URLSearchParams();

		if (params?.active !== undefined) {
			queryParams.append('active', params.active.toString());
		}
		if (params?.filter) {
			queryParams.append('filter', params.filter);
		}
		if (params?.year !== undefined && params.year !== 'all') {
			queryParams.append('year', params.year.toString());
		}

		const endpoint = queryParams.toString()
			? `${ENDPOINTS.STATS}?${queryParams.toString()}`
			: ENDPOINTS.STATS;

		return await apiClient.get<PlayerStats[]>(endpoint);
	}
}

export const statsService = new StatsService();
