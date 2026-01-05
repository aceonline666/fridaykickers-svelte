<script lang="ts">
	import { matchesStore } from '$lib/stores/matchesStore';

	let oldGoals: number | string = '';
	let youngGoals: number | string = '';
	let showForm = false;

	async function handleSubmit() {
		const oldGoalsNum = Number(oldGoals);
		const youngGoalsNum = Number(youngGoals);

		if (isNaN(oldGoalsNum) || isNaN(youngGoalsNum) || oldGoalsNum < 0 || youngGoalsNum < 0) {
			return;
		}

		try {
			await matchesStore.saveMatch(oldGoalsNum, youngGoalsNum);

			// Reset form
			oldGoals = '';
			youngGoals = '';
			showForm = false;
		} catch (error) {
			// Error is handled in store
		}
	}

	function toggleForm() {
		showForm = !showForm;
		if (!showForm) {
			// Reset on close
			oldGoals = '';
			youngGoals = '';
		}
	}

	$: oldGoalsNum = Number(oldGoals);
	$: youngGoalsNum = Number(youngGoals);
	$: isValid = !isNaN(oldGoalsNum) && !isNaN(youngGoalsNum) && oldGoalsNum >= 0 && youngGoalsNum >= 0 && oldGoals !== '' && youngGoals !== '';
	$: isSaving = $matchesStore.isSaving;
</script>

<div class="match-form-container">
	{#if !showForm}
		<button class="btn-add" on:click={toggleForm}>
			<span class="icon">+</span>
			<span>Spiel hinzufügen</span>
		</button>
	{:else}
		<div class="form-card">
			<div class="form-header">
				<h3>Neues Spiel</h3>
				<button class="btn-close" on:click={toggleForm} disabled={isSaving}>×</button>
			</div>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="match-input-row">
					<input
						id="oldGoals"
						type="number"
						min="0"
						bind:value={oldGoals}
						disabled={isSaving}
						placeholder="Tore Alt"
						class="goals-input"
					/>

					<div class="separator">:</div>

					<input
						id="youngGoals"
						type="number"
						min="0"
						bind:value={youngGoals}
						disabled={isSaving}
						placeholder="Tore Jung"
						class="goals-input"
					/>
				</div>

				<div class="form-actions">
					<button type="button" class="btn btn-secondary" on:click={toggleForm} disabled={isSaving}>
						Abbrechen
					</button>
					<button type="submit" class="btn btn-primary" disabled={!isValid || isSaving}>
						{isSaving ? 'Wird gespeichert...' : 'Speichern'}
					</button>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	.match-form-container {
		margin-bottom: var(--spacing-lg);
	}

	.btn-add {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background: var(--color-primary);
		color: white;
		border: 2px dashed transparent;
		border-radius: var(--border-radius);
		font-weight: 500;
		transition: var(--transition);
	}

	.btn-add .icon {
		font-size: 1.5em;
	}

	.btn-add:hover {
		background: var(--color-primary-dark);
	}

	.form-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-lg);
	}

	.form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-lg);
	}

	.form-header h3 {
		margin: 0;
	}

	.btn-close {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		color: var(--color-text-light);
		border-radius: var(--border-radius);
	}

	.btn-close:hover:not(:disabled) {
		background: var(--color-bg);
		color: var(--color-text);
	}

	.match-input-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-md);
	}

	.goals-input {
		width: 120px;
		padding: var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: var(--font-size-lg);
		font-family: var(--font-family);
		background: var(--color-surface);
		transition: var(--transition);
		text-align: center;
		font-weight: 600;
	}

	.goals-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}

	.goals-input:disabled {
		background: var(--color-bg);
		cursor: not-allowed;
		opacity: 0.6;
	}

	.goals-input::placeholder {
		color: var(--color-text-light);
		font-weight: 500;
	}

	.separator {
		font-size: var(--font-size-2xl);
		font-weight: 300;
		color: var(--color-text-light);
	}

	.form-actions {
		display: flex;
		gap: var(--spacing-sm);
	}

	.btn {
		flex: 1;
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--border-radius);
		font-weight: 500;
		font-size: var(--font-size-sm);
		transition: var(--transition);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-dark);
	}

	.btn-secondary {
		background: var(--color-border);
		color: var(--color-text);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-text-light);
		color: white;
	}

	@media (max-width: 640px) {
		.goals-input {
			width: 100px;
			font-size: var(--font-size-base);
			padding: var(--spacing-sm);
		}

		.separator {
			font-size: var(--font-size-xl);
		}
	}
</style>
