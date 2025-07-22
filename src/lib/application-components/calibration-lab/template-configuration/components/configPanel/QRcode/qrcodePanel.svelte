<script lang="ts">
	import * as fabric from 'fabric';
	import QRCode from 'qrcode';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();

	const activeObject = $derived<ExtendedFabricObject | undefined>(
		editor?.canvas?.getActiveObject() as ExtendedFabricObject
	);

	let expression = $state('{{default_qrcode}}');
	let errorLevel = $state('H');
	let evaluatedValue = $state('default');
	let debounceTimer: NodeJS.Timeout | null = null;
	let isUpdating = $state(false);

	// Load data when active object changes
	$effect(() => {
		if (activeObject && activeObject.data?.type === 'QR Code') {
			expression = activeObject.data?.expression || '{{default_qrcode}}';
			errorLevel = activeObject.data?.errorCorrectionLevel || 'H';

			const evaluated = evaluateExpression(expression);
			evaluatedValue = evaluated;
		}
	});

	const evaluateExpression = (expr: string) =>
		expr.replace('{{default_qrcode}}', `https://metquay.com/generated/${Date.now()}`);

	const generateQRCode = async () => {
		if (!activeObject || activeObject.data?.type !== 'QR Code' || isUpdating) return;

		isUpdating = true;

		const evaluated = evaluateExpression(expression);
		evaluatedValue = evaluated;

		console.log('QR Code Panel - Regenerating QR code with:', {
			expression,
			errorLevel,
			evaluatedValue
		});

		try {
			const url = await QRCode.toDataURL(evaluated, {
				errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
				width: 512
			});

			// Use fabric's fromURL method which is more reliable
			const img = await new Promise<fabric.FabricImage>((resolve, reject) => {
				fabric.FabricImage.fromURL(
					url,
					{
						crossOrigin: 'anonymous'
					},
					(fabricImg : any, isError : any) => {
						if (isError || !fabricImg) {
							reject(new Error('Failed to load QR code image'));
						} else {
							resolve(fabricImg);
						}
					}
				);
			});

			// Preserve the current object's properties
			const currentObject = editor.canvas.getActiveObject() as ExtendedFabricObject;
			if (currentObject && currentObject.data?.type === 'QR Code') {
				img.set({
					left: currentObject.left,
					top: currentObject.top,
					scaleX: currentObject.scaleX,
					scaleY: currentObject.scaleY,
					angle: currentObject.angle,
					originX: currentObject.originX || 'left',
					originY: currentObject.originY || 'top',
					data: {
						type: 'QR Code',
						expression: expression,
						errorCorrectionLevel: errorLevel
					}
				});

				// Replace the object
				editor.canvas.remove(currentObject);
				editor.canvas.add(img);
				editor.canvas.setActiveObject(img);
				editor.canvas.requestRenderAll();
			}
		} catch (err) {
			console.error('QR Code generation failed:', err);
		} finally {
			isUpdating = false;
		}
	};

	const debouncedUpdate = () => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			generateQRCode();
		}, 500);
	};


	let previousExpression = $state('');
	let previousErrorLevel = $state('');

	$effect(() => {
		if (activeObject && activeObject.data?.type === 'QR Code') {
			const evaluated = evaluateExpression(expression);
			evaluatedValue = evaluated;

			if (expression !== previousExpression || errorLevel !== previousErrorLevel) {
				previousExpression = expression;
				previousErrorLevel = errorLevel;

				const currentExpression = activeObject.data?.expression || '{{default_qrcode}}';
				const currentErrorLevel = activeObject.data?.errorCorrectionLevel || 'H';

				if (expression !== currentExpression || errorLevel !== currentErrorLevel) {
					debouncedUpdate();
				}
			}
		}
	});

	// Cleanup on destroy
	$effect(() => {
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	});
</script>

<div class="space-y-4">
	<!-- Error Correction Level -->
	<div class="flex flex-col gap-1">
		<label for="error-level" class="text-sm font-medium text-gray-700">
			Error Correction Level
		</label>
		<select
			id="error-level"
			bind:value={errorLevel}
			class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
		>
			<option value="L">Low (~7%)</option>
			<option value="M">Medium (~15%)</option>
			<option value="Q">Quartile (~25%)</option>
			<option value="H">High (~30%)</option>
		</select>
	</div>

	<!-- Expression -->
	<div class="flex flex-col gap-1">
		<label for="expression" class="text-sm font-medium text-gray-700">QR Code Content</label>
		<input
			id="expression"
			type="text"
			bind:value={expression}
			placeholder="Enter URL or text"
			class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
		/>
		<div class="mt-1 text-xs text-gray-500">
			<div class="font-medium">Preview:</div>
			<div class="break-all" title={evaluatedValue}>
				{evaluatedValue.length > 50 ? evaluatedValue.substring(0, 50) + '...' : evaluatedValue}
			</div>
		</div>
	</div>

	{#if isUpdating}
		<div class="flex items-center gap-2 text-xs text-blue-600">
			<div
				class="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent"
			></div>
			Generating QR code...
		</div>
	{/if}
</div>
