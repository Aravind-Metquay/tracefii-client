<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { SquareCheck, Eye } from '@lucide/svelte';
	let password = $state('');
	let confirmPassword = $state('');
	let passwordMatch = $state(false);
    let { stage = $bindable() } = $props();

	const PasswordRules = [
		{
			rule: 'must contain at least 8 letters',
			validate: (pwd: string) => pwd.length >= 8
		},
		{
			rule: 'must contain atleast 1 capital letter',
			validate: (pwd: string) => /[A-Z]/.test(pwd)
		},
		{
			rule: 'must contain at least one number',
			validate: (pwd: string) => /\d/.test(pwd)
		},
		{
			rule: 'must contain at least one special character',
			validate: (pwd: string) => /[!@#$%^&*]/.test(pwd)
		}
	];
	$effect(() => {
		if (password.length > 0 && confirmPassword.length > 0) {
			if (password == confirmPassword) {
				passwordMatch = true;
			} else {
				passwordMatch = false;
			}
		}
	});
</script>

<div class="flex h-full w-full items-center justify-center ">
	<div class="flex h-full w-full items-center justify-center p-5 lg:w-1/2">
		<div class="gap-15 flex h-full w-[400px] flex-col justify-between">
			<div class="mt-4 flex h-9 w-full justify-center ">
				<img
					src="https://127.0.0.1:5173/src/assets/Metquay%20logo%20Black.png"
					alt="Logo"
					class="object-contain"
				/>
			</div>
			<div class="flex flex-col gap-4">
				<h1 class="text-center text-4xl font-semibold">Create an account</h1>
				<p class="text-center text-gray-600 text-xs">
					Already have an account?{' '}
					<span class="cursor-pointer italic text-blue-500 underline" onclick={() => stage = "Login"} > Log in </span>
				</p>
				<div class="flex flex-col gap-4">
					<Input class="text-xs" placeholder="Enter your Email Id" />
					<div>
						<Input class="text-xs" bind:value={password} placeholder="Enter your Password" />
						<ul class="pt-1 text-xs text-gray-600">
							{#each PasswordRules as { rule, validate }, index}
								<li class="flex items-center  text-xs text-gray-500">
									<SquareCheck
										size="14"
										strokeWidth="2"
										class={validate(password) ? 'mr-1 text-green-500' : 'mr-1 text-gray-500'}
									/>
									{rule}
								</li>
							{/each}
						</ul>
					</div>
					<div class="flex flex-col">
						<Input class="text-xs" bind:value={confirmPassword} placeholder="Confirm Password" />
						<span
							class="text-xs text-red-500 transition-opacity duration-200"
							class:opacity-100={!passwordMatch &&
								password.length > 0 &&
								confirmPassword.length > 0}
							class:opacity-0={passwordMatch ||
								password.length === 0 ||
								confirmPassword.length === 0}
						>
							Passwords do not match.
						</span>
					</div>

					<Button class="text-md  w-full p-6">Sign Up</Button>
				</div>
			</div>
			<p class="text-center text-xs text-gray-500 pb-10">
				By creating an account, you agree to our{' '}
				<a class="underline">Terms and Conditions</a>
			</p>
		</div>
	</div>
</div>
