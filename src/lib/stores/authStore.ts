import { writable } from 'svelte/store';
import { storage } from '$lib/storage/localStorage';

interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
	isLoading: boolean;
}

function createAuthStore() {
	const initialState: AuthState = {
		isAuthenticated: false,
		token: null,
		isLoading: false,
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
			}));
		},

		// Clear authenticated state
		logout: () => {
			storage.removeToken();
			set({
				isAuthenticated: false,
				token: null,
				isLoading: false,
			});
		},

		// Set loading state
		setLoading: (isLoading: boolean) => {
			update(state => ({ ...state, isLoading }));
		},
	};
}

export const authStore = createAuthStore();
