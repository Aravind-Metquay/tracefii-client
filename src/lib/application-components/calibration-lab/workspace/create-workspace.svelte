<script lang="ts">
	import { useCreateNewWorkspace } from '@/api/queries/workspace-query';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/command';
	import type { WorkspaceType } from '@/Types';

	let existingWorkspaces: WorkspaceType[] = [];

	let authToken: string = 'your-actual-jwt-token-here';
	let isOpen = $state(false);
	let workspaceName = $state('');
	let workspaceCode = $state('');
	let isLoading = $state(false);
	let orgId = $state('6858fc200f95cc2a2101ac11');
	let name = $state('testUser');

	const createNewWorkspace = useCreateNewWorkspace();

	function generateWorkspaceCode(name: string): string {
		if (!name) return '';
		const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
		if (cleanName.length <= 3) return cleanName.padEnd(3, 'X');
		const positions: number[] = [];
		while (positions.length < 3) {
			const randomPos = Math.floor(Math.random() * cleanName.length);
			if (!positions.includes(randomPos)) positions.push(randomPos);
		}
		positions.sort((a, b) => a - b);
		return positions.map((pos) => cleanName[pos]).join('');
	}

	function ensureUniqueCode(baseCode: string): string {
		let finalCode = baseCode;
		let counter = 1;
		while (existingWorkspaces.some((ws) => ws.workspaceCode === finalCode)) {
			finalCode = `${baseCode}${counter}`;
			counter++;
		}
		return finalCode;
	}

	function validateWorkspace(): boolean {
		if (
			existingWorkspaces.some(
				(ws) => ws.workspaceName.toLowerCase() === workspaceName.toLowerCase()
			)
		) {
			window.alert('Workspace name already exists');
			return false;
		}
		if (existingWorkspaces.some((ws) => ws.workspaceCode === workspaceCode)) {
			window.alert('Workspace code already exists');
			return false;
		}
		return true;
	}

	$effect(() => {
		if (workspaceName) {
			const baseCode = generateWorkspaceCode(workspaceName);
			const uniqueCode = ensureUniqueCode(baseCode);
			workspaceCode = uniqueCode;
		} else {
			workspaceCode = '';
		}
	});

	async function handleSubmit() {
		if (!validateWorkspace()) return;
		isLoading = true;
		try {
			const workspace: Omit<WorkspaceType, '_id'> = {
				orgId,
				workspaceName,
				workspaceCode,
				createdAt: new Date(),
				createdBy: name
			};
			await $createNewWorkspace.mutateAsync({ workspaceData: workspace, token: authToken });
			window.alert('Workspace created successfully');
			isOpen = false;
			workspaceCode = '';
			workspaceName = '';
		} catch (error) {
			window.alert('Failed to create workspace');
			console.error('Unable to create a workspace', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div>
	<Button size="sm" onclick={() => (isOpen = true)} color="primary">Add New</Button>

	{#if isOpen}
		<!-- Backdrop -->
		<div
			class="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
			onclick={() => (isOpen = false)}
		>
			<!-- Modal Box -->
			<div class="w-[400px] max-w-[90%] rounded-xl bg-white p-6 shadow-lg">
				<!-- Header -->
				<div class="font-dm_sans mb-4 text-lg font-semibold">Create New Workspace</div>

				<!-- Body -->
				<div class="flex flex-col gap-3">
					<Input
						name="Workspace Name"
						class="font-dm_sans"
						placeholder="Enter workspace name"
						bind:value={workspaceName}
						required
					/>
					<Input
						name="Workspace Code"
						class="font-dm_sans"
						placeholder="Auto-generated 3-character code"
						bind:value={workspaceCode}
						oninput={(e) => (workspaceCode = e.currentTarget.value.slice(0, 3).toUpperCase())}
						maxlength={3}
					/>
				</div>

				<!-- Footer -->
				<div class="mt-6 flex justify-end gap-2">
					<Button
						color="danger"
						variant="default"
						onclick={() => (isOpen = false)}
						size="sm"
						class="font-dm_sans"
					>
						Cancel
					</Button>
					<Button
						color="primary"
						onclick={handleSubmit}
						size="sm"
						disabled={isLoading}
						class="font-dm_sans"
					>
						{isLoading ? 'Creating' : 'Create Workspace'}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.font-dm_sans) {
		font-family: 'DM Sans', sans-serif;
	}
</style>
