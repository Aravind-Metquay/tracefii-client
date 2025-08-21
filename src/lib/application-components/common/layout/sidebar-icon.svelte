<script>
	import { appState } from "@/global-store.svelte";

	let { size, color } = $props();
	
    function toggle() {
		appState.setSidebarStatus(!appState.getSidebarStatus())
	}
</script>

<button
	class="sidebar-toggle"
	onclick={toggle}
	aria-label={appState.getSidebarStatus() ? 'Expand sidebar' : 'Collapse sidebar'}
	style="--size: {size}px; --color: {color};"
>
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		class="icon"
		class:collapsed={appState.getSidebarStatus()}
	>
		<rect
			x="3"
			y="4"
			width="18"
			height="16"
			rx="2"
			stroke={color}
			stroke-width="1.5"
			fill="none"
			class="frame"
		/>

		<line x1="9" y1="4" x2="9" y2="20" stroke={color} stroke-width="1.5" class="divider" />

		<line
			x1="5"
			y1="8"
			x2="7.5"
			y2="8"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			class="menu-line line1"
		/>
		<line
			x1="5"
			y1="11"
			x2="7.5"
			y2="11"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			class="menu-line line2"
		/>
		<line
			x1="5"
			y1="14"
			x2="7.5"
			y2="14"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			class="menu-line line3"
		/>

		<path
			d="M15 10l-2 2 2 2"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="arrow"
		/>
	</svg>
</button>

<style>
	.sidebar-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: var(--size);
		height: var(--size);
		border: none;
		background: transparent;
		cursor: pointer;
		border-radius: 6px;
		transition: background-color 0.2s ease;
		color: var(--color);
	}

	.sidebar-toggle:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.sidebar-toggle:active {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.icon {
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.arrow {
		transform-origin: 15px 12px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.collapsed .arrow {
		transform: rotate(180deg);
	}

	.divider {
		transform-origin: 9px 12px;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.collapsed .divider {
		transform: scaleX(0);
	}

	.menu-line {
		transform-origin: left center;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.collapsed .line1 {
		transform: scaleX(0.6);
		opacity: 0.6;
	}

	.collapsed .line2 {
		transform: scaleX(0.4);
		opacity: 0.4;
	}

	.collapsed .line3 {
		transform: scaleX(0.6);
		opacity: 0.6;
	}

	.frame {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.collapsed .frame {
		width: 6;
		rx: 1;
	}
</style>
