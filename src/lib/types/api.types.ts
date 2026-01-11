// API Response types
export interface ApiResponse<T> {
	data: T;
	message?: string;
}

export interface ApiError {
	message: string;
	status?: number;
	errors?: Record<string, string[]>;
}

// Common types
export interface User {
	id: string;
	name: string;
	email: string;
	active: boolean;
	role: 'ADMIN' | 'USER';
	beersTotal: number;
	beersToday: number;
	balance: number;
	rank: number;
	createdAt: string;
}

export interface Beer {
	id: string;
	userId: string;
	amount: number;
	price: number;
	total: number;
	year: number;
	createdAt: string;
}

export interface Payment {
	id: string;
	userId: string;
	amount: number;
	year: number;
	createdAt: string;
}

export interface Match {
	homeTeam: string;
	awayTeam: string;
	homeGoals: number;
	awayGoals: number;
	date: string;
}

export interface Team {
	rank: number;
	name: string;
	scoredGoals: number;
	goalDifference: number;
	points: number;
}

export interface PlayerStats {
	id: string;
	rank: number;
	name: string;
	beersTotal: number;
	paymentsTotal: number;
	trainingsTotal: number;
	maxBeersPerTraining: number;
	avgBeersPerTraining: number;
	active: boolean;
}

export interface Settings {
	beerPrice: number;
}

// Request types
export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user?: User;
}

export interface CreateUserRequest {
	name: string;
	email: string;
	password: string;
}

export interface UpdateUserRequest {
	name?: string;
	email?: string;
}

export interface ChangePasswordRequest {
	password: string;
}

export interface SetActiveRequest {
	active: boolean;
}

export interface CreateMatchRequest {
	oldGoals: number;
	youngGoals: number;
}

export interface TournamentMatchRequest {
	homeTeam: string;
	awayTeam: string;
	homeGoals: number;
	awayGoals: number;
}

export interface CreateTournamentMatchesRequest {
	matches: TournamentMatchRequest[];
}

export interface UpdateSettingsRequest {
	beerPrice: number;
}

// Query parameters
export interface UserQueryParams {
	active?: boolean;
	filter?: string;
}

export interface MatchQueryParams {
	tournament?: boolean;
	limit?: number;
}

export interface TableauxQueryParams {
	tournament?: boolean;
	year?: number | 'all';
	limit?: number;
}

export interface StatsQueryParams {
	active?: boolean;
	filter?: string;
	year?: number | 'all';
}
