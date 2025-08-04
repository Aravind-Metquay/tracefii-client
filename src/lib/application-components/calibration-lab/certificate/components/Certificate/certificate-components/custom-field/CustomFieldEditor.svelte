<script lang="ts">
    import { certificate, certificateActions } from '@/certificate/lib/store.svelte';

    let {
        isOpen = $bindable(false),
        fieldId = $bindable(null),
        isNewField = $bindable(false),
        onclose
    }: {
        isOpen?: boolean;
        fieldId?: string | null;
        isNewField?: boolean;
        onclose?: () => void;
    } = $props();

    // Initialize form data as a proper reactive state
    let formData = $state({
        id: '',
        name: '',
        type: 'text' as 'text' | 'table' | 'image' | 'signature',
        content: {
            text: '',
            html: '',
            headers: [''],
            rows: [['']],
            src: '',
            alt: '',
            maxWidth: '100%',
            signatureImage: '',
            label: 'Signature',
            name: '',
            title: '',
            date: ''
        },
        styles: {
            fontSize: 14,
            fontWeight: 'normal',
            textAlign: 'left',
            margin: { top: 10, bottom: 10, left: 0, right: 0 },
            border: false,
            backgroundColor: 'transparent'
        }
    });

    // Track image loading state
    let imageLoading = $state(false);
    let imageError = $state(false);

    // Effect to load existing field data - fixed to prevent infinite loops
    $effect(() => {
        if (isOpen && fieldId && !isNewField && certificate.customFields[fieldId]) {
            const existingField = certificate.customFields[fieldId];
            // Use JSON methods for safe cloning since structuredClone has issues
            formData = JSON.parse(JSON.stringify(existingField));
        }
    });

    // Effect to initialize new field data - fixed to prevent infinite loops
    $effect(() => {
        if (isOpen && isNewField) {
            const timestamp = Date.now();
            formData = {
                id: `custom_${timestamp}`,
                name: 'New Custom Field',
                type: 'text',
                content: {
                    text: 'Enter your text here...',
                    html: '',
                    headers: ['Header 1', 'Header 2'],
                    rows: [
                        ['Cell 1', 'Cell 2'],
                        ['Cell 3', 'Cell 4']
                    ],
                    src: '',
                    alt: '',
                    maxWidth: '100%',
                    signatureImage: '',
                    label: 'Signature',
                    name: '',
                    title: '',
                    date: new Date().toISOString().split('T')[0]
                },
                styles: {
                    fontSize: 14,
                    fontWeight: 'normal',
                    textAlign: 'left',
                    margin: { top: 10, bottom: 10, left: 0, right: 0 },
                    border: false,
                    backgroundColor: 'transparent'
                }
            };
        }
    });

    // Image validation effect
    $effect(() => {
        if (formData.type === 'image' && formData.content.src) {
            validateImage(formData.content.src);
        }
    });

    function validateImage(src: string) {
        if (!src) {
            imageError = false;
            imageLoading = false;
            return;
        }

        imageLoading = true;
        imageError = false;

        const img = new Image();
        img.onload = () => {
            imageLoading = false;
            imageError = false;
        };
        img.onerror = () => {
            imageLoading = false;
            imageError = true;
        };
        img.src = src;
    }

    function handleSave() {
        try {
            if (isNewField) {
                certificateActions.addCustomField(formData);
            } else {
                certificateActions.updateCustomField(formData.id, formData);
            }
            handleClose();
        } catch (error) {
            console.error('Error saving custom field:', error);
        }
    }

    function handleClose() {
        isOpen = false;
        fieldId = null;
        // Reset form data to prevent stale data
        formData = {
            id: '',
            name: '',
            type: 'text',
            content: {
                text: '',
                html: '',
                headers: [''],
                rows: [['']],
                src: '',
                alt: '',
                maxWidth: '100%',
                signatureImage: '',
                label: 'Signature',
                name: '',
                title: '',
                date: ''
            },
            styles: {
                fontSize: 14,
                fontWeight: 'normal',
                textAlign: 'left',
                margin: { top: 10, bottom: 10, left: 0, right: 0 },
                border: false,
                backgroundColor: 'transparent'
            }
        };
        onclose?.();
    }

    function addTableRow() {
        const newRow = new Array(formData.content.headers.length).fill('');
        formData.content.rows = [...formData.content.rows, newRow];
    }

    function removeTableRow(index: number) {
        if (formData.content.rows.length > 1) {
            formData.content.rows = formData.content.rows.filter((_, i) => i !== index);
        }
    }

    function addTableColumn() {
        formData.content.headers = [...formData.content.headers, 'New Header'];
        formData.content.rows = formData.content.rows.map((row) => [...row, '']);
    }

    function removeTableColumn(index: number) {
        if (formData.content.headers.length > 1) {
            formData.content.headers = formData.content.headers.filter((_, i) => i !== index);
            formData.content.rows = formData.content.rows.map((row) => row.filter((_, i) => i !== index));
        }
    }

    function stopPropagation(event: MouseEvent) {
        event.stopPropagation();
    }

    function handleImageUrlChange() {
        imageError = false;
        imageLoading = false;
    }
