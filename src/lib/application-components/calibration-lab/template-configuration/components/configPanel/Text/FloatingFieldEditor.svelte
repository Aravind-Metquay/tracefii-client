<script lang="ts">
	import { onMount } from 'svelte';
	import { allDynamicVariables } from '../../../lib/dynamicVariables';
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

		if (!active || active.type !== 'textbox' || (active as any).customType === 'date') {
			visible = false;
			showSuggestions = false;
			position = null;
			activeObject = null;
			return;
		}

		const activeText = active.text || '';
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

		const newText = value.endsWith('{{')
			? value.slice(0, -2) + `{{${variable}}}`
			: value + `{{${variable}}}`;

		value = newText;
		showSuggestions = false;
		editor?.changeText?.(newText);

		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
		setTimeout(() => {
			inputEl?.focus();
			const len = newText.length;
			inputEl?.setSelectionRange(len, len);
		}, 0);
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
			if (target && target.type === 'textbox' && (target as any).customType !== 'date') {
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
			if (target && target.type === 'textbox' && (target as any).customType !== 'date') {
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
			if (target && target.type === 'textbox' && (target as any).customType !== 'date') {
				const text = target.text || '';
				value = text;
				activeObject = target;

				if (text.endsWith('{{')) {
					showSuggestions = true;
					updatePosition();
				} else {
					showSuggestions = false;
				}
			}
		};

		const mouseDoubleClickHandler = (e: any) => {
			const target = e.target;
			if (target && target.type === 'textbox' && (target as any).customType !== 'date') {
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
		class="suggestions-dropdown"
		style="top: {position.top + 15}px; right:{position.right - 120}px "
	>
		{#each allDynamicVariables as variable}
			<div class="suggestion-item" onclick={() => handleSelect(variable)}>
				<span class="variable-text">{`{{${variable}}}`}</span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.suggestions-dropdown {
		position: fixed;
		z-index: 10000;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		max-height: 200px;
		overflow-y: auto;
		overflow-x: hidden;
		pointer-events: auto;
		width: 250px;
	}

	.suggestion-item {
		padding: 8px 12px;
		cursor: pointer;
		border-bottom: 1px solid #f3f4f6;
		transition: background-color 0.15s ease;
	}

	.suggestion-item:last-child {
		border-bottom: none;
	}

	.suggestion-item:hover {
		background-color: #eff6ff;
	}

	.variable-text {
		font-family: 'Courier New', Consolas, monospace;
		font-size: 12px;
		color: #2563eb;
		font-weight: 500;
	}

	/* Ensure proper scrollbar styling */
	.suggestions-dropdown::-webkit-scrollbar {
		width: 6px;
	}

	.suggestions-dropdown::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 3px;
	}

	.suggestions-dropdown::-webkit-scrollbar-thumb {
		background: #cbd5e1;
		border-radius: 3px;
	}

	.suggestions-dropdown::-webkit-scrollbar-thumb:hover {
		background: #94a3b8;
	}
</style>
