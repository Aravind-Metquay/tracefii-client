<!-- <script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { createModalState } from './root.svelte.js';
	import { preventScroll } from '@/components/utils/general.js';
	import { fade } from 'svelte/transition';

	interface Props {
		active: boolean;
		sticky?: boolean;
		children: Snippet;
	}
	let { active = $bindable(false), sticky = false, children }: Props = $props();

	let dialog: HTMLDialogElement;

	const rootState = createModalState({
		isMobile: false,
		isActive: active,
		sticky: sticky
	});

	setContext('modal', rootState);

	$effect(() => {
		active = rootState.getIsActive();
	});

	$effect(() => {
		if (active) {
			dialog.showModal();
			rootState.setIsActive(true);
			preventScroll(active);
		} else {
			rootState.setIsActive(false);
			const id = setTimeout(() => {
				dialog.close();
				clearTimeout(id);
			}, 250);
			preventScroll(active);
		}
	});

	$effect(() => {
		if (window.innerWidth < 767) {
			rootState.setIsMobile(true);
		} else {
			rootState.setIsMobile(false);
		}
		// update when the user is resizing the window
		window.addEventListener('resize', () => {
			if (window.innerWidth < 767) {
				rootState.setIsMobile(true);
			} else {
				rootState.setIsMobile(false);
			}
		});
	});
</script>

{#if active}
	<div
		in:fade|local={{ duration: 100 }}
		out:fade|local={{ duration: 100 }}
		class="bg-kui-black bg-opacity-40 fixed top-0 left-0 z-[1000] h-full w-full"
	></div>
{/if}

<dialog
	bind:this={dialog}
	class="m-0 h-auto max-h-none w-auto max-w-none border-none bg-transparent p-0 outline-none backdrop:bg-transparent"
	onclick={(e) => {
		if (e.target === dialog && !sticky) {
			active = false;
		}
	}}
	onkeydown={(e) => {
		if (e.key === 'Escape' && !sticky) {
			active = false;
		}
	}}
>
	{@render children()}
</dialog> -->

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import { createModalState } from './root.svelte.js';
	import { preventScroll } from '@/components/utils/general.js';
	import { fade } from 'svelte/transition';

	interface Props {
		active: boolean;
		sticky?: boolean;
		children: Snippet;
	}
	let { active = $bindable(false), sticky = false, children }: Props = $props();

	let dialog: HTMLDialogElement;
	const rootState = createModalState({
		isMobile: false,
		isActive: active,
		sticky: sticky
	});

	setContext('modal', rootState);

	$effect(() => {
		rootState.isActive = active;
	});

	$effect(() => {
		active = rootState.isActive;
	});

	// $effect(() => {
	// 	if (active) {
	// 		dialog.showModal();
	// 		preventScroll(true);
	// 	} else {
	// 		preventScroll(false);
	// 	}
	// });

	$effect(() => {
		if (active) {
			// dialog.showModal();
		}
	});

	$effect(() => {
		const updateMobileState = () => {
			rootState.isMobile = window.innerWidth < 767;
		};

		updateMobileState();

		window.addEventListener('resize', updateMobileState);

		return () => {
			window.removeEventListener('resize', updateMobileState);
		};
	});
</script>

{#if active}
	<div
		in:fade|local={{ duration: 100 }}
		out:fade|local={{ duration: 100 }}
		class="bg-kui-black bg-opacity-40 fixed top-0 left-0 z-[1000] h-full w-full"
	></div>
{/if}

<dialog
	bind:this={dialog}
	class="m-0 flex h-auto max-h-none w-auto max-w-none items-center justify-center border-none bg-transparent p-0 outline-none backdrop:bg-transparent"
	onclose={() => {
		active = false;
	}}
	onclick={(e) => {
		if (e.target === dialog && !sticky) {
			active = false;
		}
	}}
	onkeydown={(e) => {
		if (e.key === 'Escape' && !sticky) {
			active = false;
		}
	}}
>
	<div
		onoutroend={() => {
			dialog.close();
		}}
	>
		{@render children()}
	</div>
</dialog>
