<script lang="ts">
	import { onMount } from 'svelte';
	import { statsStore } from '$lib/stores/statsStore';

	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	onMount(async () => {
		await statsStore.loadStats();
	});

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
					<div class="stats-card">
						<div class="stats-header">
							<div class="rank-name">
								<span class="rank">{player.rank}.</span>
								<span class="name">{player.name}</span>
								{#if !player.active}
									<span class="inactive-badge">Inaktiv</span>
								{/if}
							</div>
						</div>

						<div class="stats-grid">
							<div class="stat-item stat-yellow">
								<span class="stat-label">Biere gesamt</span>
								<span class="stat-value">{player.beersTotal}</span>
							</div>
							<div class="stat-item stat-mountain">
								<span class="stat-label">Trainings</span>
								<span class="stat-value">{player.trainingsTotal}</span>
							</div>
							<div class="stat-item stat-blue">
								<span class="stat-label">Ø Biere</span>
								<span class="stat-value">{player.avgBeersPerTraining.toFixed(2)}</span>
							</div>
							<div class="stat-item stat-green">
								<span class="stat-label">Max Biere</span>
								<span class="stat-value">{player.maxBeersPerTraining}</span>
							</div>
							<div class="stat-item">
								<span class="stat-label">Eingezahlt</span>
								<span class="stat-value">€{player.paymentsTotal.toFixed(2)}</span>
							</div>
						</div>
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
		gap: var(--spacing-xs);
	}

	.stats-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-sm);
	}

	.stats-header {
		margin-bottom: var(--spacing-xs);
	}

	.rank-name {
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.rank {
		font-weight: 600;
		color: var(--color-text-light);
		font-size: var(--font-size-base);
		flex-shrink: 0;
	}

	.name {
		font-weight: 500;
		color: var(--color-text);
		font-size: var(--font-size-sm);
	}

	.inactive-badge {
		font-size: var(--font-size-xs);
		padding: 1px 4px;
		background: var(--color-text-light);
		color: white;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-xs);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--spacing-xs);
		background: var(--color-bg);
		border-radius: calc(var(--border-radius) / 2);
		position: relative;
	}

	/* Tour de France inspired highlights */
	.stat-yellow {
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		border: 1px solid #fbbf24;
	}

	.stat-yellow .stat-label {
		color: #92400e;
	}

	.stat-yellow .stat-value {
		color: #92400e;
	}

	.stat-mountain {
		background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
		border: 1px solid #dc2626;
	}

	.stat-mountain .stat-label {
		color: #991b1b;
	}

	.stat-mountain .stat-value {
		color: #991b1b;
	}

	.stat-blue {
		background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
		border: 1px solid #3b82f6;
	}

	.stat-blue .stat-label {
		color: #1e40af;
	}

	.stat-blue .stat-value {
		color: #1e40af;
	}

	.stat-green {
		background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
		border: 1px solid #10b981;
	}

	.stat-green .stat-label {
		color: #065f46;
	}

	.stat-green .stat-value {
		color: #065f46;
	}

	.stat-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-light);
		font-weight: 500;
		line-height: 1;
	}

	.stat-value {
		font-size: var(--font-size-base);
		font-weight: 600;
		color: var(--color-text);
		line-height: 1.2;
	}

	@media (min-width: 640px) {
		.stats-grid {
			grid-template-columns: repeat(5, 1fr);
		}
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

		.stats-card {
			padding: var(--spacing-md);
		}

		.stats-header {
			margin-bottom: var(--spacing-sm);
		}

		.stat-item {
			padding: var(--spacing-sm);
		}

		.stat-value {
			font-size: var(--font-size-lg);
		}
	}
</style>
