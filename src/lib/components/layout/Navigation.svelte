<script lang="ts">
	import { page } from '$app/stores';
	import { authService } from '$lib/services/authService';

	let mobileMenuOpen = false;

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}

	async function handleLogout() {
		await authService.logout();
		closeMenu();
	}

	// Use route.id instead of pathname to handle base paths correctly
	$: currentRoute = $page.route.id || '/';
</script>

<nav class="nav">
	<div class="nav-container">
		<a href="/" class="nav-brand" on:click={closeMenu}>
			<span class="brand-text">Fridaykickers</span>
		</a>

		<button class="menu-toggle" on:click={toggleMenu} aria-label="Menu">
			{#if mobileMenuOpen}
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			{:else}
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="3" y1="12" x2="21" y2="12"></line>
					<line x1="3" y1="6" x2="21" y2="6"></line>
					<line x1="3" y1="18" x2="21" y2="18"></line>
				</svg>
			{/if}
		</button>

		<div class="nav-links {mobileMenuOpen ? 'active' : ''}">
			<a
				href="/"
				class="nav-link {currentRoute === '/' ? 'active' : ''}"
				on:click={closeMenu}
			>
				🍺 Biere
			</a>
			<a
				href="/matches"
				class="nav-link {currentRoute === '/matches' ? 'active' : ''}"
				on:click={closeMenu}
			>
				⚽ Spiele
			</a>
			<a
				href="/tournament"
				class="nav-link {currentRoute === '/tournament' ? 'active' : ''}"
				on:click={closeMenu}
			>
				🏆 Turnier
			</a>
			<a
				href="/statistics"
				class="nav-link {currentRoute === '/statistics' ? 'active' : ''}"
				on:click={closeMenu}
			>
				📊 Statistiken
			</a>
			<a
				href="/settings"
				class="nav-link {currentRoute === '/settings' ? 'active' : ''}"
				on:click={closeMenu}
			>
				⚙️ Einstellungen
			</a>
			<button class="nav-link logout-btn" on:click={handleLogout}>
				🚪 Logout
			</button>
		</div>
	</div>
</nav>

{#if mobileMenuOpen}
	<div class="overlay" on:click={closeMenu}></div>
{/if}

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--nav-height);
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		z-index: 100;
	}

	.nav-container {
		max-width: var(--max-width);
		margin: 0 auto;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--spacing-md);
	}

	.nav-brand {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-weight: 700;
		font-size: var(--font-size-lg);
		color: var(--color-text);
	}

	.brand-text {
		font-family: 'Orbitron', 'Rajdhani', 'Exo 2', 'Audiowide', 'Press Start 2P', -apple-system, sans-serif;
		font-size: var(--font-size-xl);
		font-weight: 700;
		font-style: italic;
		color: #3b82f6;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		background: linear-gradient(135deg, #3b82f6 0%, #06d458 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-shadow: none;
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		color: var(--color-text);
	}

	.nav-links {
		position: fixed;
		top: var(--nav-height);
		right: -100%;
		width: 250px;
		height: calc(100vh - var(--nav-height));
		background: var(--color-surface);
		border-left: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		padding: var(--spacing-lg) 0;
		transition: right 0.3s ease;
		z-index: 101;
	}

	.nav-links.active {
		right: 0;
	}

	.nav-link {
		padding: var(--spacing-md) var(--spacing-lg);
		color: var(--color-text);
		font-size: var(--font-size-base);
		font-weight: 500;
		transition: var(--transition);
		border-left: 3px solid transparent;
		text-align: left;
	}

	.nav-link:hover {
		background: var(--color-bg);
		color: var(--color-primary);
	}

	.nav-link.active {
		color: var(--color-primary);
		border-left-color: var(--color-primary);
		background: var(--color-bg);
	}

	.logout-btn {
		margin-top: auto;
		color: var(--color-danger);
		border-top: 1px solid var(--color-border);
		padding-top: var(--spacing-lg);
	}

	.overlay {
		position: fixed;
		top: var(--nav-height);
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}

	/* Desktop */
	@media (min-width: 768px) {
		.brand-text {
			font-size: var(--font-size-2xl);
		}

		.menu-toggle {
			display: none;
		}

		.nav-links {
			position: static;
			width: auto;
			height: auto;
			flex-direction: row;
			gap: var(--spacing-sm);
			padding: 0;
			border: none;
			background: transparent;
		}

		.nav-link {
			padding: var(--spacing-sm) var(--spacing-md);
			border-left: none;
			border-bottom: 2px solid transparent;
		}

		.nav-link.active {
			border-left-color: transparent;
			border-bottom-color: var(--color-primary);
			background: transparent;
		}

		.logout-btn {
			margin-top: 0;
			border-top: none;
			padding-top: var(--spacing-sm);
		}

		.overlay {
			display: none;
		}
	}
</style>
