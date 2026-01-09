<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { authService } from '$lib/services/authService';

	onMount(async () => {
		await authService.logout();
		window.location.href = base + '/login';
	});
</script>

<div class="container text-center p-4">
	<p>Wird abgemeldet...</p>
</div>
