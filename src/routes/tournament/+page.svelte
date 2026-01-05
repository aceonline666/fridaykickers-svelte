<script lang="ts">
	import { onMount } from 'svelte';
	import { tournamentStore } from '$lib/stores/tournamentStore';
	import TournamentForm from '$lib/components/features/tournament/TournamentForm.svelte';
	import StandingsTable from '$lib/components/features/match/StandingsTable.svelte';
	import { formatDate } from '$lib/utils/formatters';

	onMount(async () => {
		await tournamentStore.loadStandings();
		await tournamentStore.loadMatches();
	});

	$: standings = $tournamentStore.standings;
	$: matches = $tournamentStore.matches;
	$: isLoading = $tournamentStore.isLoading;
</script>

<div class="page-content">
	<div class="container">
		<div class="header">
			<h1>Turnier</h1>
			<p class="text-muted">Turnier-Ergebnisse und Tabelle</p>
		</div>

		<TournamentForm />

		<div class="section">
			<h2>Turnier-Tabelle</h2>
			<StandingsTable {standings} loading={isLoading} />
		</div>

		<div class="section">
			<h2>Letzte Turnier-Spiele</h2>

			{#if matches.length === 0}
				<div class="empty-matches">
					<p class="text-muted">Noch keine Turnier-Spiele vorhanden</p>
				</div>
			{:else}
				<div class="matches-list">
					{#each matches as match, index (match.id || `match-${index}`)}
						<div class="match-card">
							<div class="match-date">
								{formatDate(match.createdAt)}
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
		font-size: var(--font-size-2xl);
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
