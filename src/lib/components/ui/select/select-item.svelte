<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		...restProps
	}: WithoutChild<SelectPrimitive.ItemProps> = $props();
</script>

<SelectPrimitive.Item
	bind:ref
	{value}
	data-slot="select-item"
	class={cn(
		"w-[320px] h-[44px] px-[14px] py-[10px] text-[var(--input)] font-medium text-base hover:bg-[var(--secondary-hover)]",
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute right-2 flex size-5 items-center justify-center">
			{#if selected}
				<CheckIcon class="size-5 text-primary" />
			{/if}
		</span>
		{#if childrenProp}
			{@render childrenProp({ selected, highlighted })}
		{:else}
			{label || value}
		{/if}
	{/snippet}
</SelectPrimitive.Item>
