<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authService } from '$lib/services/authService';

	onMount(async () => {
		await authService.logout();
		goto('/login');
	});
</script>

<div class="container text-center p-4">
	<p>Wird abgemeldet...</p>
</div>
