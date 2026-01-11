<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { userService } from '$lib/services/userService';
	import { toastStore } from '$lib/stores/toastStore';
	import type { User } from '$lib/types/api.types';

	let user: User | null = null;
	let isLoading = true;
	let isSaving = false;
	let showConfirmDialog = false;
	let confirmAction: 'activate' | 'deactivate' | null = null;

	// Edit mode state
	let isEditingInfo = false;
	let editName = '';
	let editEmail = '';

	// Password change state
	let isChangingPassword = false;
	let newPassword = '';
	let confirmPassword = '';

	$: userId = page.params.id;
	$: passwordsMatch = newPassword === confirmPassword;
	$: passwordValid = newPassword.length >= 6;
	$: canSavePassword = passwordValid && passwordsMatch && newPassword.length > 0;

	onMount(async () => {
		await loadUser();
	});

	async function loadUser() {
		if (!userId) {
			isLoading = false;
			return;
		}

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

	function startEditingInfo() {
		if (!user) return;
		editName = user.name;
		editEmail = user.email;
		isEditingInfo = true;
	}

	function cancelEditingInfo() {
		isEditingInfo = false;
		editName = '';
		editEmail = '';
	}

	async function saveUserInfo() {
		if (!user || !userId) return;

		if (!editName.trim() || !editEmail.trim()) {
			toastStore.error('Name und E-Mail dürfen nicht leer sein');
			return;
		}

		isSaving = true;
		try {
			await userService.updateUserInfo(userId, {
				name: editName.trim(),
				email: editEmail.trim()
			});

			// Update local user object
			user = { ...user, name: editName.trim(), email: editEmail.trim() };
			isEditingInfo = false;
			toastStore.success('Benutzerdaten erfolgreich aktualisiert!');
		} catch (error: any) {
			console.error('Failed to update user info:', error);
			toastStore.error(error.message || 'Fehler beim Aktualisieren der Benutzerdaten');
		} finally {
			isSaving = false;
		}
	}

	function togglePasswordSection() {
		isChangingPassword = !isChangingPassword;
		if (!isChangingPassword) {
			newPassword = '';
			confirmPassword = '';
		}
	}

	async function savePassword() {
		if (!userId || !canSavePassword) return;

		isSaving = true;
		try {
			await userService.changePassword(userId, { password: newPassword });
			toastStore.success('Passwort erfolgreich geändert!');
			isChangingPassword = false;
			newPassword = '';
			confirmPassword = '';
		} catch (error: any) {
			console.error('Failed to change password:', error);
			toastStore.error(error.message || 'Fehler beim Ändern des Passworts');
		} finally {
			isSaving = false;
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
		if (!user || !confirmAction || !userId) return;

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
			<button class="back-button" on:click={() => goto(resolve('/'))} type="button">
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
				<button class="btn-primary" on:click={() => goto(resolve('/'))}>Zurück zur Übersicht</button>
			</div>
		{:else}
			<!-- User Information Section -->
			<div class="section-card">
				<div class="section-header">
					<h2>👤 Benutzerdaten</h2>
					{#if !isEditingInfo}
						<button class="btn-secondary" on:click={startEditingInfo} type="button">
							Bearbeiten
						</button>
					{/if}
				</div>

				<div class="section-content">
					{#if isEditingInfo}
						<div class="form-group">
							<label for="editName">Name:</label>
							<input
								id="editName"
								type="text"
								bind:value={editName}
								class="form-input"
								disabled={isSaving}
								placeholder="Name"
							/>
						</div>
						<div class="form-group">
							<label for="editEmail">E-Mail:</label>
							<input
								id="editEmail"
								type="email"
								bind:value={editEmail}
								class="form-input"
								disabled={isSaving}
								placeholder="E-Mail"
							/>
						</div>
						<div class="form-actions">
							<button class="btn-secondary" on:click={cancelEditingInfo} disabled={isSaving} type="button">
								Abbrechen
							</button>
							<button class="btn-primary" on:click={saveUserInfo} disabled={isSaving} type="button">
								{isSaving ? 'Speichern...' : 'Speichern'}
							</button>
						</div>
					{:else}
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
					{/if}
				</div>
			</div>

			<!-- Password Change Section -->
			<div class="section-card">
				<div class="section-header">
					<h2>🔒 Passwort ändern</h2>
					<button class="btn-secondary" on:click={togglePasswordSection} type="button">
						{isChangingPassword ? 'Abbrechen' : 'Ändern'}
					</button>
				</div>

				{#if isChangingPassword}
					<div class="section-content">
						<div class="form-group">
							<label for="newPassword">Neues Passwort:</label>
							<input
								id="newPassword"
								type="password"
								bind:value={newPassword}
								class="form-input"
								disabled={isSaving}
								placeholder="Mindestens 6 Zeichen"
								minlength="6"
							/>
							{#if newPassword.length > 0 && !passwordValid}
								<p class="field-error">Passwort muss mindestens 6 Zeichen lang sein</p>
							{/if}
						</div>
						<div class="form-group">
							<label for="confirmPassword">Passwort bestätigen:</label>
							<input
								id="confirmPassword"
								type="password"
								bind:value={confirmPassword}
								class="form-input"
								disabled={isSaving}
								placeholder="Passwort wiederholen"
							/>
							{#if confirmPassword.length > 0 && !passwordsMatch}
								<p class="field-error">Passwörter stimmen nicht überein</p>
							{/if}
						</div>
						<div class="form-actions">
							<button
								class="btn-primary"
								on:click={savePassword}
								disabled={!canSavePassword || isSaving}
								type="button"
							>
								{isSaving ? 'Ändern...' : 'Passwort ändern'}
							</button>
						</div>
					</div>
				{/if}
			</div>

			<!-- User Actions Section -->
			<div class="section-card">
				<div class="section-header">
					<h2>⚙️ Aktionen</h2>
				</div>
				<div class="section-content">
					<div class="actions">
						{#if user.active}
							<button
								class="btn-danger"
								on:click={() => openConfirmDialog('deactivate')}
								disabled={isSaving}
								type="button"
							>
								Spieler deaktivieren
							</button>
						{:else}
							<button
								class="btn-primary"
								on:click={() => openConfirmDialog('activate')}
								disabled={isSaving}
								type="button"
							>
								Spieler aktivieren
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if showConfirmDialog && user}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-overlay" on:click={closeConfirmDialog} role="dialog" aria-modal="true" tabindex="-1">
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

	.section-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-lg);
		max-width: 600px;
		margin-bottom: var(--spacing-lg);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-md);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
	}

	.section-header h2 {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: 600;
	}

	.section-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.form-group label {
		font-weight: 500;
		color: var(--color-text);
	}

	.form-input {
		width: 100%;
		min-height: 44px;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: var(--font-size-base);
		font-family: var(--font-family);
		transition: var(--transition);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-input:disabled {
		background-color: var(--color-bg);
		cursor: not-allowed;
		opacity: 0.6;
	}

	.form-actions {
		display: flex;
		gap: var(--spacing-sm);
		justify-content: flex-end;
		margin-top: var(--spacing-sm);
	}

	.field-error {
		color: var(--color-danger);
		font-size: var(--font-size-sm);
		margin: 0;
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
