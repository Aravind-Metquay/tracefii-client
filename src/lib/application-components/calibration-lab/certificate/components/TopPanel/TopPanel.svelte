<script lang="ts">
  import { certificate } from '@/calibration-lab/certificate/lib/store.svelte';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas-pro';

  // Local state for the certificate title
  let title: string = certificate.data.certificateTitle ?? '';
  let titleInput: HTMLInputElement | null = null;

  function setTitle(newTitle: string) {
    certificate.data.certificateTitle = newTitle;
    console.log('Saved Title:', certificate.data.certificateTitle);
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

      pdf.save(`${certificate.data.certificateTitle==""?"untitled":certificate.data.certificateTitle}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }
</script>

<div class="w-full flex items-center justify-between">
  <div class="flex items-center gap-3">
    <button type="button" class="pl-6 pt-2">
      <h2 class="font-semibold cursor-pointer">&larr; Back</h2>
    </button>
    <input
      class="underline decoration-dotted text-xl w-40 placeholder-black focus:outline-none focus:ring-0 pt-2"
      type="text"
      id="CertificateTitle"
      placeholder="Untitled Design"
      bind:this={titleInput}
      bind:value={title}
      on:keydown={(e) => {
        if (e.key === 'Enter') {
          setTitle(title);
          titleInput?.blur();
          e.preventDefault();
        }
      }}
      on:blur={() => setTitle(title)}
    />
  </div>

  <!-- Right group: Edit + Download -->
  <div class="flex gap-3 pt-2 pr-2">
    <button
      class="flex-shrink-0 rounded-lg bg-gray-200 p-2 font-medium text-gray-800 transition-colors hover:bg-gray-400"
      type="button"
    >Edit</button>
    <button
      class="flex-shrink-0 rounded-lg bg-black p-2 font-medium text-white transition-colors hover:bg-gray-800"
      type="button"
      on:click={triggerExport}
    >Download</button>
  </div>
</div>
