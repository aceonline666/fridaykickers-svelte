<script lang="ts">
	import { onMount } from 'svelte';
	import { settingsStore } from '$lib/stores/settingsStore';

	let beerPrice: number | string = 1.0;
	let showConfirmDialog = false;
	let adminPassword = '';

	onMount(async () => {
		await settingsStore.loadSettings();
		beerPrice = $settingsStore.settings.beerPrice;
	});

	function handleSubmit(event: Event) {
		event.preventDefault();
		showConfirmDialog = true;
	}

	function cancelUpdate() {
		showConfirmDialog = false;
		adminPassword = '';
	}

	async function confirmUpdate() {
		// Simple admin password check (same as old frontend)
		if (adminPassword !== '8848') {
			alert('Falsches Passwort!');
			return;
		}

		const priceNum = Number(beerPrice);
		if (isNaN(priceNum) || priceNum <= 0) {
			alert('Bitte geben Sie einen gültigen Preis ein.');
			return;
		}

		try {
			await settingsStore.updateBeerPrice(priceNum);
			showConfirmDialog = false;
			adminPassword = '';
		} catch (error) {
			// Error is handled in store
		}
	}

	$: isValid = !isNaN(Number(beerPrice)) && Number(beerPrice) > 0 && beerPrice !== '';
	$: isSaving = $settingsStore.isSaving;
	$: isLoading = $settingsStore.isLoading;

	// Update local beerPrice when store changes
	$: if (!showConfirmDialog) {
		beerPrice = $settingsStore.settings.beerPrice;
	}
</script>

<div class="page-content">
	<div class="container">
		<div class="header">
			<h1>Einstellungen</h1>
			<p class="text-muted">System-Konfiguration</p>
		</div>

		{#if isLoading}
			<div class="loading">
				<div class="spinner"></div>
				<p class="text-muted">Lädt...</p>
			</div>
		{:else}
			<div class="settings-card">
				<form on:submit={handleSubmit}>
					<div class="form-group">
						<label for="beerPrice" class="form-label">Bierpreis</label>
						<div class="input-with-suffix">
							<input
								id="beerPrice"
								type="number"
								step="0.01"
								min="0"
								bind:value={beerPrice}
								disabled={isSaving}
								class="form-input"
							/>
							<span class="input-suffix">€</span>
						</div>
						<p class="form-hint">
							Der Preis pro Bier für alle Spieler.
						</p>
					</div>

					<button type="submit" class="btn-primary" disabled={!isValid || isSaving}>
						{isSaving ? 'Wird gespeichert...' : 'Speichern'}
					</button>
				</form>
			</div>
		{/if}
	</div>
</div>

{#if showConfirmDialog}
	<div class="modal-overlay" on:click={cancelUpdate}>
		<div class="modal-content" on:click={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3>Bestätigung erforderlich</h3>
				<button class="modal-close" on:click={cancelUpdate}>×</button>
			</div>

			<div class="modal-body">
				<p class="confirm-text">
					Wirklich sicher, dass der Bierpreis auf <strong>{Number(beerPrice).toFixed(2)} €</strong> geändert werden soll?
				</p>
				<p class="password-label">Gib zur Bestätigung bitte das Admin-Passwort ein:</p>
				<input
					type="password"
					bind:value={adminPassword}
					placeholder="Admin-Passwort"
					class="password-input"
					autofocus
					on:keydown={(e) => e.key === 'Enter' && confirmUpdate()}
				/>
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={cancelUpdate}>
					Abbrechen
				</button>
				<button class="btn-primary" on:click={confirmUpdate} disabled={!adminPassword}>
					Bestätigen
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.header {
		margin-bottom: var(--spacing-lg);
	}

	.header h1 {
		margin-bottom: var(--spacing-xs);
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

	.settings-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-lg);
		max-width: 500px;
	}

	.form-group {
		margin-bottom: var(--spacing-lg);
	}

	.form-label {
		display: block;
		margin-bottom: var(--spacing-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	.input-with-suffix {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.form-input {
		flex: 1;
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
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}

	.form-input:disabled {
		background: var(--color-bg);
		cursor: not-allowed;
		opacity: 0.6;
	}

	.input-suffix {
		font-weight: 600;
		color: var(--color-text-light);
		font-size: var(--font-size-base);
	}

	.form-hint {
		margin-top: var(--spacing-xs);
		font-size: var(--font-size-sm);
		color: var(--color-text-light);
	}

	.btn-primary {
		padding: var(--spacing-sm) var(--spacing-lg);
		background: var(--color-primary);
		color: white;
		border-radius: var(--border-radius);
		font-weight: 500;
		font-size: var(--font-size-base);
		transition: var(--transition);
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-dark);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		padding: var(--spacing-sm) var(--spacing-lg);
		background: var(--color-border);
		color: var(--color-text);
		border-radius: var(--border-radius);
		font-weight: 500;
		font-size: var(--font-size-base);
		transition: var(--transition);
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
		font-size: 1.5rem;
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
		margin-bottom: var(--spacing-md);
		color: var(--color-text);
	}

	.password-label {
		margin-bottom: var(--spacing-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	.password-input {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: var(--font-size-base);
		font-family: var(--font-family);
		transition: var(--transition);
	}

	.password-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
	}
</style>
