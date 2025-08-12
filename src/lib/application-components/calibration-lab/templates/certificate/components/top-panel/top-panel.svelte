<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	import jsPDF from 'jspdf';
	import html2canvas from 'html2canvas-pro';
	import EditModal from '../edit-modal/edit-modal.svelte';

	// Local state for the certificate title
	let title: string = certificate.data.certificateTitle ?? '';
	let titleInput: HTMLInputElement | null = null;
	let isEditModalOpen = false;

	function setTitle(newTitle: string) {
		certificate.data.certificateTitle = newTitle;
	}

	function openEditModal() {
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
	}

	async function triggerExport() {
		try {
			const certificatePages = document.querySelectorAll(
				'.certificate-page:not(.measurement-page)'
			);
			if (certificatePages.length === 0) {
				alert('Certificate preview not found');
				return;
			}

			// Convert dimensions from mm to points (1 mm = 2.834645669 pts)
			const mmToPts = 2.834645669;
			const pdfWidth = certificate.page.width * mmToPts;
			const pdfHeight = certificate.page.height * mmToPts;

			const pdf = new jsPDF({
				orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
				unit: 'pt',
				format: [pdfWidth, pdfHeight]
			});

			for (let i = 0; i < certificatePages.length; i++) {
				const pageElement = certificatePages[i] as HTMLElement;
				const canvas = await html2canvas(pageElement, {
					scale: 2, // Higher quality
					useCORS: true,
					allowTaint: true
				});
				const imgData = canvas.toDataURL('image/png');

				if (i > 0) pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			}

			pdf.save(
				`${certificate.data.certificateTitle == '' ? 'untitled' : certificate.data.certificateTitle}.pdf`
			);
		} catch (error) {
			alert('Error generating PDF. Please try again.');
		}
	}
</script>

<div class="flex w-full items-center justify-between">
	<div class="flex items-center gap-3">
		<button type="button" class="pt-2 pl-6">
			<h2 class="cursor-pointer font-semibold">&larr; Back</h2>
		</button>
		<input
			class="w-40 pt-2 text-xl underline decoration-dotted placeholder-black focus:ring-0 focus:outline-none"
			type="text"
			id="CertificateTitle"
			placeholder="Untitled Design"
			bind:this={titleInput}
			bind:value={title}
			onkeydown={(e) => {
				if (e.key === 'Enter') {
					setTitle(title);
					titleInput?.blur();
					e.preventDefault();
				}
			}}
			onblur={() => setTitle(title)}
		/>
	</div>

	<!-- Right group: Edit + Download -->
	<div class="flex gap-3 pt-2 pr-2">
		<button
			class="flex-shrink-0 rounded-lg bg-gray-200 p-2 font-medium text-gray-800 transition-colors hover:bg-gray-400"
			type="button"
			onclick={openEditModal}>Edit</button
		>
		<button
			class="flex-shrink-0 rounded-lg bg-black p-2 font-medium text-white transition-colors hover:bg-gray-800"
			type="button"
			onclick={triggerExport}>Download</button
		>
	</div>
</div>

<!-- Edit Modal -->
<EditModal isOpen={isEditModalOpen} onClose={closeEditModal} />
