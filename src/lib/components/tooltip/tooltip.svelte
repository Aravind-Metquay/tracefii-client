<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		position?: 'top' | 'bottom' | 'left' | 'right';
		text: string;
		class?: string;
		children: Snippet;
	}

	let { position = 'top', text, class: _class = '', children }: Props = $props();


	const baseClasses = `absolute z-10 invisible group-hover:visible 
    px-3 py-1.5 text-xs text-center rounded-md shadow-lg 
    w-max max-w-xs`;

	const themeClasses = 'bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900';

	const arrowBaseClasses = `after:content-[''] after:absolute after:border-[5px]`;


	const tooltipClasses = $derived.by(() => {
		let positionClasses = '';

		switch (position) {
			case 'bottom':
				positionClasses = `
                    top-full mt-2 left-1/2 -translate-x-1/2
                    ${arrowBaseClasses} after:bottom-full after:left-1/2 after:-translate-x-1/2
                    after:border-x-transparent after:border-t-transparent
                    after:border-b-gray-900 dark:after:border-b-gray-200
                `;
				break;
			case 'left':
				positionClasses = `
                    right-full mr-2 top-1/2 -translate-y-1/2
                    ${arrowBaseClasses} after:left-full after:top-1/2 after:-translate-y-1/2
                    after:border-y-transparent after:border-r-transparent
                    after:border-l-gray-900 dark:after:border-l-gray-200
                `;
				break;
			case 'right':
				positionClasses = `
                    left-full ml-2 top-1/2 -translate-y-1/2
                    ${arrowBaseClasses} after:right-full after:top-1/2 after:-translate-y-1/2
                    after:border-y-transparent after:border-l-transparent
                    after:border-r-gray-900 dark:after:border-r-gray-200
                `;
				break;
			default: 
				positionClasses = `
                    bottom-full mb-2 left-1/2 -translate-x-1/2
                    ${arrowBaseClasses} after:top-full after:left-1/2 after:-translate-x-1/2
                    after:border-x-transparent after:border-b-transparent
                    after:border-t-gray-900 dark:after:border-t-gray-200
                `;
				break;
		}

		return `${baseClasses} ${themeClasses} ${positionClasses}`;
	});
</script>

<span class="group relative inline-block {_class}">
	{@render children()}

	<span class={tooltipClasses}>
		{text}
	</span>
</span>