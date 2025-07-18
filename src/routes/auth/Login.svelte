<script>
	import Button from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
    let { stage = $bindable() } = $props();

</script>

<div class="flex h-full w-full items-center justify-center bg-gray-50">
  <div class="h-full flex justify-center items-center pt-2 w-full lg:w-1/2 p-5">
    <div class="flex flex-col gap-6 sm:h-full w-[400px]">
      <div class="flex justify-center h-9 mt-10 bg-blue-700">
        <img
          src="https://127.0.0.1:5173/src/assets/Metquay%20logo%20Black.png"
          alt="Logo"
          class="object-contain"
        />
      </div>
      <div class="flex-grow flex items-center justify-center">
        <div class="w-full flex flex-col gap-6">
          <h1 class="text-3xl sm:text-4xl font-semibold text-center mt-14">
            Login to your account
          </h1>
          <p class="text-center text-sm text-gray-600">
            Do not have an account?{" "}
            <span
              class="text-blue-500 cursor-pointer underline italic"
              onclick={() => stage = "Signup"}
            >
              Create
            </span>
          </p>
          <div class="flex flex-col gap-4">
            <Input
              placeholder="Enter your Email Id"
            />
            <div>
              <Input
                placeholder="Enter your Password"
              />
              <p
                class="text-red-800 text-xs ml-2 cursor-pointer hover:underline"
              >
                Forgot password?
              </p>
            </div>
            <Button
              color="secondary"
              class="text-md bg-purple-800 p-6"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
      <p class="text-gray-500 text-xs text-center mt-14">
        © 2025 Metquay Inc. All rights reserved{" "}
      </p>
    </div>
  </div>
</div>