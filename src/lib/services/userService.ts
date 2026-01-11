import { apiClient } from '$lib/api/apiClient';
import { ENDPOINTS } from '$lib/api/endpoints';
import type { User, UserQueryParams, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '$lib/types/api.types';

class UserService {
	async getUsers(params?: UserQueryParams): Promise<User[]> {
		const queryParams = new URLSearchParams();

		if (params?.active !== undefined) {
			queryParams.append('active', params.active.toString());
		}
		if (params?.filter) {
			queryParams.append('filter', params.filter);
		}

		const endpoint = queryParams.toString()
			? `${ENDPOINTS.USERS}?${queryParams.toString()}`
			: ENDPOINTS.USERS;

		return await apiClient.get<User[]>(endpoint);
	}

	async getUser(id: string): Promise<User> {
		return await apiClient.get<User>(ENDPOINTS.USER_DETAIL(id));
	}

	async drinkBeer(userId: string): Promise<User> {
		return await apiClient.put<User>(ENDPOINTS.USER_DRINK(userId));
	}

	async undoDrink(userId: string): Promise<User> {
		return await apiClient.put<User>(ENDPOINTS.USER_DRINK_UNDO(userId));
	}

	async addPayment(userId: string, amount?: number): Promise<User> {
		const endpoint = amount
			? `${ENDPOINTS.USER_PAY(userId)}?amount=${amount}`
			: ENDPOINTS.USER_PAY(userId);

		return await apiClient.put<User>(endpoint);
	}

	async createUser(request: CreateUserRequest): Promise<string> {
		return await apiClient.post<string>(ENDPOINTS.USERS, request);
	}

	async setActive(userId: string, active: boolean): Promise<void> {
		return await apiClient.put<void>(ENDPOINTS.USER_ACTIVE(userId), { active });
	}

	async updateUserInfo(userId: string, request: UpdateUserRequest): Promise<void> {
		return await apiClient.put<void>(ENDPOINTS.USER_INFO(userId), request);
	}

	async changePassword(userId: string, request: ChangePasswordRequest): Promise<void> {
		return await apiClient.put<void>(ENDPOINTS.USER_PASSWORD(userId), request);
	}
}

export const userService = new UserService();
