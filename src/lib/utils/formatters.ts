// Formatting utilities

export function formatCurrency(amount: number | undefined | null, locale = 'de-DE', currency = 'EUR'): string {
	// Handle null/undefined values
	const safeAmount = amount ?? 0;

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(safeAmount);
}

export function formatDate(date: string | Date, format = 'short'): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;

	if (format === 'short') {
		return new Intl.DateTimeFormat('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(dateObj);
	}

	if (format === 'long') {
		return new Intl.DateTimeFormat('de-DE', {
			day: '2-digit',
			month: 'long',
			year: 'numeric',
		}).format(dateObj);
	}

	if (format === 'datetime') {
		return new Intl.DateTimeFormat('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(dateObj);
	}

	return dateObj.toLocaleDateString('de-DE');
}
