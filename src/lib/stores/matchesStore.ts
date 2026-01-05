import { writable } from 'svelte/store';
import { matchService } from '$lib/services/matchService';
import { toastStore } from '$lib/stores/toastStore';
import type { Match, Team } from '$lib/types/api.types';

interface MatchesState {
	matches: Match[];
	standings: Team[];
	selectedYear: number | 'all';
	availableYears: number[];
	isLoading: boolean;
	isSaving: boolean;
}

function createMatchesStore() {
	const currentYear = new Date().getFullYear();
	const initialState: MatchesState = {
		matches: [],
		standings: [],
		selectedYear: currentYear,
		availableYears: [],
		isLoading: false,
		isSaving: false,
	};

	const { subscribe, set, update } = writable<MatchesState>(initialState);

	// Generate years from 2013 to current year
	function generateYears(): number[] {
		const years: number[] = [];
		for (let year = currentYear; year >= 2013; year--) {
			years.push(year);
		}
		return years;
	}

	return {
		subscribe,

		async loadMatches(limit = 5) {
			update(state => ({ ...state, isLoading: true }));

			try {
				const matches = await matchService.getMatches({
					tournament: false,
					limit
				});

				update(state => ({
					...state,
					matches,
					isLoading: false,
				}));
			} catch (error: any) {
				console.error('Failed to load matches:', error);
				toastStore.error(error.message || 'Fehler beim Laden der Spiele');
				update(state => ({ ...state, isLoading: false }));
			}
		},

		async loadStandings(year: number | 'all' = currentYear) {
			update(state => ({ ...state, isLoading: true, selectedYear: year }));

			try {
				const standings = await matchService.getStandings({
					tournament: false,
					year: year === 'all' ? undefined : year,
				});

				update(state => ({
					...state,
					standings,
					availableYears: generateYears(),
					isLoading: false,
				}));
			} catch (error: any) {
				console.error('Failed to load standings:', error);
				toastStore.error(error.message || 'Fehler beim Laden der Tabelle');
				update(state => ({ ...state, isLoading: false }));
			}
		},

		async saveMatch(oldGoals: number, youngGoals: number) {
			update(state => ({ ...state, isSaving: true }));

			try {
				await matchService.saveMatch(oldGoals, youngGoals);

				toastStore.success('Spiel erfolgreich gespeichert!');

				// Reload matches and standings
				await this.loadMatches();

				let currentYear: number | 'all' = new Date().getFullYear();
				update(state => {
					currentYear = state.selectedYear;
					return { ...state, isSaving: false };
				});

				await this.loadStandings(currentYear);
			} catch (error: any) {
				console.error('Failed to save match:', error);
				toastStore.error(error.message || 'Fehler beim Speichern des Spiels');
				update(state => ({ ...state, isSaving: false }));
				throw error;
			}
		},

		async changeYear(year: number | 'all') {
			await this.loadStandings(year);
		},
	};
}

export const matchesStore = createMatchesStore();
