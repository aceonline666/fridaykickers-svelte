import { writable } from 'svelte/store';
import { storage } from '$lib/storage/localStorage';

interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
	isLoading: boolean;
	initialized: boolean;
}

function createAuthStore() {
	const initialState: AuthState = {
		isAuthenticated: false,
		token: null,
		isLoading: false,
		initialized: false,
	};

	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,

		// Initialize auth from localStorage
		initialize: () => {
			const token = storage.getToken();
			if (token) {
				update(state => ({
					...state,
					isAuthenticated: true,
					token,
					initialized: true,
				}));
			} else {
				update(state => ({
					...state,
					initialized: true,
				}));
			}
		},

		// Set authenticated state with token
		login: (token: string) => {
			storage.setToken(token);
			update(state => ({
				...state,
				isAuthenticated: true,
				token,
				initialized: true,
			}));
		},

		// Clear authenticated state
		logout: () => {
			storage.removeToken();
			set({
				isAuthenticated: false,
				token: null,
				isLoading: false,
				initialized: true,
			});
		},

		// Set loading state
		setLoading: (isLoading: boolean) => {
			update(state => ({ ...state, isLoading }));
		},
	};
}

export const authStore = createAuthStore();
