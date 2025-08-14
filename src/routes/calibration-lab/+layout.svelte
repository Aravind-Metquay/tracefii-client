<script lang="ts">
    import MainLayout from "@/application-components/common/layout/main-layout.svelte";
	let { children } = $props();
    import { QueryClientProvider, QueryClient } from "@tanstack/svelte-query";
    const queryClient = new QueryClient();
</script>

<main class="h-screen bg-[#fbfbfb]">
    <div class="h-full w-full flex">
        <QueryClientProvider client={queryClient}>
        <MainLayout />
        <div class="h-full flex-1 bg-white min-w-0 overflow-x-auto">
	        {@render children()}
        </div>
    </QueryClientProvider>
    </div>
</main>
