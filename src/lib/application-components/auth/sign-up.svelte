<script lang="ts">
	import { signup } from '@/svelte-auth0';
	import { SquareCheck, CheckCircle2, Loader2 } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let errorMessage = $state<string | null>(null);

	const passwordRules = [
		{
			rule: 'At least 8 characters',
			validate: (pwd: string) => pwd.length >= 8
		},
		{
			rule: 'At least 1 capital letter (A-Z)',
			validate: (pwd: string) => /[A-Z]/.test(pwd)
		},
		{
			rule: 'At least 1 number (0-9)',
			validate: (pwd: string) => /\d/.test(pwd)
		},
		{
			rule: 'At least 1 special character (!@#$..)',
			validate: (pwd: string) => /[!@#$%^&*]/.test(pwd)
		}
	];


	const isValidEmail = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

	const allPasswordRulesPassed = $derived(
		passwordRules.every(({ validate }) => validate(password))
	);

	const passwordsMatch = $derived(
		password && confirmPassword && password === confirmPassword
	);

	const isFormValid = $derived(
		isValidEmail && allPasswordRulesPassed && passwordsMatch
	);

	async function handleSignup() {
		errorMessage = null;
		if (!isFormValid) {
			errorMessage = 'Please fill all fields correctly before continuing.';
			return;
		}

		loading = true;
		try {
			await signup({ email: email, password: password });
		} catch (err) {
			console.error('Signup Error:', err);
			errorMessage = 'Signup failed. The email might already be in use or the server is unavailable.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 font-sans">
	<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
		<div class="flex flex-col items-center space-y-4 text-center">
			<img src="/tracefii_logo.png" alt="Tracefii Logo" class="w-32" />
			<div class="space-y-1">
				<h1 class="text-2xl font-bold text-slate-800">Create your Tracefii account</h1>
				<p class="text-sm text-slate-500">Make your calibration journey easier</p>
			</div>
		</div>

		<form class="mt-8 space-y-4" onsubmit={handleSignup}>
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-slate-600">Email*</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					placeholder="Enter your email"
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					aria-invalid={!isValidEmail && email.length > 0}
					required
				/>
				{#if email.length > 0 && !isValidEmail}
					<p class="mt-1 text-xs text-red-500">Please enter a valid email address.</p>
				{/if}
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-slate-600">Password*</label>
				<input
					bind:value={password}
					type="password"
					id="password"
					placeholder="Create a password"
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					aria-invalid={!allPasswordRulesPassed && password.length > 0}
					required
				/>
			</div>

			{#if password.length > 0}
				<div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
					{#each passwordRules as { rule, validate }}
						<div class="flex items-center space-x-2 transition-colors duration-300">
							<SquareCheck
								class={validate(password) ? 'text-green-500' : 'text-slate-400'}
								size={16}
							/>
							<span class={validate(password) ? 'text-slate-600' : 'text-slate-500'}>{rule}</span>
						</div>
					{/each}
				</div>
			{/if}

			<div>
				<label for="confirmPassword" class="mb-1 block text-sm font-medium text-slate-600">Confirm Password*</label>
				<input
					bind:value={confirmPassword}
					type="password"
					id="confirmPassword"
					placeholder="Confirm your password"
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					aria-invalid={!passwordsMatch && confirmPassword.length > 0}
					required
				/>
				{#if confirmPassword.length > 0 && password.length > 0}
					<div class="mt-2 flex items-center space-x-2 text-xs">
						{#if passwordsMatch}
							<CheckCircle2 class="text-green-500" size={16} />
							<span class="text-green-600">Passwords match!</span>
						{:else}
							<span class="text-red-500">Passwords do not match.</span>
						{/if}
					</div>
				{/if}
			</div>

			{#if errorMessage}
				<p class="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-600" role="alert">{errorMessage}</p>
			{/if}

			<p class="text-center text-xs text-slate-500">
				By continuing, you agree to Tracefii's
				<a href="#" class="cursor-pointer font-medium text-blue-600 hover:underline">Terms of Service</a>
				and
				<a href="#" class="cursor-pointer font-medium text-blue-600 hover:underline">Privacy Policy</a>
			</p>

			<div class="space-y-3 pt-2">
				<button
					type="submit"
					disabled={!isFormValid || loading}
					class="flex w-full cursor-pointer justify-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}
						<Loader2 class="mr-2 animate-spin" size={20} />
						<span>Creating account...</span>
					{:else}
						<span>Get Started</span>
					{/if}
				</button>
			</div>
		</form>

		<p class="mt-6 text-center text-sm text-slate-600">
			Already have an account?
			<a href="/sign-in" class="font-semibold text-blue-600 hover:underline">Sign in</a>
		</p>
	</div>
</div>
