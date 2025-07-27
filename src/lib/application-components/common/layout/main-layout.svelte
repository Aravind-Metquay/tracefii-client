<script lang="ts">
	import {
		Bell,
		CheckSquare,
		FileText,
		Mail,
		Phone,
		ChartBar,
		Command
	} from '@lucide/svelte';
	import SidebarIcon from './sidebar-icon.svelte';

	type MenuItem = {
		icon: typeof Bell;
		label: string;
		href: string;
	};

	const mainMenuItems: MenuItem[] = [
		{ icon: Bell, label: 'Notifications', href: '#' },
		{ icon: CheckSquare, label: 'Dashboard', href: '#' },
		{ icon: FileText, label: 'Users', href: '#' },
		{ icon: Mail, label: 'Items', href: '#' },
		{ icon: Phone, label: 'Customers', href: '#' },
		{ icon: ChartBar, label: 'Assets', href: '#' }
	];
</script>

<div class="flex h-screen w-[220px] flex-col border-r border-gray-300">
	<div
		class="mb-4 flex cursor-pointer items-center justify-between border-b px-1 hover:bg-gray-100"
	>
		<div class="flex items-center gap-2 p-3">
			<div class="flex h-8 w-7 items-center justify-center rounded-md bg-slate-800 text-white">
				<Command size={16} />
			</div>
			<span class="text-md font-semibold">Tracefii</span>
		</div>
		<SidebarIcon size="24" color="gray" />
	</div>

	<nav class="flex flex-1 flex-col px-1.5">
		{#each mainMenuItems as item}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-md px-2 py-1 text-sm font-medium text-black hover:bg-gray-200 hover:text-gray-900"
			>
				<svelte:component this={item.icon} size={18} class="text-gray-500" />
				<span class="text-sm">{item.label}</span>
			</a>
		{/each}
	</nav>
</div>