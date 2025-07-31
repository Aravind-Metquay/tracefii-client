<script lang="ts">
	import { certificate } from '@/calibration-lab/certificate/lib/store.svelte';
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas';

	async function triggerExport() {
		try {
			const certificatePages = document.querySelectorAll(
				'.certificate-page:not(.measurement-page)'
			);
			if (certificatePages.length === 0) {
				alert('Certificate preview not found');
				return;
			}

			// Convert dimensions from mm to points (1 mm = 2.834645669 points)
			const mmToPoints = 2.834645669;
			const pdfWidth = certificate.page.width * mmToPoints;
			const pdfHeight = certificate.page.height * mmToPoints;

			const pdf = new jsPDF({
				orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
				unit: 'pt',
				format: [pdfWidth, pdfHeight]
			});

			// Process each page
			for (let i = 0; i < certificatePages.length; i++) {
				const pageElement = certificatePages[i] as HTMLElement;
				const canvas = await html2canvas(pageElement, {
					scale: 2, // Higher quality
					useCORS: true,
					allowTaint: true
				});
				const imgData = canvas.toDataURL('image/png');

				if (i > 0) {
					pdf.addPage();
				}
				pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			}

			pdf.save(`certificate-${certificate.data.certificateNo}.pdf`);
		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Error generating PDF. Please try again.');
		}
	}
</script>

<div class="flex h-full flex-col gap-6 overflow-y-auto p-6">
	<!-- Action Buttons Header -->
	<div class="flex gap-3">
		<button
			class="flex-1 rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-200"
		>
			Edit
		</button>
		<button
			class="flex-1 rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
			onclick={triggerExport}
		>
			Download PDF
		</button>
	</div>

	<!-- Page Setup Group -->
	<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
		<h3 class="mb-4 text-lg font-semibold text-gray-900">Page Setup</h3>

		<div class="space-y-4">
			<div>
				<label for="format" class="mb-2 block text-sm font-medium text-gray-700">Format</label>
				<select
					id="format"
					bind:value={certificate.page.format}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
				>
					<option>A4</option>
					<option>Letter</option>
					<option>Custom</option>
				</select>
			</div>

			<div>
				<label for="unit" class="mb-2 block text-sm font-medium text-gray-700">Unit</label>
				<select
					id="unit"
					bind:value={certificate.page.unit}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
				>
					<option>mm</option>
					<option>px</option>
					<option>in</option>
				</select>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="width" class="mb-2 block text-sm font-medium text-gray-700">Width</label>
					<input
						id="width"
						type="number"
						bind:value={certificate.page.width}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="height" class="mb-2 block text-sm font-medium text-gray-700">Height</label>
					<input
						id="height"
						type="number"
						bind:value={certificate.page.height}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Margin Group -->
	<div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
		<h3 class="mb-4 text-lg font-semibold text-gray-900">Margin ({certificate.page.unit})</h3>

		<div class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="margin-top" class="mb-2 block text-sm font-medium text-gray-700">Top</label>
					<input
						id="margin-top"
						type="number"
						bind:value={certificate.page.margin.top}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="margin-right" class="mb-2 block text-sm font-medium text-gray-700"
						>Right</label
					>
					<input
						id="margin-right"
						type="number"
						bind:value={certificate.page.margin.right}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="margin-bottom" class="mb-2 block text-sm font-medium text-gray-700"
						>Bottom</label
					>
					<input
						id="margin-bottom"
						type="number"
						bind:value={certificate.page.margin.bottom}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="margin-left" class="mb-2 block text-sm font-medium text-gray-700">Left</label>
					<input
						id="margin-left"
						type="number"
						bind:value={certificate.page.margin.left}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	::-ms-scrollbar {
		display: none;
	}
</style>