</script>

{#if isOpen}
    <div
        class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black"
        onclick={handleClose}
        onkeydown={(e) => e.key === 'Escape' && handleClose()}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <div
            class="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl"
            onclick={stopPropagation}
            role="document"
        >
            <div class="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 class="text-xl font-semibold text-gray-900">
                    {isNewField ? 'Create Custom Field' : 'Edit Custom Field'}
                </h2>
                <button class="text-2xl text-gray-400 hover:text-gray-600" onclick={handleClose}
                    >&times;</button
                >
            </div>

            <div class="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
                <div class="mb-6">
                    <label for="field-name" class="mb-2 block text-sm font-medium text-gray-700"
                        >Field Name</label
                    >
                    <input
                        id="field-name"
                        type="text"
                        bind:value={formData.name}
                        class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    />
                </div>

                <div class="mb-6">
                    <label for="field-type" class="mb-2 block text-sm font-medium text-gray-700"
                        >Field Type</label
                    >
                    <select
                        id="field-type"
                        bind:value={formData.type}
                        class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                    >
                        <option value="text">Text</option>
                        <option value="table">Table</option>
                        <option value="image">Image</option>
                        <option value="signature">Signature</option>
                    </select>
                </div>

                <!-- Content based on type -->
                {#if formData.type === 'text'}
                    <div class="mb-6">
                        <label for="text-content" class="mb-2 block text-sm font-medium text-gray-700"
                            >Text Content</label
                        >
                        <textarea
                            id="text-content"
                            bind:value={formData.content.text}
                            rows="4"
                            class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                        ></textarea>
                    </div>
                {:else if formData.type === 'table'}
                    <div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div class="mb-4 block text-sm font-medium text-gray-700">Table Content</div>
                        <div class="rounded-lg border border-gray-300 bg-white p-4">
                            <div class="mb-4 flex gap-2">
                                <button
                                    type="button"
                                    onclick={addTableColumn}
                                    class="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
                                    >+ Add Column</button
                                >
                                <button
                                    type="button"
                                    onclick={addTableRow}
                                    class="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
                                    >+ Add Row</button
                                >
                            </div>
                            <div class="overflow-x-auto rounded-md border border-gray-200">
                                <table class="w-full border-collapse bg-white">
                                    <thead>
                                        <tr>
                                            {#each formData.content.headers as header, i (i)}
                                                <th class="relative min-w-[120px] border border-gray-300 bg-gray-50 p-2">
                                                    <input
                                                        type="text"
                                                        bind:value={formData.content.headers[i]}
                                                        class="w-full border-none bg-transparent p-1 font-semibold"
                                                    />
                                                    {#if formData.content.headers.length > 1}
                                                        <button
                                                            type="button"
                                                            class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white hover:bg-red-600"
                                                            onclick={() => removeTableColumn(i)}>×</button
                                                        >
                                                    {/if}
                                                </th>
                                            {/each}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each formData.content.rows as row, rowIndex (rowIndex)}
                                            <tr>
                                                {#each row as cell, cellIndex (cellIndex)}
                                                    <td class="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            bind:value={formData.content.rows[rowIndex][cellIndex]}
                                                            class="w-full border-none bg-transparent p-1"
                                                        />
                                                    </td>
                                                {/each}
                                                <td class="w-10 border border-gray-300 bg-gray-50 p-2 text-center">
                                                    {#if formData.content.rows.length > 1}
                                                        <button
                                                            type="button"
                                                            class="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white hover:bg-red-600"
                                                            onclick={() => removeTableRow(rowIndex)}>×</button
                                                        >
                                                    {/if}
                                                </td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                {:else if formData.type === 'image'}
                    <div class="mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div>
                            <label for="image-src" class="mb-2 block text-sm font-medium text-gray-700"
                                >Image URL</label
                            >
                            <input
                                id="image-src"
                                type="text"
                                bind:value={formData.content.src}
                                oninput={handleImageUrlChange}
                                placeholder="https://example.com/image.jpg"
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                            {#if imageLoading}
                                <div class="mt-2 text-sm text-blue-600">Loading image...</div>
                            {/if}
                            {#if imageError}
                                <div class="mt-2 text-sm text-red-600">Failed to load image. Please check the URL.</div>
                            {/if}
                        </div>
                        <div>
                            <label for="image-alt" class="mb-2 block text-sm font-medium text-gray-700"
                                >Alt Text</label
                            >
                            <input
                                id="image-alt"
                                type="text"
                                bind:value={formData.content.alt}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label for="image-width" class="mb-2 block text-sm font-medium text-gray-700"
                                >Max Width</label
                            >
                            <input
                                id="image-width"
                                type="text"
                                bind:value={formData.content.maxWidth}
                                placeholder="100%"
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <!-- Image Preview -->
                        {#if formData.content.src && !imageError && !imageLoading}
                            <div class="border-t pt-4">
                                <label class="mb-2 block text-sm font-medium text-gray-700">Preview</label>
                                <div class="rounded-md border border-gray-200 bg-white p-4">
                                    <img
                                        src={formData.content.src}
                                        alt={formData.content.alt || 'Preview'}
                                        style="max-width: {formData.content.maxWidth}; height: auto; max-height: 200px;"
                                        class="mx-auto rounded"
                                    />
                                </div>
                            </div>
                        {/if}
                    </div>
                {:else if formData.type === 'signature'}
                    <div class="mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div>
                            <label for="sig-label" class="mb-2 block text-sm font-medium text-gray-700"
                                >Signature Label</label
                            >
                            <input
                                id="sig-label"
                                type="text"
                                bind:value={formData.content.label}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label for="sig-name" class="mb-2 block text-sm font-medium text-gray-700">Name</label
                            >
                            <input
                                id="sig-name"
                                type="text"
                                bind:value={formData.content.name}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label for="sig-title" class="mb-2 block text-sm font-medium text-gray-700"
                                >Title</label
                            >
                            <input
                                id="sig-title"
                                type="text"
                                bind:value={formData.content.title}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label for="sig-date" class="mb-2 block text-sm font-medium text-gray-700">Date</label
                            >
                            <input
                                id="sig-date"
                                type="date"
                                bind:value={formData.content.date}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                    </div>
                {/if}

                <!-- Styling Options -->
                <div class="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 class="mb-4 text-lg font-semibold text-gray-900">Styling</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="font-size" class="mb-2 block text-sm font-medium text-gray-700"
                                >Font Size</label
                            >
                            <input
                                id="font-size"
                                type="number"
                                bind:value={formData.styles.fontSize}
                                min="8"
                                max="72"
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label for="font-weight" class="mb-2 block text-sm font-medium text-gray-700"
                                >Font Weight</label
                            >
                            <select
                                id="font-weight"
                                bind:value={formData.styles.fontWeight}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            >
                                <option value="normal">Normal</option>
                                <option value="bold">Bold</option>
                            </select>
                        </div>
                        <div>
                            <label for="text-align" class="mb-2 block text-sm font-medium text-gray-700"
                                >Text Align</label
                            >
                            <select
                                id="text-align"
                                bind:value={formData.styles.textAlign}
                                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                            </select>
                        </div>
                        <div class="flex items-center">
                            <label class="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    bind:checked={formData.styles.border}
                                    class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-gray-600 focus:ring-gray-500"
                                />
                                <span class="text-sm font-medium text-gray-700">Show Border</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end gap-3 border-t border-gray-200 p-6">
                <button
                    class="rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-gray-200"
                    onclick={handleClose}>Cancel</button
                >
                <button
                    class="rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800"
                    onclick={handleSave}>Save</button
                >
            </div>
        </div>
    </div>
{/if}