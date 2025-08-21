<script lang="ts">
	// @ts-ignore
	import GridTable from '@/application-components/common/grid-table/grid-table.svelte';
	import CreateWorkspaceModal from './create-workspace.svelte';
	import EditDeleteButtons from './EditDeleteButtons.svelte';
	import type { WorkspaceType } from '@/Types';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import {
		ChevronDown,
		Check,
		ChevronLeft,
		ChevronRight,
		Settings2,
		Plus,
		Search
	} from '@lucide/svelte';

	let { workspaces, totalCount, page, limit, onPageChange, onLimitChange, onSearchChange } =
		$props<{
			workspaces: WorkspaceType[];
			totalCount: number;
			page: number;
			limit: number;
			onPageChange: (page: number) => void;
			onLimitChange: (limit: number) => void;
			onSearchChange: (value: string) => void;
			onWorkspaceUpdated: () => void;
		}>();

	let filterValue = $state('');
	let visibleColumns = $state(
		new Set(['id', 'workspaceName', 'workspaceCode', 'modifiedBy', 'actions'])
	);
	let isDropdownOpen = $state(false);
	let showCreateModal = $state(false);

	const columns = $state([
		{ name: 'ID', id: 'id', sortable: true, header: 'ID' },
		{ name: 'Name', id: 'workspaceName', sortable: true, header: 'Name' },
		{ name: 'Code', id: 'workspaceCode', sortable: true, header: 'Code' },
		{ name: 'Created By', id: 'createdBy', sortable: true, header: 'Created By' },
		{ name: 'Created At', id: 'createdAt', sortable: true, header: 'Created At' },
		{ name: 'Modified By', id: 'modifiedBy', sortable: true, header: 'Modified By' },
		{ name: 'Modified At', id: 'modifiedAt', sortable: true, header: 'Modified At' },
		{ name: 'Actions', id: 'actions', header: 'Actions', sortable: false, cell: EditDeleteButtons }
	]);

	$effect(() => {
		onSearchChange(filterValue);
	});

	// Close dropdown when clicking outside
	function handleOutsideClick(event: Event) {
		if (isDropdownOpen && !(event.target as HTMLElement)?.closest('.dropdown-container')) {
			isDropdownOpen = false;
		}
	}

	const headerColumns = $derived(columns.filter((column) => visibleColumns.has(column.id)));

	function handleRowsPerPageChange(event: Event) {
		const newLimit = Number((event.target as HTMLSelectElement).value);
		onLimitChange(newLimit);
	}

	function toggleColumn(columnId: string) {
		// Prevent removing all columns
		if (visibleColumns.size === 1 && visibleColumns.has(columnId)) {
			return;
		}

		const newSet = new Set(visibleColumns);
		if (newSet.has(columnId)) {
			newSet.delete(columnId);
		} else {
			newSet.add(columnId);
		}
		visibleColumns = newSet;
	}

	const pages = $derived(Math.ceil(totalCount / limit));

	function formatDate(dateString: string) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function truncateId(id: string) {
		if (!id) return '';
		return id.length > 12 ? id.substring(0, 12) + '...' : id;
	}
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="flex h-full flex-col bg-white">
	<!-- Header -->
	<div class="flex flex-col gap-4 border-b border-gray-200 bg-white p-6">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
					<div class="h-4 w-4 rounded-sm bg-white"></div>
				</div>
				<div class="flex items-center gap-2">
					<h1 class="text-xl font-semibold text-gray-900">Workspaces</h1>
					<span class="rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-600"
						>{totalCount}</span
					>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<!-- Search Input -->
				<div class="relative">
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						class="w-64 border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500"
						placeholder="Search workspaces..."
						bind:value={filterValue}
					/>
				</div>

				<!-- Columns Dropdown -->
				<div class="dropdown-container relative">
					<Button
						size="sm"
						variant="outline"
						onclick={() => (isDropdownOpen = !isDropdownOpen)}
						class="flex items-center gap-2 border-gray-300"
					>
						<Settings2 class="h-4 w-4" />
						Columns
						<ChevronDown class="h-4 w-4" />
					</Button>

					{#if isDropdownOpen}
						<div
							class="absolute right-0 z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg"
						>
							<div class="flex flex-col">
								{#each columns as column}
									<button
										class="flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50"
										onclick={() => toggleColumn(column.id)}
									>
										{#if visibleColumns.has(column.id)}
											<Check class="h-4 w-4 flex-shrink-0 text-purple-600" />
										{:else}
											<span class="h-4 w-4 flex-shrink-0"></span>
										{/if}
										<span class="text-gray-700">{column.name}</span>
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<CreateWorkspaceModal existingWorkspaces={workspaces} />
			</div>
		</div>
	</div>

	<!-- Table Container -->
	<div class="flex-1 overflow-hidden bg-white">
		{#if workspaces.length === 0}
			<div class="flex h-96 flex-col items-center justify-center text-gray-500">
				<div class="mb-2 text-lg font-medium">No workspaces found</div>
				<div class="text-sm">Create your first workspace to get started</div>
				<Button
					class="mt-4 bg-purple-600 hover:bg-purple-700"
					onclick={() => (showCreateModal = true)}
				>
					<Plus class="mr-2 h-4 w-4" />
					Create Workspace
				</Button>
			</div>
		{:else}
			<div class="h-full overflow-auto">
				<GridTable data={workspaces} columns={headerColumns} />
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	<div class="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
		<div class="flex items-center gap-2 text-sm text-gray-700">
			Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalCount)} of {totalCount} results
		</div>

		<div class="flex items-center gap-2">
			<Button
				size="sm"
				variant="outline"
				onclick={() => onPageChange(page - 1)}
				disabled={page === 1}
				class="border-gray-300 p-2"
			>
				<ChevronLeft class="h-4 w-4" />
			</Button>

			<span class="px-3 py-1 text-sm text-gray-600">
				Page {page} of {pages}
			</span>

			<Button
				size="sm"
				variant="outline"
				onclick={() => onPageChange(page + 1)}
				disabled={page === pages}
				class="border-gray-300 p-2"
			>
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>

		<div class="flex items-center gap-2">
			<label class="flex items-center gap-2 text-sm text-gray-600">
				Rows per page:
				<select
					class="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
					value={limit}
					onchange={handleRowsPerPageChange}
				>
					<option value="5">5</option>
					<option value="10">10</option>
					<option value="15">15</option>
					<option value="20">20</option>
					<option value="50">50</option>
				</select>
			</label>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for table */
	.overflow-auto::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.overflow-auto::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 4px;
	}

	.overflow-auto::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 4px;
	}

	.overflow-auto::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
