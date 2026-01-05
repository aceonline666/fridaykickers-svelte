import { writable } from 'svelte/store';
import { statsService } from '$lib/services/statsService';
import { toastStore } from '$lib/stores/toastStore';
import type { PlayerStats } from '$lib/types/api.types';

interface StatsState {
	stats: PlayerStats[];
	isLoading: boolean;
	filter: {
		active: boolean;
		search: string;
		year: number | 'all';
	};
	availableYears: number[];
}

function createStatsStore() {
	const currentYear = new Date().getFullYear();
	const years: number[] = [];
	for (let year = currentYear - 1; year >= 2013; year--) {
		years.push(year);
	}

	const initialState: StatsState = {
		stats: [],
		isLoading: false,
		filter: {
			active: false,
			search: '',
			year: 'all',
		},
		availableYears: years,
	};

	const { subscribe, set, update } = writable<StatsState>(initialState);

	return {
		subscribe,

		async loadStats() {
			update(state => ({ ...state, isLoading: true }));

			try {
				let currentActiveFilter: boolean = initialState.filter.active;
				let currentSearchFilter: string = initialState.filter.search;
				let currentYearFilter: number | 'all' = initialState.filter.year;

				update(state => {
					currentActiveFilter = state.filter.active;
					currentSearchFilter = state.filter.search;
					currentYearFilter = state.filter.year;
					return state;
				});

				const stats = await statsService.getStats({
					active: currentActiveFilter,
					filter: currentSearchFilter,
					year: currentYearFilter,
				});

				update(state => ({
					...state,
					stats: stats || [],
					isLoading: false,
				}));
			} catch (error: any) {
				console.error('Failed to load statistics:', error);
				toastStore.error(error.message || 'Fehler beim Laden der Statistiken');
				update(state => ({ ...state, stats: [], isLoading: false }));
			}
		},

		async setSearchFilter(search: string) {
			update(state => ({
				...state,
				filter: { ...state.filter, search },
			}));

			await this.loadStats();
		},

		async toggleActiveFilter() {
			update(state => ({
				...state,
				filter: { ...state.filter, active: !state.filter.active },
			}));

			await this.loadStats();
		},

		async setYearFilter(year: number | 'all') {
			update(state => ({
				...state,
				filter: { ...state.filter, year },
			}));

			await this.loadStats();
		},
	};
}

export const statsStore = createStatsStore();
