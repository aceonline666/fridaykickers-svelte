<script lang="ts">
	import type { Team } from '$lib/types/api.types';

	export let standings: Team[];
	export let loading: boolean = false;
</script>

<div class="standings-container">
	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
		</div>
	{:else if standings.length === 0}
		<div class="empty">
			<p class="text-muted">Keine Tabelle verfügbar</p>
		</div>
	{:else}
		<div class="table-wrapper">
			<table class="standings-table">
				<thead>
					<tr>
						<th class="rank-col">#</th>
						<th class="team-col">Team</th>
						<th class="stat-col">Tore</th>
						<th class="stat-col">Diff</th>
						<th class="points-col">Pkt</th>
					</tr>
				</thead>
				<tbody>
					{#each standings as team (team.name)}
						<tr class="team-row">
							<td class="rank">{team.rank}</td>
							<td class="team-name">{team.name}</td>
							<td class="stat">{team.scoredGoals}</td>
							<td class="stat {team.goalDifference >= 0 ? 'positive' : 'negative'}">
								{team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
							</td>
							<td class="points">{team.points}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.standings-container {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		overflow: hidden;
	}

	.loading {
		display: flex;
		justify-content: center;
		padding: var(--spacing-xl);
	}

	.spinner {
		width: 30px;
		height: 30px;
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

	.empty {
		text-align: center;
		padding: var(--spacing-xl);
	}

	.table-wrapper {
		overflow-x: auto;
	}

	.standings-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--font-size-sm);
	}

	thead {
		background: var(--color-bg);
		border-bottom: 2px solid var(--color-border);
	}

	th {
		padding: var(--spacing-sm) var(--spacing-md);
		text-align: left;
		font-weight: 600;
		color: var(--color-text-light);
		text-transform: uppercase;
		font-size: var(--font-size-xs);
		letter-spacing: 0.5px;
	}

	.rank-col {
		width: 40px;
		text-align: center;
	}

	.team-col {
		min-width: 120px;
	}

	.stat-col,
	.points-col {
		width: 60px;
		text-align: center;
	}

	tbody tr {
		border-bottom: 1px solid var(--color-border);
		transition: var(--transition);
	}

	tbody tr:last-child {
		border-bottom: none;
	}

	tbody tr:hover {
		background: var(--color-bg);
	}

	td {
		padding: var(--spacing-md);
	}

	.rank {
		text-align: center;
		font-weight: 600;
		color: var(--color-text-light);
	}

	.team-name {
		font-weight: 500;
		color: var(--color-text);
	}

	.stat {
		text-align: center;
		color: var(--color-text-light);
	}

	.stat.positive {
		color: var(--color-primary);
	}

	.stat.negative {
		color: var(--color-danger);
	}

	.points {
		text-align: center;
		font-weight: 600;
		font-size: var(--font-size-base);
		color: var(--color-text);
	}

	/* First place highlight */
	tbody tr:first-child .rank {
		color: var(--color-secondary);
	}

	tbody tr:first-child .team-name {
		color: var(--color-primary);
		font-weight: 600;
	}

	tbody tr:first-child .points {
		color: var(--color-primary);
	}

	@media (min-width: 768px) {
		.standings-table {
			font-size: var(--font-size-base);
		}

		th {
			font-size: var(--font-size-sm);
		}

		.rank-col {
			width: 50px;
		}

		.stat-col,
		.points-col {
			width: 80px;
		}
	}
</style>
