import { onMount, onDestroy } from 'svelte';
import type { Canvas } from 'fabric';

interface HotkeysOptions {
	undo: () => void;
	redo: () => void;
	copy: () => void;
	paste: () => void;
	save: () => void;
	canvas: Canvas | null;
}

export function createHotkeys({ undo, redo, copy, paste, save, canvas }: HotkeysOptions) {
	function attachEvents() {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isCtrlKey = e.ctrlKey || e.metaKey;
			const isInput = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);

			if (isInput) return;

			if (isCtrlKey && e.key === 'z') {
				e.preventDefault();
				undo();
			} else if (isCtrlKey && e.key === 'y') {
				e.preventDefault();
				redo();
			} else if (isCtrlKey && e.key === 'c') {
				e.preventDefault();
				copy();
			} else if (isCtrlKey && e.key === 'v') {
				e.preventDefault();
				paste();
			} else if (isCtrlKey && e.key === 's') {
				e.preventDefault();
				save();
			}
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
		}

		onDestroy(() => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('keydown', handleKeyDown);
			}
		});
	}

	return { attachEvents };
}
