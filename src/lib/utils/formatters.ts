// Formatting utilities

export function formatCurrency(amount: number | undefined | null, locale = 'de-DE', currency = 'EUR'): string {
	// Handle null/undefined values
	const safeAmount = amount ?? 0;

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(safeAmount);
}

export function formatNumber(num: number, locale = 'de-DE'): string {
	return new Intl.NumberFormat(locale).format(num);
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

export function formatRelativeTime(date: string | Date): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const diff = now.getTime() - dateObj.getTime();

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
	if (hours > 0) return `vor ${hours} Stunde${hours > 1 ? 'n' : ''}`;
	if (minutes > 0) return `vor ${minutes} Minute${minutes > 1 ? 'n' : ''}`;
	return 'gerade eben';
}

export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + '...';
}
