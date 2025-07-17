<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import { useId } from "bits-ui";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined }) & {
				label?: string,hint?:string;
			}
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		label,
		hint,
		...restProps
	}: Props = $props();

	const inputId = useId();
</script>

<div 
	class="flex flex-col gap-1 group"
	aria-invalid={restProps['aria-invalid']}>

	{#if label}
		<label for={inputId} class=" text-left w-full text-[14px] text-[var(--secondary-foreground)] font-medium">		
			{label}
		</label>
	{/if}
		<input
			id={inputId}
			bind:this={ref}
			data-slot="input"
			class={cn(
				 "min-w-[20rem] min-h-[2.75rem] cursor-pointer border border-[var(--unchecked-default)] rounded-[0.5rem] px-[0.875rem] py-[0.625rem] disabled:cursor-not-allowed disabled:opacity-30",

				 "focus:outline-4 focus:outline-[var(--ring-checkbox)] focus:border-[var(--unchecked-focus)]",

                 "hover:placeholder:text-[var(--input)]",

                 "group-aria-invalid:border-[var(--destructive-border)] group-aria-invalid:focus:outline-[var(--ring-destructive)] group-aria-invalid:focus:border-[var(--destructive-border)]",
				className
			)}
			{type}
			bind:value
			{...restProps}
		/>
		{#if hint}
		<p class="group-aria-invalid:text-[var(--destructive-hint)] w-[20rem] h-[1.25rem] text-[var(--hint)] text-[0.875rem] font-normal leading-[1.25rem]">{hint}</p>
		{/if}
</div>
