<script lang="ts">
	import type { User } from '$lib/types/api.types';
	import { beersStore } from '$lib/stores/beersStore';
	import { formatCurrency } from '$lib/utils/formatters';

	export let player: User;
	export let selected: boolean = false;

	let paymentAmount = 10;
	let isProcessing = false;

	async function handleDrinkBeer() {
		if (isProcessing) return;
		isProcessing = true;
		await beersStore.drinkBeer(player.id);
		isProcessing = false;
	}

	async function handleUndoDrink() {
		if (isProcessing) return;
		isProcessing = true;
		await beersStore.undoDrink(player.id);
		isProcessing = false;
	}

	async function handleAddPayment() {
		if (isProcessing || !paymentAmount || paymentAmount <= 0) return;
		isProcessing = true;
		await beersStore.addPayment(player.id, paymentAmount);
		isProcessing = false;
	}

	$: balanceColor = player.balance >= 0 ? 'positive' : 'negative';
</script>

<div class="player-card {selected ? 'selected' : ''} {!player.active ? 'inactive' : ''}">
	<div class="player-header">
		<div class="player-info">
			<h3 class="player-name">{player.name}</h3>
			<div class="player-stats">
				<span class="stat">
					<span class="stat-value">{player.beersTotal ?? 0}</span>
					<span class="stat-label">gesamt</span>
				</span>
				{#if (player.beersToday ?? 0) > 0}
					<span class="stat today">
						<span class="stat-value">{player.beersToday ?? 0}</span>
						<span class="stat-label">heute</span>
					</span>
				{/if}
			</div>
		</div>
		<div class="balance {balanceColor}">
			{formatCurrency(player.balance)}
		</div>
	</div>

	{#if selected}
		<div class="player-actions">
			{#if player.active}
				<div class="action-group">
					<button class="btn btn-primary" on:click={handleDrinkBeer} disabled={isProcessing}>
						<span class="btn-icon">🍺</span>
						<span>Bier</span>
					</button>
					<button
						class="btn btn-secondary"
						on:click={handleUndoDrink}
						disabled={isProcessing || player.beersTotal === 0}
					>
						<span class="btn-icon">↩️</span>
						<span>Undo</span>
					</button>
					<a href="/users/{player.id}" class="btn btn-info">
						<span class="btn-icon">⚙️</span>
						<span>Edit</span>
					</a>
				</div>

				<div class="payment-group">
					<input
						type="number"
						bind:value={paymentAmount}
						step="0.5"
						class="payment-input"
						placeholder="Betrag"
						on:click={(e) => e.stopPropagation()}
					/>
					<button class="btn btn-success" on:click={handleAddPayment} disabled={isProcessing}>
						<span class="btn-icon">€</span>
						<span>Zahlen</span>
					</button>
				</div>
			{:else}
				<div class="inactive-actions">
					<p class="inactive-message">Dieser Spieler ist deaktiviert</p>
					<a href="/users/{player.id}" class="btn btn-primary">
						<span class="btn-icon">✓</span>
						<span>Aktivieren</span>
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.player-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		padding: var(--spacing-md);
		cursor: pointer;
		transition: var(--transition);
	}

	.player-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.player-card.selected {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
	}

	.player-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.player-info {
		flex: 1;
		min-width: 0;
	}

	.player-name {
		font-size: var(--font-size-lg);
		font-weight: 600;
		margin-bottom: var(--spacing-xs);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.player-stats {
		display: flex;
		gap: var(--spacing-md);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.stat-value {
		font-size: var(--font-size-xl);
		font-weight: 600;
		line-height: 1;
		color: var(--color-text);
	}

	.stat-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-light);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat.today .stat-value {
		color: var(--color-primary);
	}

	.balance {
		font-size: var(--font-size-lg);
		font-weight: 600;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: calc(var(--border-radius) / 2);
		white-space: nowrap;
	}

	.balance.positive {
		background: #d1fae5;
		color: #065f46;
	}

	.balance.negative {
		background: #fee2e2;
		color: #991b1b;
	}

	.player-actions {
		margin-top: var(--spacing-md);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.action-group,
	.payment-group {
		display: flex;
		gap: var(--spacing-sm);
	}

	.btn {
		flex: 1;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--border-radius);
		font-weight: 500;
		font-size: var(--font-size-sm);
		transition: var(--transition);
	}

	.btn-icon {
		font-size: 1.2em;
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
		background: var(--color-text-light);
		color: white;
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-text);
	}

	.btn-info {
		background: #6b7280;
		color: white;
		text-decoration: none;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--border-radius);
		font-weight: 500;
		font-size: var(--font-size-sm);
		transition: var(--transition);
	}

	.btn-info:hover {
		background: var(--color-text);
	}

	.btn-success {
		background: var(--color-secondary);
		color: white;
		min-width: 100px;
	}

	.btn-success:hover:not(:disabled) {
		background: #d97706;
	}

	.payment-input {
		flex: 1;
		min-height: 44px;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius);
		font-size: 16px; /* Prevents zoom on iOS */
		font-family: var(--font-family);
	}

	.payment-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	@media (min-width: 768px) {
		.player-actions {
			flex-direction: row;
		}

		.action-group {
			flex: 1;
		}

		.payment-group {
			flex: 1;
		}
	}
</style>
