<script lang="ts">
	import 'filepond/dist/filepond.min.css';
	import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
	import FilePond, { registerPlugin } from 'svelte-filepond';

	const FilePondComponent = FilePond as any;

	import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
	import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
	import { Button } from '@/components/ui/button';
	import { onMount } from 'svelte';

	registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

	let files: File[] = [];
	let showUploader = $state(false);

	let {
		availableComponents = [],
		onSelectComponent,
		editor
	} = $props<{
		availableComponents?: string[];
		onSelectComponent?: (component: string) => void;
		editor?: any;
	}>();

	const componentIcons: Record<string, string> = {
		Text: '📝',
		Date: '📅',
		Image: '🖼️',
		Barcode: '📊',
		'QR Code': '📱'
	};

	const customerId = 'demo'; // Replace this dynamically as needed

	// ✅ Upload image to your SvelteKit API which uploads to Cloudflare
	async function uploadImageToServer(file: File): Promise<string> {
		const reader = new FileReader();

		return new Promise((resolve, reject) => {
			reader.onload = async () => {
				const fileWithContent = {
					file: {
						name: file.name,
						size: file.size,
						type: file.type,
						lastModified: file.lastModified
					},
					content: reader.result,
					customerId
				};

				try {
					const res = await fetch('/calibration-lab/api/upload', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(fileWithContent)
					});

					const data = await res.json();

					if (res.ok && data.url) {
						resolve(data.url);
					} else {
						reject(data.error || 'Unknown upload error');
					}
				} catch (e) {
					console.error('Upload error:', e);
					reject(e);
				}
			};

			reader.onerror = () => reject('Failed to read file');
			reader.readAsDataURL(file);
		});
	}

	function handleComponentClick(component: string) {
		onSelectComponent?.(component);

		if (!editor) return;

		switch (component) {
			case 'Text':
				editor.addText?.();
				break;
			case 'Date':
				editor.addDate?.();
				break;
			case 'Image':
				showUploader = true;
				break;
			case 'QR Code':
				editor.addQRCode?.();
				break;
			case 'Barcode':
				editor.addBarcode?.();
				break;
		}
	}

	onMount(() => {
		const closeOnEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') showUploader = false;
		};
		window.addEventListener('keydown', closeOnEscape);
		return () => window.removeEventListener('keydown', closeOnEscape);
	});
</script>

<!-- Toolbar -->
<div class="component-toolbar flex justify-center gap-2 rounded-lg p-4">
	{#each availableComponents as component}
		<Button
			onclick={() => handleComponentClick(component)}
			class="flex min-w-[80px] items-center justify-center gap-1 border-0 bg-white p-3 text-black shadow-lg"
		>
			<span class="text-2xl">{componentIcons[component] || '📄'}</span>
			<span class="text-xs">{component}</span>
		</Button>
	{/each}
</div>

<!-- FilePond Modal -->
{#if showUploader}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-md rounded-lg bg-white p-6">
			<h2 class="mb-4 text-center text-lg font-bold">Upload Image</h2>

			<FilePondComponent
				name="file"
				{files}
				allowMultiple={false}
				acceptedFileTypes={['image/*']}
				onaddfile={(error: any, file: any) => {
					if (!error && file?.file) {
						uploadImageToServer(file.file)
							.then((url) => {
								editor?.addImage?.(url);
								showUploader = false;
							})
							.catch((err) => {
								console.error('Upload failed:', err);
							});
					}
				}}
			/>

			<div class="mt-4 text-center">
				<Button onclick={() => (showUploader = false)}>Cancel</Button>
			</div>
		</div>
	</div>
{/if}
