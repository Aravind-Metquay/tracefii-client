<script lang="ts">
	import {
		Bell,
		House,
		Users,
		UserCog,
		FileQuestion,
		LayoutDashboard,
		Gavel,
		FileSpreadsheet,
		Waypoints,
		PaintRoller,
		BriefcaseBusiness,
		Settings,
	} from '@lucide/svelte';
	import SidebarIcon from './sidebar-icon.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	type MenuItem = {
		icon: typeof Bell;
		label: string;
		href: string;
	};

	const mainMenuItems: MenuItem[] = [
		{ icon: Bell, label: 'Notifications', href: '/calibration-lab/notifications' },
		{ icon: House, label: 'Dashboard', href: '/calibration-lab/dashboard' },
		{ icon: Users, label: 'Users', href: '/calibration-lab/users' },
		{ icon: UserCog, label: 'Roles', href: '/calibration-lab/roles' },
		{ icon: FileQuestion, label: 'Customers', href: '/calibration-lab/customers' },
		{ icon: LayoutDashboard, label: 'Items', href: '/calibration-lab/items' },
		{ icon: Gavel, label: 'Assets', href: '/calibration-lab/assets' },
		{ icon: FileSpreadsheet, label: 'Worksheets', href: '/calibration-lab/worksheets' },
		{ icon: Waypoints, label: 'Procedures', href: '/calibration-lab/procedures' },
		{ icon: PaintRoller, label: 'Templates', href: '/calibration-lab/templates' },
		{ icon: BriefcaseBusiness, label: 'Works', href: '/calibration-lab/works' },
		{ icon: Settings, label: 'Settings', href: '/calibration-lab/settings' }
	];
</script>

<div class="flex h-screen w-[220px] flex-col border-r border-gray-300">
	<div
		class="mb-4 flex cursor-pointer items-center justify-between border-b px-1 hover:bg-gray-100"
	>
		<div class="flex items-center gap-2 p-3">
			<div class="flex h-8 w-7 items-center justify-center rounded-md">
				<img
					class="rounded-md"
					src="https://static.wixstatic.com/media/bc33ce_f7ade799cadc4bdd93fb9e125e3b460e~mv2.png/v1/fill/w_192,h_192,lg_1,usm_0.66_1.00_0.01/bc33ce_f7ade799cadc4bdd93fb9e125e3b460e~mv2.png"
				/>
			</div>
			<span class="text-md font-semibold">Tracefii</span>
		</div>
		<SidebarIcon size="24" color="gray" />
	</div>

	<nav class="flex flex-1 flex-col px-1.5">
		{#each mainMenuItems as item}
			{@const isActive = page.url.pathname === item.href}
			<button
				onclick={() => goto(item.href)}
				class="flex items-center gap-3 rounded-md px-2 py-1 text-sm font-medium transition-colors {isActive
					? 'border-gray-500 bg-gray-200 text-gray-700'
					: 'text-black hover:bg-gray-200 hover:text-gray-900'}"
			>
				<svelte:component this={item.icon} size={18} class="text-gray-500" />
				<span class="text-sm">{item.label}</span>
	</button>
		{/each}
	</nav>
</div>
