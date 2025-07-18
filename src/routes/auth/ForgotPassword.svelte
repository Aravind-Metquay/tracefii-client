<script>
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import { ArrowLeft } from '@lucide/svelte';
	let { stage = $bindable() } = $props();
</script>

<div class="flex h-full w-full items-center justify-center bg-gray-50">
	<div class="flex h-full w-full items-center justify-center p-5 lg:w-1/2">
		<div class="gap-15 flex h-full w-[400px] flex-col">
			<div class="mt-4 flex h-9 w-full justify-center">
				<img
                    src="/Metquay logo Black.png"
					class="object-contain"
				/>
			</div>
			<div class="flex flex-grow items-center justify-center">
				<div class="flex w-full flex-col gap-6 pb-20">
					<h1 class="  text-center text-3xl font-semibold sm:text-4xl">Forgot Password?</h1>
					<p class="text-center text-xs text-gray-600">
						Enter your email to recieve a one-time passcode
					</p>
					<div class="flex flex-col gap-4">
						<Input class="text-xs" placeholder="Enter your email address" />
						<Button class="text-md w-full p-6">Reset Password</Button>
					</div>
					<p
						class="mb-10 flex cursor-pointer flex-row items-center justify-center text-center text-xs text-gray-500"
						onclick={() => (stage = 'Login')}
					>
						<ArrowLeft size="12" strokeWidth="2" />
						Back to log in
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
