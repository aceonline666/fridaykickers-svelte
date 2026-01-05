import { writable } from 'svelte/store';
import { matchService } from '$lib/services/matchService';
import { toastStore } from '$lib/stores/toastStore';
import type { Match, Team } from '$lib/types/api.types';

interface TournamentState {
	matches: Match[];
	standings: Team[];
	isLoading: boolean;
	isSaving: boolean;
}

function createTournamentStore() {
	const initialState: TournamentState = {
		matches: [],
		standings: [],
		isLoading: false,
		isSaving: false,
	};

	const { subscribe, set, update } = writable<TournamentState>(initialState);

	return {
		subscribe,

		async loadMatches() {
			update(state => ({ ...state, isLoading: true }));

			try {
				const matches = await matchService.getMatches({
					tournament: true,
					limit: 6,
				});

				update(state => ({
					...state,
					matches,
					isLoading: false,
				}));
			} catch (error: any) {
				console.error('Failed to load tournament matches:', error);
				toastStore.error(error.message || 'Fehler beim Laden der Turnier-Spiele');
				update(state => ({ ...state, isLoading: false }));
			}
		},

		async loadStandings() {
			update(state => ({ ...state, isLoading: true }));

			try {
				const standings = await matchService.getStandings({
					tournament: true,
					limit: 6,
				});

				update(state => ({
					...state,
					standings,
					isLoading: false,
				}));
			} catch (error: any) {
				console.error('Failed to load tournament standings:', error);
				toastStore.error(error.message || 'Fehler beim Laden der Turnier-Tabelle');
				update(state => ({ ...state, isLoading: false }));
			}
		},

		async saveTournament(matches: Array<{
			homeTeam: string;
			awayTeam: string;
			homeGoals: number;
			awayGoals: number;
		}>) {
			update(state => ({ ...state, isSaving: true }));

			try {
				await matchService.saveTournament(matches);

				toastStore.success('Turnier erfolgreich gespeichert!');

				// Reload matches and standings
				await this.loadMatches();
				await this.loadStandings();

				update(state => ({ ...state, isSaving: false }));
			} catch (error: any) {
				console.error('Failed to save tournament:', error);
				toastStore.error(error.message || 'Fehler beim Speichern des Turniers');
				update(state => ({ ...state, isSaving: false }));
				throw error;
			}
		},
	};
}

export const tournamentStore = createTournamentStore();
