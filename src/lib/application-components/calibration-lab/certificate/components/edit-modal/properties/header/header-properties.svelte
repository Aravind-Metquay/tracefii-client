<script lang="ts">
	import { certificate, certificateActions } from '@/certificate/lib/store.svelte';
	import HeaderSection from '../../../certificate-components/components/header/header-section.svelte';

	// Import template images
	import HeaderDefault from './templates/Header-Default.png';
	import HeaderFirst from './templates/Header-First.png';
	import HeaderLast from './templates/Header-Last.png';
	import HeaderMid from './templates/Header-Mid.png';

	// Template mapping
	const templateImages: Record<string, string> = {
		'Header-Default.png': HeaderDefault,
		'Header-First.png': HeaderFirst,
		'Header-Last.png': HeaderLast,
		'Header-Mid.png': HeaderMid
	};

	function selectTemplate(templateFilename: string) {
		certificateActions.selectHeaderTemplate(templateFilename);
	}
</script>

<div class="flex h-full">
	<!-- Left Content Area -->
	<div class="flex flex-1 flex-col">
		<!-- Header Preview Only -->
		<div class="flex-1 overflow-auto p-6">
			<div class="flex items-start justify-center">
				<div class="overflow-hidden rounded-lg border border-gray-300 bg-white">
					<HeaderSection />
				</div>
			</div>
		</div>

		<!-- Header Template Selector -->
		<div class="border-t border-gray-200 bg-white p-6">
			<div class="flex items-center justify-center gap-8">
				{#each certificate.data.headerTemplates as template}
					<div class="flex flex-col items-center">
						<!-- Template Label -->
						<div class="mb-3">
							<span class="text-sm font-medium text-gray-700">{template.name}</span>
						</div>

						<!-- Template Preview -->
						<div class="relative">
							<button
								class="overflow-hidden rounded-lg border-2 transition-all duration-200 hover:shadow-lg {certificate
									.data.selectedHeaderTemplate === template.filename
									? 'border-red-500 ring-2 ring-red-200'
									: 'border-gray-200 hover:border-gray-300'}"
								onclick={() => selectTemplate(template.filename)}
							>
								<img
									src={templateImages[template.filename]}
									alt={template.name}
									class="h-20 w-32 object-cover"
								/>
							</button>

							<!-- Action buttons -->
							<div class="mt-3 flex justify-center gap-2">
								<button
									class="rounded-full border border-gray-200 bg-white p-1.5 text-gray-400 shadow-sm transition-colors hover:text-blue-600"
									title="Duplicate template"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										></path>
									</svg>
								</button>
								<button
									class="rounded-full border border-gray-200 bg-white p-1.5 text-gray-400 shadow-sm transition-colors hover:text-red-600"
									title="Delete template"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
				{/each}

				<!-- Add New Template Button -->
				<div class="flex flex-col items-center">
					<div class="mb-3">
						<span class="text-sm font-medium text-gray-500">Add Template</span>
					</div>
					<button
						class="group flex h-20 w-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
					>
						<svg
							class="h-8 w-8 text-gray-400 group-hover:text-gray-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 4v16m8-8H4"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Canvas Settings Panel -->
	<div class="flex w-80 flex-col border-l border-gray-200 bg-white">
		<!-- Canvas Header -->
		<div class="border-b border-gray-200 p-4">
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-medium text-gray-900">Canvas</h3>
				<button class="text-gray-400 hover:text-gray-600">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</button>
			</div>
		</div>

		<!-- Canvas Settings -->
		<div class="flex-1 space-y-6 p-4">
			<!-- Height Setting -->
			<div>
				<label for="height-input" class="mb-2 block text-sm font-medium text-gray-700">Height</label
				>
				<div class="flex gap-2">
					<input
						id="height-input"
						type="number"
						class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						value={certificate.page.height}
						onchange={(e) => {
							certificate.page.height = parseInt((e.target as HTMLInputElement).value);
						}}
					/>
					<select
						class="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						value={certificate.page.unit}
						onchange={(e) => {
							certificate.page.unit = (e.target as HTMLSelectElement).value;
						}}
					>
						<option value="mm">mm</option>
						<option value="px">px</option>
						<option value="in">in</option>
					</select>
				</div>
			</div>

			<!-- Set As Setting -->
			<div>
				<label for="set-as-select" class="mb-2 block text-sm font-medium text-gray-700"
					>Set As</label
				>
				<select
					id="set-as-select"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
					value={certificate.pagination.showHeaderOnAllPages
						? 'Header (All Pages)'
						: 'Header (First Page)'}
					onchange={(e) => {
						const value = (e.target as HTMLSelectElement).value;
						certificateActions.toggleHeaderOnAllPages(value === 'Header (All Pages)');
					}}
				>
					<option value="Header (All Pages)">Header (All Pages)</option>
					<option value="Header (First Page)">Header (First Page)</option>
					<option value="Footer (All Pages)">Footer (All Pages)</option>
				</select>
			</div>

			<!-- Page-Specific Headers -->
			{#if certificate.pagination.showHeaderOnAllPages && certificate.pagination.totalPages > 1}
				<div class="border-t border-gray-200 pt-4">
					<h4 class="mb-3 text-sm font-medium text-gray-700">Page-Specific Headers</h4>
					<div class="space-y-3">
						{#each Array(certificate.pagination.totalPages) as _, pageIndex}
							{@const pageNumber = pageIndex + 1}
							{@const pageHeader =
								certificate.data.pageSpecificHeaders[pageNumber] ||
								certificate.data.selectedHeaderTemplate}
							{@const isCustomHeader =
								certificate.data.pageSpecificHeaders[pageNumber] !== undefined}

							<div
								class="rounded-md border p-3 {isCustomHeader
									? 'border-blue-200 bg-blue-50'
									: 'border-gray-200'}"
							>
								<div class="mb-2 flex items-center justify-between">
									<span class="text-sm font-medium text-gray-800">
										Page {pageNumber}
										{#if isCustomHeader}
											<span class="ml-1 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700"
												>Custom</span
											>
										{/if}
									</span>
									{#if isCustomHeader}
										<button
											class="text-xs text-red-600 hover:text-red-800"
											onclick={() => certificateActions.clearPageHeader(pageNumber)}
										>
											Reset
										</button>
									{/if}
								</div>

								<select
									class="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
									value={pageHeader}
									onchange={(e) => {
										const filename = (e.target as HTMLSelectElement).value;
										if (filename === certificate.data.selectedHeaderTemplate) {
											certificateActions.clearPageHeader(pageNumber);
										} else {
											certificateActions.setPageHeader(pageNumber, filename);
										}
									}}
								>
									{#each certificate.data.headerTemplates as template}
										<option value={template.filename}>
											{template.name}
											{#if template.filename === certificate.data.selectedHeaderTemplate}
												(Default)
											{/if}
										</option>
									{/each}
								</select>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Save Button -->
		<div class="border-t border-gray-200 p-4">
			<button
				onclick={() => console.log('Needs impl')}
				class="w-full rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
			>
				Save
			</button>
		</div>
	</div>
</div>
