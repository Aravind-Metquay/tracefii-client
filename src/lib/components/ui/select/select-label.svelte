<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {} = $props();
</script>

<div
	bind:this={ref}
	data-slot="select-label"
	class={cn("text-[var(--secondary-foreground)] font-medium min-h-[1.25rem] min-w-[6rem] text-sm pb-2", className)}
	{...restProps}
>
	{@render children?.()}
</div>
