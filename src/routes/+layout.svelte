<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { authStore } from '$lib/stores/authStore';
	import Toast from '$lib/components/shared/Toast.svelte';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import { browser } from '$app/environment';

	// Check authentication on mount
	onMount(() => {
		authStore.initialize();
	});

	// Reactive statement to handle route protection
	// Only run after auth store has been initialized to prevent premature redirects
	$: if (browser && $authStore.initialized) {
		// Get the route path (without base path)
		const currentRoute = $page.route.id || '/';
		const isLoginPage = currentRoute === '/login';

		if (!$authStore.isAuthenticated && !isLoginPage) {
			// Use window.location for initial redirect to ensure base path is included
			window.location.href = base + '/login';
		} else if ($authStore.isAuthenticated && isLoginPage) {
			window.location.href = base + '/';
		}
	}

	$: isAuthenticated = $authStore.isAuthenticated;
</script>

{#if isAuthenticated}
	<Navigation />
{/if}

<div class="app">
	<slot />
</div>

<Toast />

<style>
	.app {
		min-height: 100vh;
	}
</style>
