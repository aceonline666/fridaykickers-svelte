<script lang="ts">
	import { onMount } from 'svelte';
	import { beersStore } from '$lib/stores/beersStore';
	import { userService } from '$lib/services/userService';
	import { toastStore } from '$lib/stores/toastStore';
	import PlayerCard from '$lib/components/features/beer/PlayerCard.svelte';

	let selectedPlayerId: string | null = null;
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	let showAddUserDialog = false;
	let newUserName = '';
	let newUserEmail = '';
	let newUserPassword = '';
	let isCreatingUser = false;

	onMount(async () => {
		await beersStore.loadUsers();
	});

	function handlePlayerClick(playerId: string) {
		selectedPlayerId = selectedPlayerId === playerId ? null : playerId;
	}

	function handleBeerClick(playerId: string) {
		// Ensure player stays expanded after clicking beer
		selectedPlayerId = playerId;
	}

	function handleSearchInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const searchQuery = target.value;

		// Debounce search to avoid too many API calls
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		searchTimeout = setTimeout(async () => {
			await beersStore.setSearchFilter(searchQuery);
		}, 500);
	}

	async function toggleActiveFilter() {
		await beersStore.toggleActiveFilter();
	}

	function openAddUserDialog() {
		showAddUserDialog = true;
		newUserName = '';
		newUserEmail = '';
		newUserPassword = '';
	}

	function closeAddUserDialog() {
		showAddUserDialog = false;
	}

	async function handleCreateUser() {
		if (!newUserName || !newUserEmail || !newUserPassword) {
			toastStore.error('Bitte alle Felder ausfüllen');
			return;
		}

		isCreatingUser = true;
		try {
			await userService.createUser({
				name: newUserName,
				email: newUserEmail,
				password: newUserPassword,
			});
			toastStore.success('Benutzer erfolgreich erstellt!');
			closeAddUserDialog();
			await beersStore.loadUsers();
		} catch (error: any) {
			console.error('Failed to create user:', error);
			toastStore.error(error.message || 'Fehler beim Erstellen des Benutzers');
		} finally {
			isCreatingUser = false;
		}
	}

	$: users = $beersStore.users;
	$: searchQuery = $beersStore.filter.search;
	$: totalBeersToday = users.reduce((sum, user) => sum + (user.beersToday ?? 0), 0);
	$: beerEmoji = totalBeersToday > 40 ? '🍻☠️☠️☠️' : totalBeersToday > 30 ? '🍻😵‍💫🥴😵' :totalBeersToday > 20 ? '🍻🍻🍻' : totalBeersToday > 10 ? '🍻' : '🍺';
</script>

