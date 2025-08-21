<script lang="ts">
	import { login } from '@/svelte-auth0';
	import { SquareCheck, XCircle, AlertTriangle, Loader2, Eye, EyeOff } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let loading = $state(false);
	let errorMessage = $state<string | null>(null);
	let capsOn = $state(false);
	let isOnline = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

	const MAX_LOCAL_ATTEMPTS = 5;
	const LOCKOUT_MINUTES = 5;
	let failedAttempts = $state<number>(0);
	let lockoutUntil = $state<number | null>(null); 

	function now() {
		return Date.now();
	}

	const isValidEmail = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
	const hasPassword = $derived(password.length > 0);
	const isLockedOut = $derived(lockoutUntil !== null && now() < lockoutUntil);

	type FailReasonKey =
		| 'invalidEmail'
		| 'emptyPassword'
		| 'offline'
		| 'lockedOut';

	const failReasons = $derived<FailReasonKey[]>([
		!isValidEmail ? 'invalidEmail' : null,
		!hasPassword ? 'emptyPassword' : null,
		!isOnline ? 'offline' : null,
		isLockedOut ? 'lockedOut' : null
	].filter(Boolean) as FailReasonKey[]);

	const canSubmit = $derived(failReasons.length === 0 && !loading);

	function mapAuthErrorToMessage(err: unknown): string {
		const anyErr = err as { code?: string; message?: string; error?: string; error_description?: string } | undefined;
		const code = anyErr?.code || anyErr?.error;
		switch (code) {
			case 'invalid_grant':
			case 'invalid_credentials':
				return 'Invalid email or password.';
			case 'access_denied':
				return 'Access denied for this account.';
			case 'mfa_required':
				return 'Multi‑factor authentication required. Please complete MFA.';
			case 'user_blocked':
				return 'Your account is blocked. Contact support.';
			case 'too_many_attempts':
				return 'Too many attempts. Please wait a few minutes and try again.';
			case 'network_error':
				return 'Network error. Check your connection and try again.';
			default:
				return anyErr?.message || anyErr?.error_description || 'Login failed. Please try again.';
		}
	}

	function onNetworkChange() {
		isOnline = navigator.onLine;
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('online', onNetworkChange);
		window.addEventListener('offline', onNetworkChange);
	}

	function handlePasswordKey(e: KeyboardEvent) {
		capsOn = e.getModifierState && e.getModifierState('CapsLock');
	}

	function startLocalLockout() {
		lockoutUntil = now() + LOCKOUT_MINUTES * 60 * 1000;
	}

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = null;

		if (failReasons.length > 0) {
			if (failReasons.includes('lockedOut')) {
				errorMessage = `Too many attempts. Try again after ${LOCKOUT_MINUTES} minutes.`;
			} else if (failReasons.includes('offline')) {
				errorMessage = 'You are offline. Reconnect to the internet and try again.';
			} else {
				errorMessage = 'Please fix the issues below before continuing.';
			}
			return;
		}

		loading = true;
		try {
			await login({ email, password });
			failedAttempts = 0;
			lockoutUntil = null;
		} catch (err) {
			failedAttempts += 1;
			if (failedAttempts >= MAX_LOCAL_ATTEMPTS) startLocalLockout();
			console.error('Login Error:', err);
			errorMessage = mapAuthErrorToMessage(err);
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
				<h1 class="text-2xl font-bold text-slate-800">Sign in to Tracefii</h1>
				<p class="text-sm text-slate-500">Welcome back! Continue your calibration journey</p>
			</div>
		</div>

		<form class="mt-8 space-y-4" onsubmit={handleLogin}>
			{#if isLockedOut}
				<div class="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 flex items-start gap-2">
					<AlertTriangle size={18} class="mt-0.5" />
					<div>
						<strong>Temporarily locked out.</strong> Too many failed attempts. Please wait {LOCKOUT_MINUTES} minutes and try again.
					</div>
				</div>
			{/if}

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
				<div class="relative">
					<input
						bind:value={password}
						type={showPassword ? 'text' : 'password'}
						id="password"
						placeholder="Enter your password"
						class="w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
						onkeydown={handlePasswordKey}
					/>
					<button type="button" class="absolute inset-y-0 right-0 mr-2 flex items-center" aria-label={showPassword ? 'Hide password' : 'Show password'} onclick={() => (showPassword = !showPassword)}>
						{#if showPassword}
							<EyeOff size={18} class="text-slate-500" />
						{:else}
							<Eye size={18} class="text-slate-500" />
						{/if}
					</button>
				</div>
				{#if capsOn}
					<p class="mt-1 text-xs text-amber-600">Caps Lock is on — passwords are case‑sensitive.</p>
				{/if}
				{#if password.length === 0}
					<p class="mt-1 text-xs text-slate-500">Enter your password to continue.</p>
				{/if}
			</div>

			<div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
				<div class="flex items-center space-x-2 transition-colors duration-300">
					{#if isValidEmail}
						<SquareCheck class="text-green-500" size={16} />
						<span class="text-slate-600">Valid email</span>
					{:else}
						<XCircle class="text-slate-400" size={16} />
						<span class="text-slate-500">Enter a valid email</span>
					{/if}
				</div>
				<div class="flex items-center space-x-2 transition-colors duration-300">
					{#if hasPassword}
						<SquareCheck class="text-green-500" size={16} />
						<span class="text-slate-600">Password entered</span>
					{:else}
						<XCircle class="text-slate-400" size={16} />
						<span class="text-slate-500">Password cannot be empty</span>
					{/if}
				</div>
				<div class="flex items-center space-x-2 transition-colors duration-300">
					{#if isOnline}
						<SquareCheck class="text-green-500" size={16} />
						<span class="text-slate-600">Online</span>
					{:else}
						<XCircle class="text-slate-400" size={16} />
						<span class="text-slate-500">Reconnect to the internet</span>
					{/if}
				</div>
				<div class="flex items-center space-x-2 transition-colors duration-300">
					{#if !isLockedOut}
						<SquareCheck class="text-green-500" size={16} />
						<span class="text-slate-600">Not locked out</span>
					{:else}
						<XCircle class="text-slate-400" size={16} />
						<span class="text-slate-500">Locked due to attempts</span>
					{/if}
				</div>
			</div>

			{#if errorMessage}
				<p class="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-600" role="alert">{errorMessage}</p>
			{/if}

			<div class="flex items-center justify-between pt-1">
				<label class="inline-flex items-center gap-2 text-sm text-slate-600">
					<input type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
					<span>Remember me</span>
				</label>
				<a href="/forgot-password" class="text-sm font-medium text-blue-600 hover:underline">Forgot password?</a>
			</div>

			<div class="space-y-3 pt-2">
				<button
					type="submit"
					disabled={!canSubmit}
					class="flex w-full cursor-pointer justify-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}
						<Loader2 class="mr-2 animate-spin" size={20} />
						<span>Signing in...</span>
					{:else}
						<span>Sign In</span>
					{/if}
				</button>
			</div>
		</form>

		<p class="mt-6 text-center text-sm text-slate-600">
			New to Tracefii?
			<a href="/signup" class="font-semibold text-blue-600 hover:underline">Create an account</a>
		</p>
	</div>
</div>
