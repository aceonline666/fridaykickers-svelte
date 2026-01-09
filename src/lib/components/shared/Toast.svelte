<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';

	function getIcon(type: string): string {
		switch (type) {
			case 'success': return '✓';
			case 'error': return '✕';
			case 'warning': return '⚠';
			case 'info': return 'ℹ';
			default: return '';
		}
	}
</script>

<div class="toast-container">
	{#each $toastStore as toast (toast.id)}
		<div
			class="toast toast-{toast.type}"
			transition:fly={{ y: -20, duration: 300 }}
			role="alert"
		>
			<span class="toast-icon">{getIcon(toast.type)}</span>
			<span class="toast-message">{toast.message}</span>
			<button
				class="toast-close"
				on:click={() => toastStore.remove(toast.id)}
				aria-label="Schließen"
			>
				×
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: calc(var(--nav-height) + var(--spacing-md));
		right: var(--spacing-md);
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		max-width: 400px;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		border-radius: var(--border-radius);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		background: var(--color-surface);
		border-left: 4px solid;
		min-width: 300px;
	}

	.toast-success {
		border-left-color: var(--color-success);
	}

	.toast-error {
		border-left-color: var(--color-danger);
	}

	.toast-warning {
		border-left-color: var(--color-warning);
	}

	.toast-info {
		border-left-color: var(--color-info);
	}

	.toast-icon {
		font-size: var(--font-size-xl);
		font-weight: bold;
		flex-shrink: 0;
	}

	.toast-success .toast-icon {
		color: var(--color-primary);
	}

	.toast-error .toast-icon {
		color: var(--color-danger);
	}

	.toast-warning .toast-icon {
		color: var(--color-secondary);
	}

	.toast-info .toast-icon {
		color: var(--color-primary);
	}

	.toast-message {
		flex: 1;
		color: var(--color-text);
		font-size: var(--font-size-sm);
	}

	.toast-close {
		background: none;
		border: none;
		font-size: var(--font-size-2xl);
		color: #6b7280;
		cursor: pointer;
		padding: 0;
		width: var(--font-size-2xl);
		height: var(--font-size-2xl);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.toast-close:hover {
		color: var(--color-text);
	}

	@media (max-width: 768px) {
		.toast-container {
			right: var(--spacing-sm);
			left: var(--spacing-sm);
			max-width: none;
		}

		.toast {
			min-width: auto;
		}
	}
</style>
