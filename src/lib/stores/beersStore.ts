import { writable } from 'svelte/store';
import { userService } from '$lib/services/userService';
import { toastStore } from '$lib/stores/toastStore';
import type { User } from '$lib/types/api.types';

interface BeersState {
	users: User[];
	isLoading: boolean;
	filter: {
		active: boolean;
		search: string;
	};
}

function createBeersStore() {
	const initialState: BeersState = {
		users: [],
		isLoading: false,
		filter: {
			active: true,
			search: '',
		},
	};

	const { subscribe, set, update } = writable<BeersState>(initialState);

	return {
		subscribe,

		async loadUsers() {
			update(state => ({ ...state, isLoading: true }));

			try {
				let currentActiveFilter: boolean = initialState.filter.active;
				let currentSearchFilter: string = initialState.filter.search;
				update(state => {
					currentActiveFilter = state.filter.active;
					currentSearchFilter = state.filter.search;
					return state;
				});

				const users = await userService.getUsers({
					active: currentActiveFilter,
					filter: currentSearchFilter,
				});

				update(state => ({
					...state,
					users: users || [],
					isLoading: false,
				}));
			} catch (error: any) {
				console.error('Failed to load users:', error);
				toastStore.error(error.message || 'Fehler beim Laden der Benutzer');
				update(state => ({ ...state, users: [], isLoading: false }));
			}
		},

		async drinkBeer(userId: string) {
			try {
				// Note: We skip optimistic update for balance since it requires beer price calculation
				// Just increment beer counts optimistically
				update(state => ({
					...state,
					users: state.users.map(user =>
						user.id === userId
							? {
									...user,
									beersTotal: (user.beersTotal ?? 0) + 1,
									beersToday: (user.beersToday ?? 0) + 1,
									// balance is recalculated by server
							  }
							: user
					),
				}));

				const updatedUser = await userService.drinkBeer(userId);

				// Update with actual data from server - ensure we have the user data
				if (updatedUser && updatedUser.id) {
					update(state => ({
						...state,
						users: state.users.map(user =>
							user.id === updatedUser.id ? { ...updatedUser } : user
						),
					}));
					toastStore.success('Bier hinzugefügt! 🍺');
				} else {
					// If API doesn't return proper user data, reload all users
					console.warn('API returned incomplete user data, reloading users');
					await this.loadUsers();
					toastStore.success('Bier hinzugefügt! 🍺');
				}
			} catch (error: any) {
				console.error('Failed to drink beer:', error);
				toastStore.error(error.message || 'Fehler beim Hinzufügen des Biers');

				// Rollback optimistic update
				await this.loadUsers();
			}
		},

		async undoDrink(userId: string) {
			try {
				const updatedUser = await userService.undoDrink(userId);

				if (updatedUser && updatedUser.id) {
					update(state => ({
						...state,
						users: state.users.map(user =>
							user.id === updatedUser.id ? { ...updatedUser } : user
						),
					}));
					toastStore.success('Bier rückgängig gemacht');
				} else {
					await this.loadUsers();
					toastStore.success('Bier rückgängig gemacht');
				}
			} catch (error: any) {
				console.error('Failed to undo drink:', error);
				toastStore.error(error.message || 'Fehler beim Rückgängig machen');
				await this.loadUsers();
			}
		},

		async addPayment(userId: string, amount: number) {
			try {
				const updatedUser = await userService.addPayment(userId, amount);

				if (updatedUser && updatedUser.id) {
					update(state => ({
						...state,
						users: state.users.map(user =>
							user.id === updatedUser.id ? { ...updatedUser } : user
						),
					}));
					toastStore.success(`Zahlung von €${amount.toFixed(2)} hinzugefügt`);
				} else {
					await this.loadUsers();
					toastStore.success(`Zahlung von €${amount.toFixed(2)} hinzugefügt`);
				}
			} catch (error: any) {
				console.error('Failed to add payment:', error);
				toastStore.error(error.message || 'Fehler beim Hinzufügen der Zahlung');
				await this.loadUsers();
			}
		},

		setFilter(filter: Partial<BeersState['filter']>) {
			update(state => ({
				...state,
				filter: { ...state.filter, ...filter },
			}));
		},

		async setSearchFilter(search: string) {
			update(state => ({
				...state,
				filter: { ...state.filter, search },
			}));

			await this.loadUsers();
		},

		async toggleActiveFilter() {
			update(state => ({
				...state,
				filter: { ...state.filter, active: !state.filter.active },
			}));

			await this.loadUsers();
		},
	};
}

export const beersStore = createBeersStore();
