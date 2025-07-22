<script lang="ts">
	import { Check, ChevronDown } from '@lucide/svelte';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface SelectItem {
		value: string;
		label: string;
	}

	interface Props {
		value?: string;
		items?: SelectItem[];
		placeholder?: string;
		size?: 'tiny' | 'small' | 'medium' | 'large';
		class?: string;
		id?: string;
	}

	let {
		value = $bindable(''),
		items = [],
		placeholder = 'Select an option',
		size = 'medium',
		class: className = '',
		id
	}: Props = $props();

	let isOpen = $state(false);
	let buttonRef = $state<HTMLButtonElement>();
	let dropdownRef = $state<HTMLDivElement>();
	let isMobile = $state(false);
	let dropdownPosition = $state<'top' | 'bottom'>('bottom');

	// Size classes
	const sizeClasses = {
		tiny: 'h-[24px] text-xs leading-3',
		small: 'h-[32px] px-[6px] text-sm leading-4',
		medium: 'h-[40px] px-[10px] text-sm leading-[20px]',
		large: 'h-[48px] px-[14px] text-base leading-[24px]'
	};

	// Get display label
	const displayLabel = $derived(() => {
		const selected = items.find(item => item.value === value);
		return selected ? selected.label : placeholder;
	});

	// Check if mobile
	$effect(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 768;
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	// Calculate dropdown position
	function calculatePosition() {
		if (!buttonRef || isMobile) return;
		
		const rect = buttonRef.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const spaceBelow = viewportHeight - rect.bottom;
		const spaceAbove = rect.top;
		
		// If not enough space below, show above
		dropdownPosition = spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom';
	}

	// Toggle dropdown
	function toggle() {
		if (!isOpen) {
			calculatePosition();
		}
		isOpen = !isOpen;
	}

	// Select item
	function selectItem(itemValue: string) {
		value = itemValue;
		isOpen = false;
	}

	// Handle click outside
	function handleClickOutside(event: MouseEvent) {
		if (!buttonRef || !dropdownRef) return;
		
		const target = event.target as Node;
		if (!buttonRef.contains(target) && !dropdownRef.contains(target)) {
			isOpen = false;
		}
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			event.stopPropagation(); // Prevent modal from closing
			isOpen = false;
		}
	}

	// Add/remove event listeners
	$effect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleKeydown);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		}
		
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="relative inline-block {className}">
	<!-- Trigger Button -->
	<button
		bind:this={buttonRef}
		{id}
		type="button"
		onclick={toggle}
		class="
			{sizeClasses[size]}
			flex items-center justify-between w-full
			rounded-[6px] 
			bg-kui-light-bg dark:bg-kui-dark-bg 
			border border-kui-light-gray-200 dark:border-kui-dark-gray-400 
			hover:border-kui-light-gray-500 dark:hover:border-kui-dark-gray-500
			focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
			transition-colors duration-200
		"
	>
		<span class="text-kui-light-gray-1000 dark:text-kui-dark-gray-1000 truncate pr-2">
			{displayLabel()}
		</span>
		<ChevronDown 
			class="w-4 h-4 text-kui-light-gray-900 dark:text-kui-dark-gray-900 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" 
		/>
	</button>

	<!-- Desktop Dropdown -->
	{#if isOpen && !isMobile}
		<div
			bind:this={dropdownRef}
			in:fly={{ y: dropdownPosition === 'bottom' ? -10 : 10, duration: 200 }}
			out:fly={{ y: dropdownPosition === 'bottom' ? -10 : 10, duration: 150 }}
			class="
				absolute w-full z-50
				{dropdownPosition === 'bottom' ? 'top-[calc(100%+4px)]' : 'bottom-[calc(100%+4px)]'}
				bg-kui-light-bg dark:bg-kui-dark-bg 
				rounded-[6px] 
				border border-kui-light-gray-200 dark:border-kui-dark-gray-400 
				shadow-lg
				overflow-hidden
			"
		>
			<div class="max-h-[240px] overflow-y-auto p-1">
				{#each items as item (item.value)}
					<button
						type="button"
						onclick={() => selectItem(item.value)}
						class="
							relative w-full text-left
							px-3 py-2 text-sm
							rounded-[4px]
							hover:bg-kui-light-gray-100 dark:hover:bg-kui-dark-gray-100
							focus:bg-kui-light-gray-100 dark:focus:bg-kui-dark-gray-100
							focus:outline-none
							transition-colors duration-150
							{value === item.value ? 'text-kui-light-gray-1000 dark:text-kui-dark-gray-1000 font-medium' : 'text-kui-light-gray-900 dark:text-kui-dark-gray-900'}
						"
					>
						<span class="block truncate pr-6">{item.label}</span>
						{#if value === item.value}
							<div 
								in:fade={{ duration: 150 }}
								class="absolute right-2 top-1/2 -translate-y-1/2"
							>
								<Check class="w-4 h-4 text-kui-light-gray-1000 dark:text-kui-dark-gray-1000" />
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Mobile Dropdown -->
	{#if isOpen && isMobile}
		<!-- Backdrop -->
		<div
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
			class="fixed inset-0 bg-black bg-opacity-40 z-40"
			onclick={() => isOpen = false}
		></div>
		
		<!-- Mobile Panel -->
		<div
			bind:this={dropdownRef}
			in:fly={{ y: '50vh', duration: 300, opacity: 1 }}
			out:fly={{ y: '100vh', duration: 300, easing: cubicOut, opacity: 1 }}
			class="
				fixed bottom-0 left-0 right-0 z-50
				bg-kui-light-bg-secondary dark:bg-kui-dark-bg-secondary
				rounded-t-[20px]
			"
		>
			<!-- Handle -->
			<div class="flex justify-center pt-2 pb-1">
				<div class="w-10 h-1 bg-kui-light-gray-400 dark:bg-kui-dark-gray-400 rounded-full" ></div>
			</div>
			
			<!-- Items -->
			<div class="max-h-[60vh] overflow-y-auto px-3 pb-3">
				<div class="bg-kui-light-bg dark:bg-kui-dark-bg rounded-[10px] p-1">
					{#each items as item (item.value)}
						<button
							type="button"
							onclick={() => selectItem(item.value)}
							class="
								relative w-full text-left
								px-3 py-3 text-base
								rounded-[6px]
								hover:bg-kui-light-gray-100 dark:hover:bg-kui-dark-gray-100
								active:bg-kui-light-gray-200 dark:active:bg-kui-dark-gray-200
								transition-colors duration-150
								{value === item.value ? 'text-kui-light-gray-1000 dark:text-kui-dark-gray-1000 font-medium' : 'text-kui-light-gray-900 dark:text-kui-dark-gray-900'}
							"
						>
							<span class="block truncate pr-6">{item.label}</span>
							{#if value === item.value}
								<div 
									in:fade={{ duration: 150 }}
									class="absolute right-3 top-1/2 -translate-y-1/2"
								>
									<Check class="w-5 h-5 text-kui-light-gray-1000 dark:text-kui-dark-gray-1000" />
								</div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
			
			<!-- Done Button -->
			<div class="p-4 border-t border-kui-light-gray-200 dark:border-kui-dark-gray-200">
				<button
					type="button"
					onclick={() => isOpen = false}
					class="
						w-full py-3 px-4
						bg-kui-light-gray-200 dark:bg-kui-dark-gray-200
						hover:bg-kui-light-gray-300 dark:hover:bg-kui-dark-gray-300
						text-kui-light-gray-1000 dark:text-kui-dark-gray-1000
						font-medium text-base
						rounded-[8px]
						transition-colors duration-200
					"
				>
					Done
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Hide scrollbar but keep functionality */
	.hide-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>