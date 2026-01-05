// API endpoint definitions
export const ENDPOINTS = {
	// Authentication
	LOGIN: '/login',
	LOGOUT: '/logout',

	// Users
	USERS: '/v1/user',
	USER_DETAIL: (id: string) => `/v1/user/${id}`,
	USER_ACTIVE: (id: string) => `/v1/user/${id}/active`,
	USER_INFO: (id: string) => `/v1/user/${id}/userinfo`,
	USER_PASSWORD: (id: string) => `/v1/user/${id}/password`,
	USER_DRINK: (id: string) => `/v1/user/${id}/drink`,
	USER_DRINK_UNDO: (id: string) => `/v1/user/${id}/drink/undo`,
	USER_PAY: (id: string) => `/v1/user/${id}/pay`,

	// Matches
	MATCHES: '/v1/match',
	MATCH_TOURNAMENT: '/v1/match/tournament',
	MATCH_TABLEAUX: '/v1/match/tableaux',

	// Statistics
	STATS: '/v1/stats',

	// Settings
	SETTINGS: '/v1/settings',
} as const;
