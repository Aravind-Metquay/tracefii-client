<script lang="ts">
	import { SquareCheck, CheckCircle2 } from '@lucide/svelte';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let passwordMatch = false;

	const PasswordRules = [
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
</script>

<div class="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
	<div class="w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
		<div class="flex flex-col items-center space-y-4 text-center">
			<img src='/tracefii_logo.png' class="w-32"/>

			<div class="space-y-1">
				<h1 class="text-2xl font-bold text-slate-800">Create your Tracefii account</h1>
				<p class="text-sm text-slate-500">Make your calibration journey easier</p>
			</div>
		</div>

		<form class="mt-8 space-y-4">
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-slate-600">Email*</label>
				<input
					bind:value={email}
					type="email"
					id="email"
					placeholder="Enter your email"
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-slate-600">Password*</label>
				<input
					bind:value={password}
					type="password"
					id="password"
					placeholder="Create a password"
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

            {#if password.length > 0}
            <div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                {#each PasswordRules as { rule, validate }}
                    <div class="flex items-center space-x-2">
                        <SquareCheck class={validate(password) ? 'text-green-500' : 'text-slate-400'} size={16} />
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
					class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
                {#if confirmPassword.length > 0 && password.length > 0}
                <div class="mt-2 flex items-center space-x-2 text-xs">
                    {#if passwordMatch}
                        <CheckCircle2 class="text-green-500" size={16} />
                        <span class="text-green-600">Passwords match!</span>
                    {:else}
                        <span class="text-red-500">Passwords do not match.</span>
                    {/if}
                </div>
                {/if}
			</div>

			<p class="text-center text-xs text-slate-500">
				By continuing, you agree to Tracefii'
				<a href="#" class="font-medium text-blue-600 hover:underline">Terms of Service</a>
				and
				<a href="#" class="font-medium text-blue-600 hover:underline">Privacy Policy</a>
			</p>

			<div class="space-y-3 pt-2">
				<button
					type="submit"
					class="cursor-pointer flex w-full justify-center rounded-md bg-gray-600 px-4 py-2 font-semibold text-white transition hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Get Started
				</button>
			</div>
		</form>

		<p class="mt-6 text-center text-sm text-slate-600">
			Already have an account?
			<a href="#" class="font-semibold text-blue-600 hover:underline">Sign in</a>
		</p>
	</div>
</div>
