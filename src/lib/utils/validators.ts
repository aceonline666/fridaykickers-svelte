// Validation utilities

import { EMAIL_REGEX, MIN_PASSWORD_LENGTH } from './constants';

export function validateEmail(email: string): boolean {
	return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): boolean {
	return password.length >= MIN_PASSWORD_LENGTH;
}

export function validateRequired(value: string): boolean {
	return value.trim().length > 0;
}

export function validateNumber(value: string | number): boolean {
	const num = typeof value === 'string' ? parseFloat(value) : value;
	return !isNaN(num) && isFinite(num);
}

export function validatePositiveNumber(value: string | number): boolean {
	const num = typeof value === 'string' ? parseFloat(value) : value;
	return validateNumber(num) && num > 0;
}

export function validateMatchScore(score: number): boolean {
	return Number.isInteger(score) && score >= 0;
}

export interface ValidationResult {
	valid: boolean;
	errors: Record<string, string>;
}

export function validateLoginForm(email: string, password: string): ValidationResult {
	const errors: Record<string, string> = {};

	if (!validateRequired(email)) {
		errors.email = 'E-Mail ist erforderlich';
	} else if (!validateEmail(email)) {
		errors.email = 'Ungültige E-Mail-Adresse';
	}

	if (!validateRequired(password)) {
		errors.password = 'Passwort ist erforderlich';
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors,
	};
}

export function validateUserForm(
	name: string,
	email: string,
	password?: string
): ValidationResult {
	const errors: Record<string, string> = {};

	if (!validateRequired(name)) {
		errors.name = 'Name ist erforderlich';
	}

	if (!validateRequired(email)) {
		errors.email = 'E-Mail ist erforderlich';
	} else if (!validateEmail(email)) {
		errors.email = 'Ungültige E-Mail-Adresse';
	}

	if (password !== undefined) {
		if (!validateRequired(password)) {
			errors.password = 'Passwort ist erforderlich';
		} else if (!validatePassword(password)) {
			errors.password = `Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein`;
		}
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors,
	};
}

export function validateMatchForm(
	homeGoals: number,
	awayGoals: number
): ValidationResult {
	const errors: Record<string, string> = {};

	if (!validateMatchScore(homeGoals)) {
		errors.homeGoals = 'Heimtore müssen eine ganze Zahl >= 0 sein';
	}

	if (!validateMatchScore(awayGoals)) {
		errors.awayGoals = 'Auswärtstore müssen eine ganze Zahl >= 0 sein';
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors,
	};
}
