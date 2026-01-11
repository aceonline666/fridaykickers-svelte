<script lang="ts">
	import { onMount } from 'svelte';
	import { matchesStore } from '$lib/stores/matchesStore';
	import MatchForm from '$lib/components/features/match/MatchForm.svelte';
	import StandingsTable from '$lib/components/features/match/StandingsTable.svelte';

	onMount(async () => {
		await matchesStore.loadStandings();
		await matchesStore.loadMatches(5);
	});

	async function handleYearChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const year = target.value === 'all' ? 'all' : parseInt(target.value);
		await matchesStore.changeYear(year);
	}

	$: selectedYear = $matchesStore.selectedYear;
	$: standings = $matchesStore.standings;
	$: matches = $matchesStore.matches;
	$: isLoading = $matchesStore.isLoading;
</script>

<div class="page-content">
	<div class="container">
		<div class="header">
			<h1>Spiele</h1>
			<p class="text-muted">Ergebnisse und Tabelle</p>
		</div>

		<MatchForm />

		<div class="section">
			<div class="section-header">
				<h2>Tabelle</h2>
				<select class="year-select" value={selectedYear} on:change={handleYearChange}>
					<option value="all">Alle Jahre</option>
					{#each $matchesStore.availableYears as year}
						<option value={year}>{year}</option>
					{/each}
				</select>
			</div>

			<StandingsTable {standings} loading={isLoading} />
		</div>

		<div class="section">
			<h2>Letzte Spiele</h2>

			{#if matches.length === 0}
				<div class="empty-matches">
					<p class="text-muted">Noch keine Spiele vorhanden</p>
				</div>
			{:else}
				<div class="matches-list">
					{#each matches as match, index (`match-${index}`)}
						<div class="match-card">
							<div class="match-date">
								{match.date}
							</div>
							<div class="match-teams">
								<div class="team home">
									<span class="team-name">{match.homeTeam}</span>
									<span class="team-goals">{match.homeGoals}</span>
								</div>
								<div class="separator">:</div>
								<div class="team away">
									<span class="team-goals">{match.awayGoals}</span>
									<span class="team-name">{match.awayTeam}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.header {
		margin-bottom: var(--spacing-md);
	}

	.header h1 {
		margin-bottom: var(--spacing-xs);
	}

	.section {
		margin-bottom: var(--spacing-xl);
	}

	.section h2 {
		margin-bottom: var(--spacing-md);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-md);
	}

	.section-header h2 {
		margin: 0;
	}

	.year-select {
		padding: var(--spacing-xs) var(--spacing-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: var(--font-size-sm);
		font-family: var(--font-family);
		background: var(--color-surface);
		cursor: pointer;
		transition: var(--transition);
	}

	.year-select:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.empty-matches {
		text-align: center;
		padding: var(--spacing-xl);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
	}

	.matches-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.match-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-md);
	}

	.match-date {
		font-size: var(--font-size-xs);
		color: var(--color-text-light);
		margin-bottom: var(--spacing-sm);
	}

	.match-teams {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
	}

	.team {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.team.home {
		flex-direction: row;
	}

	.team.away {
		flex-direction: row-reverse;
	}

	.team-name {
		font-weight: 500;
		color: var(--color-text);
	}

	.team-goals {
		font-size: var(--font-size-xl);
		font-weight: 600;
		color: var(--color-text);
		min-width: 40px;
		text-align: center;
	}

	.separator {
		font-size: var(--font-size-xl);
		font-weight: 300;
		color: var(--color-text-light);
	}

	@media (min-width: 768px) {
		.header {
			margin-bottom: var(--spacing-lg);
		}
	}
</style>
