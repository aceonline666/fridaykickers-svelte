<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import Toast from '$lib/components/shared/Toast.svelte';
	import Navigation from '$lib/components/layout/Navigation.svelte';
	import { browser } from '$app/environment';

	export const prerender = true;

	// Check authentication on mount
	onMount(() => {
		authStore.initialize();
	});

	// Reactive statement to handle route protection
	$: if (browser) {
		const currentPath = $page.url.pathname;
		const isLoginPage = currentPath === '/login';

		if (!$authStore.isAuthenticated && !isLoginPage) {
			goto('/login', { replaceState: true });
		} else if ($authStore.isAuthenticated && isLoginPage) {
			goto('/', { replaceState: true });
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
