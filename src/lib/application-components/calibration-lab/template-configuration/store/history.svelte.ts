import { writable, get } from 'svelte/store';
import type { Canvas } from 'fabric';

interface HistoryOptions {
	canvas: Canvas | null;
	saveCallback?: () => void;
}

export function createHistory({ canvas, saveCallback }: HistoryOptions) {
	const canvasHistory = writable<string[]>([]);
	const historyIndex = writable<number>(0);

	function save() {
		if (!canvas) return;
		const state = JSON.stringify(canvas.toJSON());
		canvasHistory.update((history) => {
			const newHistory = history.slice(0, get(historyIndex) + 1);
			newHistory.push(state);
			return newHistory;
		});
		historyIndex.update((index) => index + 1);
		saveCallback?.();
	}

	function execute(command: { execute: () => void; undo: () => void }) {
		command.execute();
		save();
	}

	function undo() {
		if (!canvas || !canUndo()) return;
		historyIndex.update((index) => index - 1);
		const history = get(canvasHistory);
		const state = history[get(historyIndex)];
		if (state) {
			canvas.loadFromJSON(JSON.parse(state), () => {
				canvas.renderAll();
			});
		}
	}

	function redo() {
		if (!canvas || !canRedo()) return;
		historyIndex.update((index) => index + 1);
		const history = get(canvasHistory);
		const state = history[get(historyIndex)];
		if (state) {
			canvas.loadFromJSON(JSON.parse(state), () => {
				canvas.renderAll();
			});
		}
	}

	function canUndo() {
		return get(historyIndex) > 0;
	}

	function canRedo() {
		return get(canvasHistory).length - 1 > get(historyIndex);
	}

	function setHistoryIndex(index: number) {
		historyIndex.set(index);
	}

	return {
		canvasHistory,
		historyIndex,
		save,
		execute,
		undo,
		redo,
		canUndo,
		canRedo,
		setHistoryIndex
	};
}