<div class="page-content">
	<div class="container">
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

			<button class="filter-toggle" on:click={toggleActiveFilter} aria-label="Filter umschalten">
				<span class="toggle-track {$beersStore.filter.active ? 'active' : ''}">
					<span class="toggle-label left">{$beersStore.filter.active ? 'Aktiv' : ''}</span>
					<span class="toggle-thumb"></span>
					<span class="toggle-label right">{!$beersStore.filter.active ? 'Alle' : ''}</span>
				</span>
			</button>
		</div>

		{#if $beersStore.isLoading}
			<div class="loading">
				<div class="spinner"></div>
				<p class="text-muted">Lädt...</p>
			</div>
		{:else if users.length === 0}
			<div class="empty-state">
				<div class="empty-icon">🍺</div>
				<h3>Keine Spieler gefunden</h3>
				<p class="text-muted">
					{searchQuery ? 'Keine Ergebnisse für deine Suche.' : 'Noch keine Daten verfügbar.'}
				</p>
			</div>
		{:else}
			<div class="players-list">
				{#each users as player (player.id)}
					<button
						class="player-card-button"
						on:click={() => handlePlayerClick(player.id)}
						type="button"
						aria-expanded={selectedPlayerId === player.id}
						aria-label="Details für {player.name} {selectedPlayerId === player.id ? 'ausblenden' : 'anzeigen'}"
					>
						<PlayerCard {player} selected={selectedPlayerId === player.id} onBeerClick={() => handleBeerClick(player.id)} />
					</button>
				{/each}
			</div>

			<button class="btn-add btn-add-user" on:click={openAddUserDialog}>
				<span class="icon">+</span>
				<span>Neuer Spieler</span>
			</button>
		{/if}
	</div>
</div>

{#if totalBeersToday > 0}
	<div class="beer-counter">
		Heute: {totalBeersToday} {beerEmoji}
	</div>
{/if}

{#if showAddUserDialog}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal-overlay" on:click={closeAddUserDialog} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="modal-content" on:click={(e) => e.stopPropagation()}>
			<div class="modal-header">
				<h3 id="modal-title">Neuen Spieler hinzufügen</h3>
				<button class="modal-close" on:click={closeAddUserDialog} aria-label="Dialog schließen" type="button">×</button>
			</div>

			<div class="modal-body">
				<div class="form-group">
					<label for="userName">Name</label>
					<input
						id="userName"
						type="text"
						bind:value={newUserName}
						placeholder="Name"
						class="form-input"
						disabled={isCreatingUser}
					/>
				</div>

				<div class="form-group">
					<label for="userEmail">E-Mail</label>
					<input
						id="userEmail"
						type="email"
						bind:value={newUserEmail}
						placeholder="E-Mail"
						class="form-input"
						disabled={isCreatingUser}
					/>
				</div>

				<div class="form-group">
					<label for="userPassword">Passwort</label>
					<input
						id="userPassword"
						type="password"
						bind:value={newUserPassword}
						placeholder="Passwort"
						class="form-input"
						disabled={isCreatingUser}
					/>
				</div>
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" on:click={closeAddUserDialog}>
					Abbrechen
				</button>
				<button
					class="btn-primary"
					on:click={handleCreateUser}
					disabled={isCreatingUser || !newUserName || !newUserEmail || !newUserPassword}
				>
					{isCreatingUser ? 'Erstelle...' : 'Erstellen'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.controls {
		display: flex;
		flex-direction: row;
		gap: var(--spacing-xs);
		margin-bottom: var(--spacing-lg);
		align-items: stretch;
	}

	.search-box {
		flex: 1;
		min-width: 0;
	}

	.search-input {
		width: 100%;
		min-height: 44px;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: 16px; /* Prevents zoom on iOS */
		font-family: var(--font-family);
		transition: var(--transition);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
	}

	.filter-toggle {
		padding: 0;
		border: none;
		background: transparent;
		flex-shrink: 0;
		cursor: pointer;
	}

	.toggle-track {
		position: relative;
		display: flex;
		align-items: center;
		width: 90px;
		height: 36px;
		background: var(--color-border);
		border-radius: 18px;
		transition: background-color 0.3s ease;
		padding: 0 4px;
	}

	.toggle-track.active {
		background: var(--color-primary);
	}

	.toggle-thumb {
		position: absolute;
		width: 28px;
		height: 28px;
		background: white;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition: transform 0.3s ease;
		left: 4px;
	}

	.toggle-track.active .toggle-thumb {
		transform: translateX(54px);
	}

	.toggle-label {
		position: absolute;
		font-size: 11px;
		font-weight: 600;
		color: white;
		user-select: none;
		pointer-events: none;
		z-index: 1;
	}

	.toggle-label.left {
		left: 8px;
	}

	.toggle-label.right {
		right: 8px;
	}

	.filter-toggle:hover .toggle-thumb {
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
	}

	.filter-toggle:active .toggle-thumb {
		transform: scale(0.95);
	}

	.filter-toggle:active .toggle-track.active .toggle-thumb {
		transform: translateX(54px) scale(0.95);
	}

	.beer-counter {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-primary);
		color: white;
		font-size: var(--font-size-sm);
		font-weight: 600;
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
		z-index: 100;
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

	.players-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		margin-bottom: var(--spacing-md);
	}

	.player-card-button {
		width: 100%;
		text-align: left;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
	}

	.btn-add-user {
		margin-top: var(--spacing-md);
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

	.form-group {
		margin-bottom: var(--spacing-md);
	}

	.form-group label {
		display: block;
		margin-bottom: var(--spacing-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	.form-input {
		width: 100%;
		min-height: 44px;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: 16px; /* Prevents zoom on iOS */
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

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
	}

	.btn-primary,
	.btn-secondary {
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

	.btn-secondary {
		background: var(--color-border);
		color: var(--color-text);
	}

	.btn-secondary:hover {
		background: var(--color-text-light);
		color: white;
	}

</style>
