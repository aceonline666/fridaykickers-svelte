// Application constants

export const APP_NAME = 'Friday Kickers';
export const APP_VERSION = '2.0.0';

// Default values
export const DEFAULT_BEER_PRICE = 1.0;
export const DEFAULT_PAYMENT_AMOUNT = 10.0;

// Teams
export const TEAMS = {
	OLD: 'Old',
	YOUNG: 'Young',
	MIDDLE: 'Middle',
} as const;

export type TeamType = typeof TEAMS[keyof typeof TEAMS];

// User roles
export const ROLES = {
	ADMIN: 'ADMIN',
	USER: 'USER',
} as const;

export type RoleType = typeof ROLES[keyof typeof ROLES];

// Toast duration (ms)
export const TOAST_DURATION = 5000;

// API defaults
export const DEFAULT_MATCH_LIMIT = 5;
export const DEFAULT_TOURNAMENT_LIMIT = 6;

// Date formats
export const DATE_FORMAT = 'DD.MM.YYYY';
export const DATETIME_FORMAT = 'DD.MM.YYYY HH:mm';

// Validation
export const MIN_PASSWORD_LENGTH = 6;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
