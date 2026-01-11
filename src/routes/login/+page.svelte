<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authService } from '$lib/services/authService';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function handleLogin() {
		if (!email || !password) {
			error = 'Bitte E-Mail und Passwort eingeben';
			return;
		}

		loading = true;
		error = '';

		try {
			await authService.login(email, password);
			goto(resolve('/'));
		} catch (err: any) {
			error = err.message || 'Anmeldung fehlgeschlagen';
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<div class="login-container">
	<div class="login-card">
		<h1>Friday Kickers</h1>
		<p class="subtitle">Anmelden</p>

		{#if error}
			<div class="error-message">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={handleLogin}>
			<div class="form-group">
				<label for="email">E-Mail</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					on:keypress={handleKeyPress}
					placeholder="deine@email.de"
					disabled={loading}
					required
				/>
			</div>

			<div class="form-group">
				<label for="password">Passwort</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					on:keypress={handleKeyPress}
					placeholder="••••••"
					disabled={loading}
					required
				/>
			</div>

			<button type="submit" class="btn-primary" disabled={loading}>
				{loading ? 'Wird angemeldet...' : 'Anmelden'}
			</button>
		</form>
	</div>
</div>

<style>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 1rem;
	}

	.login-card {
		background: white;
		padding: 2rem;
		border-radius: 0.5rem;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		font-size: var(--font-size-2xl);
		margin-bottom: 0.5rem;
		text-align: center;
		color: var(--color-dark);
	}

	.subtitle {
		text-align: center;
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.error-message {
		background-color: #fef2f2;
		color: var(--color-danger);
		padding: 0.75rem;
		border-radius: var(--border-radius);
		margin-bottom: 1rem;
		border: 1px solid #fecaca;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--color-dark);
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: var(--border-radius);
		font-size: var(--font-size-base);
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	input:disabled {
		background-color: #f3f4f6;
		cursor: not-allowed;
	}

	.btn-primary {
		width: 100%;
		padding: 0.75rem;
		background-color: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--border-radius);
		font-size: var(--font-size-base);
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #2563eb;
	}

	.btn-primary:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}
</style>
