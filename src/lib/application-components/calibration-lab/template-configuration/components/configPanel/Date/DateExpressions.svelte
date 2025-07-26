<script lang="ts">
	import { onMount } from 'svelte';
	import {
		dateVariables,
		textVariables,
		allDateVariables,
		getDateVariableDescription
	} from '../../../lib/dynamicVariables';
	import type { Editor } from '../../../lib/types';
	import type { Textbox } from 'fabric';

	export let editor: Editor;

	let value = '';
	let position: { top: number; right: number; width: number; height: number } | null = null;
	let visible = false;
	let showSuggestions = false;
	let activeObject: Textbox | null = null;
	let inputEl: HTMLTextAreaElement | null = null;
	let isInNativeEditMode = false;

	function updatePosition() {
		const canvas = editor?.canvas;
		if (!canvas) return;

		const active = canvas.getActiveObject() as Textbox;

		// Only show for date textboxes (customType === 'date')
		if (!active || active.type !== 'textbox' || (active as any).customType !== 'date') {
			visible = false;
			showSuggestions = false;
			position = null;
			activeObject = null;
			return;
		}

		const activeText = active.text || '';
		console.log(
			'DateExpressions - Active text:',
			activeText,
			'customType:',
			(active as any).customType
		);

		const canvasEl = canvas.getElement();
		if (!canvasEl) return;

		const bounds = canvasEl.getBoundingClientRect();
		const zoom = canvas.getZoom() || 1;
		const vpt = canvas.viewportTransform;

		// Calculate position with proper viewport transform
		const objLeft = (active.left ?? 0) + (vpt ? vpt[4] : 0);
		const objTop = (active.top ?? 0) + (vpt ? vpt[5] : 0);

		const newPosition = {
			top: bounds.top + objTop * zoom + window.scrollY,
			right: window.innerWidth - (bounds.left + objLeft * zoom),
			width: Math.max((active.width ?? 100) * zoom, 200),
			height: Math.max((active.height ?? 40) * zoom, 32)
		};

		position = newPosition;
		value = activeText;
		activeObject = active;

		const shouldBeVisible = !isInNativeEditMode && activeText.length > 0;
		const shouldShowSuggestions = activeText.endsWith('{{');

		console.log(
			'DateExpressions - Should show suggestions:',
			shouldShowSuggestions,
			'Text ends with {{:',
			activeText.endsWith('{{')
		);

		visible = shouldBeVisible;
		showSuggestions = shouldShowSuggestions;

		setTimeout(() => canvas.requestRenderAll(), 0);
	}

	function handleChange(val: string) {
		value = val;
		showSuggestions = val.endsWith('{{');
		editor?.changeText?.(val);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleSelect(variable: string) {
		if (!activeObject) return;

		// When user types {{ and selects a variable, replace {{ with {{variable}}
		const newText = value.endsWith('{{')
			? value.slice(0, -2) + `{{${variable}}}`
			: value + `{{${variable}}}`;

		value = newText;
		showSuggestions = false;

		// Update the fabric textbox directly since changeText excludes date textboxes
		activeObject.set('text', newText);

		// If the textbox is in editing mode, we need to update the editing text as well
		if (activeObject.isEditing) {
			(activeObject as any).hiddenTextarea.value = newText;
			(activeObject as any).updateFromTextArea();
		}

		editor?.canvas?.requestRenderAll();

		console.log('DateExpressions - Selected variable:', variable, 'New text:', newText);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			visible = false;
			showSuggestions = false;
		}
	}

	onMount(() => {
		let cleanup: (() => void) | null = null;

		const checkCanvas = () => {
			const canvas = editor?.canvas;
			if (!canvas) {
				setTimeout(checkCanvas, 100);
				return;
			}
			cleanup = setupCanvasEvents(canvas);
		};

		checkCanvas();

		return () => {
			if (cleanup) cleanup();
		};
	});

	function setupCanvasEvents(canvas: any) {
		const handleSelectionCreated = () => updatePosition();
		const handleSelectionUpdated = () => updatePosition();
		const handleSelectionCleared = () => {
			visible = false;
			showSuggestions = false;
			position = null;
			activeObject = null;
		};

		const textEditingEnteredHandler = (e: any) => {
			const target = e.target;
			if (target && target.type === 'textbox' && (target as any).customType === 'date') {
				isInNativeEditMode = true;
				activeObject = target;
				value = target.text || '';
				visible = false;

				if (value.endsWith('{{')) {
					showSuggestions = true;
					updatePosition();
				}
			}
		};

		const textEditingExitedHandler = (e: any) => {
			const target = e.target;
			if (target && target.type === 'textbox' && (target as any).customType === 'date') {
				isInNativeEditMode = false;
				const text = target.text || '';
				value = text;
				activeObject = target;

				if (text.endsWith('{{')) {
					showSuggestions = true;
					updatePosition();
				} else {
					showSuggestions = false;
					if (text.length > 0) {
						setTimeout(() => updatePosition(), 10);
					}
				}
			}
		};

		const textChangedHandler = (e: any) => {
			const target = e.target;
			console.log(
				'DateExpressions - Text changed:',
				target?.text,
				'customType:',
				(target as any)?.customType
			);

			if (target && target.type === 'textbox' && (target as any).customType === 'date') {
				const text = target.text || '';
				value = text;
				activeObject = target;

				if (text.endsWith('{{')) {
					console.log('DateExpressions - Showing suggestions for:', text);
					showSuggestions = true;
					updatePosition();
				} else {
					showSuggestions = false;
				}
			}
		};

		const mouseDoubleClickHandler = (e: any) => {
			const target = e.target;
			if (target && target.type === 'textbox' && (target as any).customType === 'date') {
				setTimeout(() => {
					updatePosition();
					if (inputEl) {
						inputEl.focus();
						inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
					}
				}, 10);
			}
		};

		const objectModifiedHandler = (e: any) => {
			const target = e.target;
			if (target && target.type === 'textbox') {
				setTimeout(() => updatePosition(), 10);
			}
		};

		const objectMovingHandler = (e: any) => {
			const target = e.target;
			if (target && target.type === 'textbox' && target === activeObject) {
				updatePosition();
			}
		};

		canvas.on('selection:created', handleSelectionCreated);
		canvas.on('selection:updated', handleSelectionUpdated);
		canvas.on('selection:cleared', handleSelectionCleared);
		canvas.on('text:editing:entered', textEditingEnteredHandler);
		canvas.on('text:editing:exited', textEditingExitedHandler);
		canvas.on('text:changed', textChangedHandler);
		canvas.on('mouse:dblclick', mouseDoubleClickHandler);
		canvas.on('object:modified', objectModifiedHandler);
		canvas.on('object:moving', objectMovingHandler);
		canvas.on('object:scaling', objectMovingHandler);

		return () => {
			canvas.off('selection:created', handleSelectionCreated);
			canvas.off('selection:updated', handleSelectionUpdated);
			canvas.off('selection:cleared', handleSelectionCleared);
			canvas.off('text:editing:entered', textEditingEnteredHandler);
			canvas.off('text:editing:exited', textEditingExitedHandler);
			canvas.off('text:changed', textChangedHandler);
			canvas.off('mouse:dblclick', mouseDoubleClickHandler);
			canvas.off('object:modified', objectModifiedHandler);
			canvas.off('object:moving', objectMovingHandler);
			canvas.off('object:scaling', objectMovingHandler);
		};
	}
