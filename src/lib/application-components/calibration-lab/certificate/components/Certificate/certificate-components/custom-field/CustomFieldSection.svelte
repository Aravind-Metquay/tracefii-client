<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';

	let { fieldId }: { fieldId: string } = $props();

	const customField = $derived(certificate.customFields[fieldId]);

	const fieldStyles = $derived(
		customField
			? `
		font-size: ${customField.styles.fontSize}px;
		font-weight: ${customField.styles.fontWeight};
		text-align: ${customField.styles.textAlign};
		margin: ${customField.styles.margin.top}px ${customField.styles.margin.right}px ${customField.styles.margin.bottom}px ${customField.styles.margin.left}px;
		background-color: ${customField.styles.backgroundColor};
		${customField.styles.border ? 'border: 1px solid #333;' : ''}
		padding: ${customField.styles.border ? '0.5rem' : '0'};
	`
			: ''
	);
</script>

{#if customField}
	<div class="custom-field-section" style={fieldStyles}>
		{#if customField.type === 'text'}
			<div class="custom-text">
				{@html customField.content.html || customField.content.text || ''}
			</div>
		{:else if customField.type === 'table'}
			<div class="custom-table">
				<table>
					{#if customField.content.headers && customField.content.headers.length > 0}
						<thead>
							<tr>
								{#each customField.content.headers as header}
									<th>{header}</th>
								{/each}
							</tr>
						</thead>
					{/if}
					<tbody>
						{#each customField.content.rows || [] as row}
							<tr>
								{#each row as cell}
									<td>{cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if customField.type === 'image'}
			<div class="custom-image">
				{#if customField.content.src}
					<img
						src={customField.content.src}
						alt={customField.content.alt || customField.name}
						style="max-width: {customField.content.maxWidth || '100%'}; height: auto;"
					/>
				{:else}
					<div class="image-placeholder">
						<p>Image placeholder: {customField.name}</p>
					</div>
				{/if}
			</div>
		{:else if customField.type === 'signature'}
			<div class="custom-signature">
				<div class="signature-area">
					{#if customField.content.signatureImage}
						<img src={customField.content.signatureImage} alt="Signature" class="signature-image" />
					{:else}
						<div class="signature-placeholder">
							<div class="signature-line"></div>
							<p class="signature-label">{customField.content.label || 'Signature'}</p>
							{#if customField.content.name}
								<p class="signature-name">{customField.content.name}</p>
							{/if}
							{#if customField.content.title}
								<p class="signature-title">{customField.content.title}</p>
							{/if}
							{#if customField.content.date}
								<p class="signature-date">Date: {customField.content.date}</p>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="custom-field-error">
		<p>Custom field "{fieldId}" not found</p>
	</div>
{/if}

<style>
	.custom-field-section {
		margin-bottom: 1.5rem;
		border-radius: 6px;
		transition: all 0.2s ease;
	}

	.custom-text {
		line-height: 1.6;
		word-wrap: break-word;
	}

	.custom-table {
		overflow-x: auto;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.custom-table table {
		width: 100%;
		border-collapse: collapse;
		background: white;
	}

	.custom-table th,
	.custom-table td {
		border: 1px solid #dee2e6;
		padding: 0.75rem;
		text-align: left;
		vertical-align: top;
	}

	.custom-table th {
		background: linear-gradient(135deg, #f8f9fa, #e9ecef);
		font-weight: 600;
		color: #495057;
		text-transform: uppercase;
		font-size: 0.85rem;
		letter-spacing: 0.5px;
	}

	.custom-table td {
		background: white;
		transition: background-color 0.2s ease;
	}

	.custom-table tr:hover td {
		background: #f8f9fa;
	}

	.custom-image {
		text-align: center;
		padding: 1rem;
	}

	.custom-image img {
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease;
	}

	.custom-image img:hover {
		transform: scale(1.02);
	}

	.image-placeholder {
		border: 2px dashed #dee2e6;
		padding: 3rem 2rem;
		text-align: center;
		color: #6c757d;
		background: linear-gradient(135deg, #f8f9fa, #ffffff);
		border-radius: 12px;
		transition: all 0.2s ease;
	}

	.image-placeholder:hover {
		border-color: #007bff;
		background: linear-gradient(135deg, #e3f2fd, #f8f9fa);
	}

	.image-placeholder p {
		margin: 0;
		font-weight: 500;
		font-size: 1.1rem;
	}

	.image-placeholder::before {
		content: '🖼️';
		display: block;
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.custom-signature {
		margin: 1.5rem 0;
		padding: 1rem;
		background: linear-gradient(135deg, #f8f9fa, #ffffff);
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}

	.signature-area {
		display: inline-block;
		min-width: 250px;
		text-align: center;
	}

	.signature-placeholder {
		text-align: center;
	}

	.signature-line {
		width: 250px;
		height: 2px;
		background: linear-gradient(90deg, #dee2e6, #495057, #dee2e6);
		margin: 0 auto 1rem auto;
		border-radius: 1px;
	}

	.signature-label {
		font-weight: 600;
		margin: 0.75rem 0 0.5rem 0;
		font-size: 0.9rem;
		color: #495057;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.signature-name {
		font-weight: 700;
		margin: 0.5rem 0;
		font-size: 1.1rem;
		color: #2c3e50;
	}

	.signature-title {
		font-style: italic;
		margin: 0.5rem 0;
		font-size: 0.95rem;
		color: #6c757d;
		font-weight: 500;
	}

	.signature-date {
		margin: 0.5rem 0;
		font-size: 0.9rem;
		color: #495057;
		font-weight: 500;
	}

	.signature-image {
		max-width: 250px;
		height: auto;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.custom-field-error {
		background: linear-gradient(135deg, #ffe6e6, #ffcccc);
		border: 2px solid #ff9999;
		padding: 1.5rem;
		border-radius: 8px;
		color: #cc0000;
		text-align: center;
		font-weight: 500;
		box-shadow: 0 4px 12px rgba(255, 153, 153, 0.2);
	}

	.custom-field-error::before {
		content: '⚠️';
		display: block;
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.custom-field-error p {
		margin: 0;
		font-size: 1.1rem;
	}
</style>
