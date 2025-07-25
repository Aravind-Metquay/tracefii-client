<script lang="ts">
	import LoaderCircle from '@/components/icons/loader-circle.svelte';
	import type { Component, Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		buttonElement?: HTMLButtonElement;
		onclick?: (evt: Event) => void;
		class?: string;
		shape?: 'circle' | 'square' | undefined;
		size?: 'tiny' | 'small' | 'medium' | 'large';
		variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';
		iconPrefix?: Component | undefined;
		iconSuffix?: Component | undefined;
		rounded?: boolean;
		loading?: boolean;
		disabled?: boolean;
		children: Snippet;
	}

	let {
		buttonElement = $bindable(),
		onclick = undefined,
		class: _class = '',
		shape = undefined,
		size = 'medium',
		variant = 'primary',
		iconPrefix = undefined,
		iconSuffix = undefined,
		rounded = false,
		loading = false,
		disabled = false,
		children,
		...rest
	}: Props = $props();

	const sizeObj = {
		tiny: 'h-[24px] text-xs leading-3',
		small: 'h-[32px] px-[6px] text-sm leading-4',
		medium: 'h-[40px] px-[10px] text-sm leading-[20px]',
		large: 'h-[48px] px-[14px] text-base leading-[24px]'
	};
	const shapeSizeObj = {
		tiny: `w-[24px] ${sizeObj.tiny}`,
		small: `w-[32px] ${sizeObj.small}`,
		medium: `w-[40px] ${sizeObj.medium}`,
		large: `w-[48px] ${sizeObj.large}`
	};
	let sizeClass = $derived.by(() => (shape ? shapeSizeObj[size] : sizeObj[size]));

	const prefixSuffixSpinnerObj = {
		tiny: 'w-[14px] h-[14px]',
		small: 'w-[16px] h-[16px]',
		medium: 'w-[16px] h-[16px]',
		large: 'w-[24px] h-[24px]'
	};
	let iconSize = $derived.by(() => prefixSuffixSpinnerObj[size]);

	const variantObj = {
		primary: `text-white dark:text-kui-dark-bg bg-kui-light-gray-1000 dark:bg-kui-dark-gray-1000 hover:bg-opacity-85 hover:dark:bg-opacity-90`,
		secondary: `text-kui-light-gray-1000 dark:text-kui-dark-gray-1000 bg-kui-light-bg dark:bg-kui-dark-bg border border-kui-light-gray-200 dark:border-kui-dark-gray-400 hover:bg-kui-light-gray-100 hover:dark:bg-kui-dark-gray-100`,
		tertiary: `text-kui-light-gray-1000 dark:text-kui-dark-gray-1000 hover:bg-kui-light-gray-200 hover:dark:bg-kui-dark-gray-200`,
		error: `text-[#F5F5F5] bg-kui-light-red-800 dark:bg-kui-dark-red-800 hover:bg-kui-light-red-900 hover:dark:bg-kui-dark-red-900`,
		warning: `text-kui-light-gray-1000 bg-kui-light-amber-700 dark:bg-kui-dark-amber-700 hover:bg-kui-light-amber-800 hover:dark:bg-kui-dark-amber-800`
	};
	let typeClass = $derived.by(() => variantObj[variant]);

	let roundedStyle = $derived.by(() => (rounded ? 'rounded-full' : 'rounded-[6px]'));

	const radiusObj = {
		tiny: 'rounded-[4px]',
		small: 'rounded-[6px]',
		medium: 'rounded-[6px]',
		large: 'rounded-[8px]'
	};
	let roundedWithShapeStyle = $derived.by(() => (shape === 'circle' ? 'rounded-full' : radiusObj[size]));

	let radiusStyle = $derived.by(() => (shape ? roundedWithShapeStyle : roundedStyle));

	let loadingDisabledClass = $derived.by(() =>
		disabled || loading
			? 'cursor-not-allowed text-kui-light-gray-700 dark:text-kui-dark-gray-700 bg-kui-light-gray-100 dark:bg-kui-dark-gray-100 border border-kui-light-gray-200 dark:border-kui-dark-gray-400'
			: ''
	);

	let interactionClasses = $derived.by(() => 'hover:scale-[1.02] active:scale-[0.97] transform transition-transform ease-in-out duration-150');
	let transitionStyles = 'transition duration-200 ease-in-out hover:shadow-md active:shadow-sm';

	let buttonClass = $derived.by(() => {
		if (disabled || loading) {
			return `${sizeClass} ${radiusStyle} ${loadingDisabledClass} ${_class}`;
		}
		return `${sizeClass} ${typeClass} ${radiusStyle} ${interactionClasses} ${transitionStyles} ${_class} cursor-pointer`;
	});

	let clicked = $state(false);
	function handleClick(evt: Event) {
		if (onclick) onclick(evt);
		clicked = true;
		setTimeout(() => (clicked = false), 200);
	}
</script>

<!-- Spinner Snippet -->
{#snippet spinner()}
	{#if loading}
		<div class="relative {iconSize} animate-spin flex items-center justify-center">
			<div transition:fade class="absolute w-full h-full">
				<LoaderCircle />
			</div>
		</div>
	{/if}
{/snippet}

<!-- Prefix Icon or Spinner -->
{#snippet prefixSnip()}
	{#if iconPrefix}
		{@const Prefix = iconPrefix}
		<div class="{iconSize} flex items-center justify-center">
			<Prefix />
		</div>
	{:else if loading}
		{@render spinner()}
	{/if}
{/snippet}

<!-- Suffix Icon -->
{#snippet suffixSnip()}
	{#if iconSuffix}
		{@const Suffix = iconSuffix}
		<div class="{iconSize} flex items-center justify-center">
			<Suffix />
		</div>
	{/if}
{/snippet}

<!-- Button with shape -->
{#snippet withShape()}
	<button
		bind:this={buttonElement}
		type="button"
		onclick={handleClick}
		{disabled}
		class="{buttonClass} relative overflow-hidden"
		{...rest}
	>
		{#if clicked}
			<div class="absolute inset-0 rounded-full bg-current opacity-10 animate-ping z-0"></div>
		{/if}
		<div class="w-full h-full flex items-center justify-center relative z-10">
			<span class="font-medium first-letter:capitalize">
				{@render children()}
			</span>
		</div>
	</button>
{/snippet}

<!-- Button without shape -->
{#snippet mainButton()}
	<button
		bind:this={buttonElement}
		type="button"
		onclick={handleClick}
		{disabled}
		class="{buttonClass} relative overflow-hidden"
		{...rest}
	>
		{#if clicked}
			<div class="absolute inset-0 rounded-[inherit] bg-current opacity-10 animate-ping z-0"></div>
		{/if}
		<div class="w-full h-full px-[6px] flex items-center justify-center gap-[8px] relative z-10">
			{@render prefixSnip()}
			<span class="font-medium first-letter:capitalize">
				{@render children()}
			</span>
			{@render suffixSnip()}
		</div>
	</button>
{/snippet}

<!-- Render appropriate variant -->
{#if shape}
	{@render withShape()}
{:else}
	{@render mainButton()}
{/if}
