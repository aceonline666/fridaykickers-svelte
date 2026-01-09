<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { userService } from '$lib/services/userService';
	import { toastStore } from '$lib/stores/toastStore';
	import type { User } from '$lib/types/api.types';

	let user: User | null = null;
	let isLoading = true;
	let isSaving = false;
	let showConfirmDialog = false;
	let confirmAction: 'activate' | 'deactivate' | null = null;

	$: userId = $page.params.id;

	onMount(async () => {
		await loadUser();
	});

	async function loadUser() {
		isLoading = true;
		try {
			user = await userService.getUser(userId);
		} catch (error: any) {
			console.error('Failed to load user:', error);
			toastStore.error(error.message || 'Fehler beim Laden des Benutzers');
		} finally {
			isLoading = false;
		}
	}

	function openConfirmDialog(action: 'activate' | 'deactivate') {
		confirmAction = action;
		showConfirmDialog = true;
	}

	function closeConfirmDialog() {
		showConfirmDialog = false;
		confirmAction = null;
	}

	async function handleToggleActive() {
		if (!user || !confirmAction) return;

		const newStatus = confirmAction === 'activate';
		isSaving = true;

		try {
			await userService.setActive(userId, newStatus);
			user = { ...user, active: newStatus };
			toastStore.success(
				newStatus ? 'Spieler erfolgreich aktiviert!' : 'Spieler erfolgreich deaktiviert!'
			);
			closeConfirmDialog();
		} catch (error: any) {
			console.error('Failed to update user status:', error);
			toastStore.error(error.message || 'Fehler beim Aktualisieren des Status');
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="page-content">
	<div class="container">
		<div class="header">
			<button class="back-button" on:click={() => window.location.href = base + '/'} type="button">
				← Zurück
			</button>
			<h1>Spieler Details</h1>
		</div>

		{#if isLoading}
			<div class="loading">
				<div class="spinner"></div>
				<p class="text-muted">Lädt...</p>
			</div>
		{:else if !user}
			<div class="empty-state">
				<h3>Spieler nicht gefunden</h3>
				<p class="text-muted">Dieser Spieler existiert nicht.</p>
				<button class="btn-primary" on:click={() => window.location.href = base + '/'}>Zurück zur Übersicht</button>
			</div>
		{:else}
			<div class="user-card">
				<div class="user-info">
					<div class="info-row">
						<span class="label">Name:</span>
						<span class="value">{user.name}</span>
					</div>
					<div class="info-row">
						<span class="label">E-Mail:</span>
						<span class="value">{user.email}</span>
					</div>
					<div class="info-row">
						<span class="label">Status:</span>
						<span class="value">
							{#if user.active}
								<span class="badge badge-success">Aktiv</span>
							{:else}
								<span class="badge badge-inactive">Inaktiv</span>
							{/if}
						</span>
					</div>
				</div>

				<div class="actions">
					{#if user.active}
						<button
							class="btn-danger"
							on:click={() => openConfirmDialog('deactivate')}
							disabled={isSaving}
							type="button"
						>
							Deaktivieren
						</button>
					{:else}
						<button
							class="btn-primary"
							on:click={() => openConfirmDialog('activate')}
							disabled={isSaving}
							type="button"
						>
							Aktivieren
						</button>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

{#if showConfirmDialog && user}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-overlay" on:click={closeConfirmDialog} role="dialog" aria-modal="true">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal-content" on:click={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3>Bestätigung erforderlich</h3>
				<button class="modal-close" on:click={closeConfirmDialog} aria-label="Dialog schließen" type="button">×</button>
			</div>

			<div class="modal-body">
				<p class="confirm-text">
					Sicher dass der Spieler <strong>{user.name}</strong> auf
					<strong>{confirmAction === 'activate' ? 'aktiv' : 'inaktiv'}</strong> gesetzt werden soll?
				</p>
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={closeConfirmDialog} type="button">
					Abbrechen
				</button>
				<button
					class="btn-primary"
					on:click={handleToggleActive}
					disabled={isSaving}
					type="button"
				>
					{isSaving ? 'Wird gespeichert...' : 'Bestätigen'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.header {
		margin-bottom: var(--spacing-lg);
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		margin-bottom: var(--spacing-md);
		color: var(--color-primary);
		font-weight: 500;
		border-radius: var(--border-radius);
		transition: var(--transition);
	}

	.back-button:hover {
		background: var(--color-bg);
	}

	.header h1 {
		margin: 0;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xl);
		gap: var(--spacing-md);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-xl);
	}

	.empty-state h3 {
		margin-bottom: var(--spacing-sm);
	}

	.empty-state p {
		margin-bottom: var(--spacing-lg);
	}

	.user-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-lg);
		max-width: 600px;
	}

	.user-info {
		margin-bottom: var(--spacing-lg);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-md) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.info-row:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 500;
		color: var(--color-text);
	}

	.value {
		color: var(--color-text);
	}

	.badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: calc(var(--border-radius) / 2);
		font-size: var(--font-size-sm);
		font-weight: 500;
	}

	.badge-success {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-inactive {
		background: #fee2e2;
		color: #991b1b;
	}

	.actions {
		display: flex;
		gap: var(--spacing-sm);
	}

	.btn-primary,
	.btn-secondary,
	.btn-danger {
		min-height: 44px;
		padding: var(--spacing-sm) var(--spacing-lg);
		border-radius: var(--border-radius);
		font-weight: 500;
		font-size: var(--font-size-base);
		transition: var(--transition);
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-dark);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-danger {
		background: var(--color-danger);
		color: white;
	}

	.btn-danger:hover:not(:disabled) {
		background: #dc2626;
	}

	.btn-danger:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--color-border);
		color: var(--color-text);
	}

	.btn-secondary:hover {
		background: var(--color-text-light);
		color: white;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--spacing-md);
	}

	.modal-content {
		background: var(--color-surface);
		border-radius: var(--border-radius);
		max-width: 500px;
		width: 100%;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-lg);
		border-bottom: 1px solid var(--color-border);
	}

	.modal-header h3 {
		margin: 0;
		font-size: var(--font-size-lg);
	}

	.modal-close {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-2xl);
		color: var(--color-text-light);
		border-radius: var(--border-radius);
	}

	.modal-close:hover {
		background: var(--color-bg);
		color: var(--color-text);
	}

	.modal-body {
		padding: var(--spacing-lg);
	}

	.confirm-text {
		color: var(--color-text);
		line-height: 1.6;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
	}
</style>
