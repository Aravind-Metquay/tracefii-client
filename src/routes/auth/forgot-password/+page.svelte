<script lang='ts'>
	import { goto } from '$app/navigation';
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { auth } from '@/svelte-auth0';
	import { ArrowLeft } from '@lucide/svelte';


	let email : string = $state('')

	$effect(() => {
		if (auth.isLoading) {
			if (auth.isAuthenticated) {
				goto('/dashboard');
			}
		}
	});
</script>

<div class="flex h-full w-full items-center justify-center bg-gray-50">
	<div class="flex h-full w-full items-center justify-center p-5 lg:w-1/2">
		<div class="flex h-full w-[400px] flex-col gap-15">
			<div class="mt-4 flex h-9 w-full justify-center">
				<img src="/Metquay logo Black.png" class="object-contain" />
			</div>
			<div class="flex flex-grow items-center justify-center">
				<div class="flex w-full flex-col gap-6 pb-20">
					<h1 class="  text-center text-3xl font-semibold sm:text-4xl">Forgot Password?</h1>
					<p class="text-center text-xs text-gray-600">
						Enter your email to recieve instructions to reset password
					</p>
					<div class="flex flex-col gap-4">
						<Input class="text-xs" placeholder="Enter your email address" bind:value={email} />
						<Button class="text-md w-full p-6" onclick={()=>auth.sendResetPasswordEmail(email)}>Reset Password</Button>
					</div>
					<p
						class="mb-10 flex cursor-pointer flex-row items-center justify-center text-center text-xs text-gray-500"
						onclick={() => goto('/auth/login')}
					>
						<ArrowLeft size="12" strokeWidth="2" />
						Back to log in
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
