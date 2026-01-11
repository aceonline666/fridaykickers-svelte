import { apiClient } from '$lib/api/apiClient';
import { ENDPOINTS } from '$lib/api/endpoints';
import type { Match, Team, MatchQueryParams, TableauxQueryParams } from '$lib/types/api.types';

class MatchService {
	async getMatches(params?: MatchQueryParams): Promise<Match[]> {
		const queryParams = new URLSearchParams();

		// Send tournament parameter explicitly - backend needs the value
		if (params?.tournament !== undefined) {
			queryParams.append('tournament', params.tournament ? 'true' : 'false');
		}
		if (params?.limit) {
			queryParams.append('limit', params.limit.toString());
		}

		const endpoint = queryParams.toString()
			? `${ENDPOINTS.MATCHES}?${queryParams.toString()}`
			: ENDPOINTS.MATCHES;

		return await apiClient.get<Match[]>(endpoint);
	}

	async saveMatch(oldGoals: number, youngGoals: number): Promise<void> {
		return await apiClient.post<void>(ENDPOINTS.MATCHES, {
			oldGoals,
			youngGoals,
		});
	}

	async getStandings(params?: TableauxQueryParams): Promise<Team[]> {
		const queryParams = new URLSearchParams();

		// Send tournament parameter explicitly - backend needs the value
		if (params?.tournament !== undefined) {
			queryParams.append('tournament', params.tournament ? 'true' : 'false');
		}
		if (params?.year !== undefined && params.year !== 'all') {
			queryParams.append('year', params.year.toString());
		}
		if (params?.limit) {
			queryParams.append('limit', params.limit.toString());
		}

		const endpoint = queryParams.toString()
			? `${ENDPOINTS.MATCH_TABLEAUX}?${queryParams.toString()}`
			: ENDPOINTS.MATCH_TABLEAUX;

		return await apiClient.get<Team[]>(endpoint);
	}

	async saveTournament(matches: Array<{
		homeTeam: string;
		awayTeam: string;
		homeGoals: number;
		awayGoals: number;
	}>): Promise<void> {
		return await apiClient.post<void>(ENDPOINTS.MATCH_TOURNAMENT, matches);
	}
}

export const matchService = new MatchService();
