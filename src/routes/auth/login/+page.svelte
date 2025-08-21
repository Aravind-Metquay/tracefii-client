<script lang='ts'>
	import { goto } from '$app/navigation';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { auth , login } from '@/svelte-auth0';

	let email = $state('');
	let password = $state('');

	$effect(()=>{
		if(auth.isLoading){
			if(auth.isAuthenticated){
				goto('/dashboard')
			}
		}
	})
</script>

<div class="flex h-full w-full items-center justify-center bg-gray-50">
	<div class="flex h-full w-full items-center justify-center p-5 lg:w-1/2">
		<div class="flex h-full w-[400px] flex-col justify-between gap-15">
			<div class="mt-4 flex h-9 w-full justify-center">
				<img src="/Metquay logo Black.png" alt="Logo" class="object-contain" />
			</div>
			<div class="flex flex-grow items-center justify-center">
				<div class="flex w-full flex-col gap-6 pb-20">
					<h1 class="mt-14 text-center text-3xl font-semibold sm:text-4xl">
						Login to your account
					</h1>
					<p class="text-center text-xs text-gray-600">
						Do not have an account?{' '}
						<span
							class="cursor-pointer text-xs text-blue-500 italic underline"
							onclick={() => goto('/auth/signup')}
						>
							Create
						</span>
					</p>
					<div class="flex flex-col gap-4">
						<Input class="text-xs" bind:value={email} placeholder="Enter your email address " />
						<div>
							<Input class="text-xs" bind:value={password} placeholder="Enter your password" />
							<p
								class="ml-1 pt-2 cursor-pointer text-xs text-red-500 hover:underline"
								onclick={() => goto('/auth/forgot-password')}
							>
								Forgot password?
							</p>
						</div>
						<div class="flex w-full  gap-2 pt-2">
							<Button class="text-md w-full p-2" onclick={() => login({ email, password })}>
							Log In
						</Button>
						<Button class="text-md w-full p-2" onclick={() => goto('/dashboard')}>
							Dev Mode
						</Button></div>
						
					</div>
				</div>
			</div>
			<p class="pb-10 text-center text-xs text-gray-500">
				© 2025 Metquay Inc. All rights reserved{' '}
			</p>
		</div>
	</div>
</div>
