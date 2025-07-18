<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from "bits-ui";
	import CheckIcon from "@lucide/svelte/icons/check";
	import MinusIcon from "@lucide/svelte/icons/minus";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();
</script>

<CheckboxPrimitive.Root
	bind:ref
	data-slot="checkbox"
	class={cn([
	"min-w-[1rem] min-h-[1rem] cursor-pointer",

	// Default 
	"border border-[var(--unchecked-default)] rounded-[0.25rem]",

	// Hover 
	"hover:bg-[var(--unchecked-hover)] hover:border-primary",

	// Focus 
	"focus:ring-2 focus:ring-[var(--ring-checkbox)] data-[state=unchecked]:focus:border-[var(--unchecked-focus)]",

	// Disabled 
	"disabled:border-[var(--checkbox-disabled)] disabled:cursor-not-allowed disabled:opacity-50",

	// Checked State
	"data-[state=checked]:bg-[var(--checkbox-checked-bg)] data-[state=checked]:border-primary data-[state=checked]:text-primary",

	// Indeterminate State
	"data-[state=indeterminate]:text-primary data-[state=indeterminate]:border-primary"
]
,

		className
	)}
	bind:checked
	bind:indeterminate
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		<div data-slot="checkbox-indicator" class="text-current transition-none">
			{#if checked}
				<CheckIcon class="size-3.5" />
			{:else if indeterminate}
				<MinusIcon class="size-3.5" />
			{/if}
		</div>
	{/snippet}
</CheckboxPrimitive.Root>

