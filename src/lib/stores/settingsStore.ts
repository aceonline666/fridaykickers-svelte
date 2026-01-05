import { writable } from 'svelte/store';
import { settingsService } from '$lib/services/settingsService';
import { toastStore } from '$lib/stores/toastStore';
import type { Settings } from '$lib/types/api.types';

interface SettingsState {
	settings: Settings;
	isLoading: boolean;
	isSaving: boolean;
}

function createSettingsStore() {
	const initialState: SettingsState = {
		settings: {
			beerPrice: 1.0,
		},
		isLoading: false,
		isSaving: false,
	};

	const { subscribe, set, update } = writable<SettingsState>(initialState);

	return {
		subscribe,

		async loadSettings() {
			update(state => ({ ...state, isLoading: true }));

			try {
				const settings = await settingsService.getSettings();

				update(state => ({
					...state,
					settings,
					isLoading: false,
				}));
			} catch (error: any) {
				console.error('Failed to load settings:', error);
				toastStore.error(error.message || 'Fehler beim Laden der Einstellungen');
				update(state => ({ ...state, isLoading: false }));
			}
		},

		async updateBeerPrice(beerPrice: number) {
			update(state => ({ ...state, isSaving: true }));

			try {
				await settingsService.updateSettings({ beerPrice });

				update(state => ({
					...state,
					settings: { ...state.settings, beerPrice },
					isSaving: false,
				}));

				toastStore.success('Einstellungen erfolgreich gespeichert!');
			} catch (error: any) {
				console.error('Failed to update settings:', error);
				toastStore.error(error.message || 'Fehler beim Speichern der Einstellungen');
				update(state => ({ ...state, isSaving: false }));
				throw error;
			}
		},
	};
}

export const settingsStore = createSettingsStore();