</script>

{#if showSuggestions && position}
	<div
		class="scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 pointer-events-auto fixed z-[10000] max-h-[300px] w-80 overflow-x-hidden overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
		style="top: {position.top + 15}px; right:{position.right - 120}px "
	>
		<div class="border-b border-gray-200 last:border-b-0">
			<div
				class="border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold tracking-wider text-gray-700 uppercase"
			>
				Date Variables
			</div>
			{#each Object.entries(dateVariables) as [category, variables]}
				<div class="border-b border-gray-100 last:border-b-0">
					<div
						class="bg-gray-25 border-b border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500"
					>
						{category}
					</div>
					{#each variables as variable}
						<div
							class="flex cursor-pointer flex-col gap-0.5 border-b border-gray-50 px-3 py-2 transition-colors duration-150 last:border-b-0 hover:bg-blue-50"
							onclick={() => handleSelect(variable)}
						>
							<span class="font-mono text-xs font-medium text-blue-600">{`{{${variable}}}`}</span>
							<span class="text-xs text-gray-500 italic"
								>{getDateVariableDescription(variable)}</span
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>

		<div class="border-b border-gray-200 last:border-b-0">
			<div
				class="border-b border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold tracking-wider text-gray-700 uppercase"
			>
				Text Variables
			</div>
			{#each Object.entries(textVariables) as [category, variables]}
				<div class="border-b border-gray-100 last:border-b-0">
					<div
						class="bg-gray-25 border-b border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500"
					>
						{category}
					</div>
					{#each variables as variable}
						<div
							class="cursor-pointer border-b border-gray-50 px-3 py-2 transition-colors duration-150 last:border-b-0 hover:bg-blue-50"
							onclick={() => handleSelect(variable)}
						>
							<span class="font-mono text-xs font-medium text-blue-600">{`{{${variable}}}`}</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
{/if}
