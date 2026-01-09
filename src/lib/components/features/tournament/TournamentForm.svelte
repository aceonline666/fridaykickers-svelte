<script lang="ts">
	import { tournamentStore } from '$lib/stores/tournamentStore';

	// Tournament structure: 3 teams (Old, Middle, Young) playing round-robin = 6 matches
	const matches = [
		{ homeTeam: 'Old', awayTeam: 'Young', homeGoals: '', awayGoals: '', homeLabel: 'Alt', awayLabel: 'Jung' },
		{ homeTeam: 'Middle', awayTeam: 'Young', homeGoals: '', awayGoals: '', homeLabel: 'Mittel', awayLabel: 'Jung' },
		{ homeTeam: 'Middle', awayTeam: 'Old', homeGoals: '', awayGoals: '', homeLabel: 'Mittel', awayLabel: 'Alt' },
		{ homeTeam: 'Young', awayTeam: 'Old', homeGoals: '', awayGoals: '', homeLabel: 'Jung', awayLabel: 'Alt' },
		{ homeTeam: 'Young', awayTeam: 'Middle', homeGoals: '', awayGoals: '', homeLabel: 'Jung', awayLabel: 'Mittel' },
		{ homeTeam: 'Old', awayTeam: 'Middle', homeGoals: '', awayGoals: '', homeLabel: 'Alt', awayLabel: 'Mittel' },
	];

	let showForm = false;

	async function handleSubmit() {
		// Validate all fields
		const allValid = matches.every(match => {
			const homeGoals = Number(match.homeGoals);
			const awayGoals = Number(match.awayGoals);
			return !isNaN(homeGoals) && !isNaN(awayGoals) && homeGoals >= 0 && awayGoals >= 0 && match.homeGoals !== '' && match.awayGoals !== '';
		});

		if (!allValid) {
			return;
		}

		try {
			const tournamentData = matches.map(match => ({
				homeTeam: match.homeTeam,
				awayTeam: match.awayTeam,
				homeGoals: Number(match.homeGoals),
				awayGoals: Number(match.awayGoals),
			}));

			await tournamentStore.saveTournament(tournamentData);

			// Reset form
			matches.forEach(match => {
				match.homeGoals = '';
				match.awayGoals = '';
			});
			showForm = false;
		} catch (error) {
			// Error is handled in store
		}
	}

	function toggleForm() {
		showForm = !showForm;
		if (!showForm) {
			// Reset on close
			matches.forEach(match => {
				match.homeGoals = '';
				match.awayGoals = '';
			});
		}
	}

	$: isValid = matches.every(match => {
		const homeGoals = Number(match.homeGoals);
		const awayGoals = Number(match.awayGoals);
		return !isNaN(homeGoals) && !isNaN(awayGoals) && homeGoals >= 0 && awayGoals >= 0 && match.homeGoals !== '' && match.awayGoals !== '';
	});
	$: isSaving = $tournamentStore.isSaving;
</script>

<div class="tournament-form-container">
	{#if !showForm}
		<button class="btn-add" on:click={toggleForm}>
			<span class="icon">+</span>
			<span>Turnier eintragen</span>
		</button>
	{:else}
		<div class="form-card">
			<div class="form-header">
				<h3>Turnier-Ergebnis</h3>
				<button class="btn-close" on:click={toggleForm} disabled={isSaving}>×</button>
			</div>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="matches-grid">
					{#each matches as match, index}
						<div class="match-input-row">
							<input
								type="number"
								min="0"
								bind:value={match.homeGoals}
								disabled={isSaving}
								placeholder={match.homeLabel}
								class="goals-input"
							/>
							<div class="separator">:</div>
							<input
								type="number"
								min="0"
								bind:value={match.awayGoals}
								disabled={isSaving}
								placeholder={match.awayLabel}
								class="goals-input"
							/>
						</div>
					{/each}
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
	.tournament-form-container {
		margin-bottom: var(--spacing-lg);
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
		font-size: var(--font-size-2xl);
		color: var(--color-text-light);
		border-radius: var(--border-radius);
	}

	.btn-close:hover:not(:disabled) {
		background: var(--color-bg);
		color: var(--color-text);
	}

	.matches-grid {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-md);
	}

	.match-input-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
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
</style>
