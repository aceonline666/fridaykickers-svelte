<script lang="ts">
	import { onMount } from 'svelte';
	import { statsStore } from '$lib/stores/statsStore';

	let selectedPlayerId: string | null = null;
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	onMount(async () => {
		await statsStore.loadStats();
	});

	function handlePlayerClick(playerId: string) {
		selectedPlayerId = selectedPlayerId === playerId ? null : playerId;
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const searchQuery = target.value;

		// Debounce search to avoid too many API calls
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		searchTimeout = setTimeout(async () => {
			await statsStore.setSearchFilter(searchQuery);
		}, 500);
	}

	async function toggleActiveFilter() {
		await statsStore.toggleActiveFilter();
	}

	async function handleYearChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const year = target.value === 'all' ? 'all' : parseInt(target.value);
		await statsStore.setYearFilter(year);
	}

	$: stats = $statsStore.stats;
	$: searchQuery = $statsStore.filter.search;
	$: selectedYear = $statsStore.filter.year;
	$: isLoading = $statsStore.isLoading;
	$: availableYears = $statsStore.availableYears;
</script>

<div class="page-content">
	<div class="container">
		<div class="header">
			<h1>Statistiken</h1>
			<p class="text-muted">Ranglisten und Auswertungen</p>
		</div>

		<div class="controls">
			<div class="search-box">
				<input
					type="text"
					placeholder="Spieler suchen..."
					value={searchQuery}
					on:input={handleSearchInput}
					class="search-input"
				/>
			</div>

			<div class="filter-buttons">
				<button
					class="filter-btn {$statsStore.filter.active ? 'active' : ''}"
					on:click={toggleActiveFilter}
				>
					Aktiv
				</button>
				<button
					class="filter-btn {!$statsStore.filter.active ? 'active' : ''}"
					on:click={toggleActiveFilter}
				>
					Alle
				</button>
			</div>

			<select class="year-select" value={selectedYear} on:change={handleYearChange}>
				<option value="all">Gesamt</option>
				<option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
				{#each availableYears as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</div>

		{#if isLoading}
			<div class="loading">
				<div class="spinner"></div>
				<p class="text-muted">Lädt...</p>
			</div>
		{:else if stats.length === 0}
			<div class="empty-state">
				<div class="empty-icon">📊</div>
				<h3>Keine Statistiken gefunden</h3>
				<p class="text-muted">
					{searchQuery ? 'Keine Ergebnisse für deine Suche.' : 'Noch keine Daten verfügbar.'}
				</p>
			</div>
		{:else}
			<div class="stats-list">
				{#each stats as player, index (`${player.id}-${player.rank}-${index}`)}
					<div
						class="stats-card {selectedPlayerId === player.id ? 'expanded' : ''}"
						on:click={() => handlePlayerClick(player.id)}
					>
						<div class="stats-header">
							<div class="rank-name">
								<span class="rank">{player.rank}.</span>
								<span class="name">{player.name}</span>
								{#if !player.active}
									<span class="inactive-badge">Inaktiv</span>
								{/if}
							</div>
							<div class="stats-badges">
								<span class="badge beer" title="Biere gesamt">
									🍺 {player.beersTotal}
								</span>
								<span class="badge training" title="Max. Biere pro Training">
									🚴 {player.maxBeersPerTraining}
								</span>
								<span class="badge match" title="Trainings gesamt">
									⚽ {player.trainingsTotal}
								</span>
							</div>
						</div>

						{#if selectedPlayerId === player.id}
							<div class="stats-details">
								<div class="detail-item">
									<span class="detail-label">Eingezahlt:</span>
									<span class="detail-value">€{player.paymentsTotal.toFixed(2)}</span>
								</div>
								<div class="detail-item">
									<span class="detail-label">Bier im Schnitt:</span>
									<span class="detail-value">{player.avgBeersPerTraining.toFixed(2)}</span>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.header {
		margin-bottom: var(--spacing-md);
	}

	.header h1 {
		margin-bottom: var(--spacing-xs);
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-lg);
	}

	.search-box {
		width: 100%;
	}

	.search-input {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: var(--font-size-base);
		font-family: var(--font-family);
		transition: var(--transition);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}

	.filter-buttons {
		display: flex;
		gap: var(--spacing-xs);
		background: var(--color-surface);
		padding: var(--spacing-xs);
		border-radius: var(--border-radius);
		border: 1px solid var(--color-border);
	}

	.filter-btn {
		flex: 1;
		padding: var(--spacing-sm);
		border-radius: calc(var(--border-radius) / 2);
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: var(--color-text-light);
		transition: var(--transition);
	}

	.filter-btn.active {
		background: var(--color-primary);
		color: white;
	}

	.filter-btn:hover:not(.active) {
		background: var(--color-bg);
	}

	.year-select {
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: var(--font-size-base);
		font-family: var(--font-family);
		background: var(--color-surface);
		cursor: pointer;
		transition: var(--transition);
	}

	.year-select:focus {
		outline: none;
		border-color: var(--color-primary);
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

	.empty-icon {
		font-size: 4rem;
		margin-bottom: var(--spacing-md);
		opacity: 0.5;
	}

	.empty-state h3 {
		margin-bottom: var(--spacing-sm);
	}

	.stats-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.stats-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-md);
		cursor: pointer;
		transition: var(--transition);
	}

	.stats-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.stats-card.expanded {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.stats-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-md);
	}

	.rank-name {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		flex: 1;
		min-width: 0;
	}

	.rank {
		font-weight: 600;
		color: var(--color-text-light);
		font-size: var(--font-size-lg);
		flex-shrink: 0;
	}

	.name {
		font-weight: 500;
		color: var(--color-text);
		font-size: var(--font-size-base);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.inactive-badge {
		font-size: var(--font-size-xs);
		padding: 2px 6px;
		background: var(--color-text-light);
		color: white;
		border-radius: 4px;
		flex-shrink: 0;
	}

	.stats-badges {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.badge {
		padding: 4px 8px;
		border-radius: 4px;
		font-size: var(--font-size-xs);
		font-weight: 600;
		white-space: nowrap;
	}

	.badge.beer {
		background: #fef3c7;
		color: #92400e;
	}

	.badge.training {
		background: #d1fae5;
		color: #065f46;
	}

	.badge.match {
		background: #fee2e2;
		color: #991b1b;
	}

	.stats-details {
		margin-top: var(--spacing-md);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border);
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
	}

	.detail-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-bg);
		border-radius: 4px;
	}

	.detail-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-light);
	}

	.detail-value {
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--color-text);
	}

	@media (min-width: 768px) {
		.controls {
			flex-direction: row;
			align-items: center;
		}

		.search-box {
			flex: 1;
		}

		.filter-buttons {
			width: 200px;
		}

		.year-select {
			width: 150px;
		}

		.stats-badges {
			flex-wrap: nowrap;
		}
	}

	@media (max-width: 640px) {
		.stats-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.stats-badges {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>
