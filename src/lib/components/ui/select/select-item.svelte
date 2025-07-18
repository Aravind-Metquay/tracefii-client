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
		"w-[20rem] h-[2.75rem] px-[0.875rem] py-[0.625rem] text-[var(--input)] font-medium text-base hover:bg-[var(--secondary-hover)]",
		"flex items-center justify-between",
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="truncate">{#if childrenProp}
			{@render childrenProp({ selected, highlighted })}
			{:else}
			{label || value}
			{/if}
		</span>
		{#if selected}
			<CheckIcon class="w-[1.25rem] h-[1.25rem] text-primary" />
		{/if}
	{/snippet}
</SelectPrimitive.Item>

