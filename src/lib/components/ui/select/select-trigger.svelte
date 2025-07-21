<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = "default",
		 placeholder,
		value,
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps> & {
		size?: "sm" | "default";
		value?: string | null; 
		placeholder?: string; 
	} = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	data-slot="select-trigger"
	data-size={size}
	class={cn(
		"min-w-[20rem] min-h-[2.75rem] font-normal border rounded-[0.5rem] cursor-pointer pl-3",
		"flex items-center justify-between",
		"focus:border-[var(--unchecked-focus)] focus:ring-4 focus:ring-[var(--ring-checkbox)]",
		!value ? "text-[var(--select-trigger)]" : "text-[var(--input)]", 
		className
	)}
	{...restProps}
>
	<span class="truncate">
		{#if value}
			{value}
		{:else}
			{placeholder}
		{/if}
	</span>
	<ChevronDownIcon class="size-[1.25rem] opacity-50 text-[var(--select-trigger)]" />
</SelectPrimitive.Trigger>
