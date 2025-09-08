<script lang="ts">
import { log } from '../lib/logger';
log('AdminLoginPage loaded');
import Card from '../components/admin/Card.svelte';
import Input from '../components/admin/Input.svelte';
import Button from '../components/admin/Button.svelte';
import { navigate } from 'svelte-routing';
// ...existing code...
import { supabase } from '../lib/admin/supabaseClient';

let username = '';
let password = '';
let error: string = '';
let isLoading = false;

async function handleLogin(e: Event) {
	e.preventDefault();
	error = '';
	isLoading = true;
	log('Admin login attempt', { username });
	const { data, error: loginError } = await supabase.auth.signInWithPassword({
		email: username,
		password
	});
	if (loginError) {
		error = loginError.message || 'Email atau password salah.';
		log('Admin login failed', { username, loginError });
		isLoading = false;
		return;
	}
	log('Admin login success', { user: data.user });
	navigate('/admin-dashboard');
	isLoading = false;
}
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="text-center mb-6">
			<h1 class="text-3xl font-bold text-[#ff4745] tracking-wider">AKULAKU</h1>
			<p class="text-gray-600">Admin Panel Login</p>
		</div>
		<Card customClass="">
			<form on:submit={handleLogin} class="space-y-6">
				<Input
					label="Email"
					type="text"
					bind:value={username}
					placeholder="Email"
					onInput={() => {}}
				/>
				<Input
					label="Password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					onInput={() => {}}
				/>
				{#if error}
					<p class="text-sm text-red-500 text-center">{error}</p>
				{/if}
				<Button type="submit" disabled={isLoading} ariaLabel="Login" onClick={() => {}}>
					{#if isLoading}
						<svg class="w-5 h-5 mr-2 inline-block animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
						Login...
					{:else}
						Login
					{/if}
				</Button>
			</form>
			<div class="mt-4 text-center">
				<a href="/forgot-password" class="text-sm text-[#ff4745] hover:underline font-semibold">Lupa password?</a>
			</div>
		</Card>
	</div>
</div>

