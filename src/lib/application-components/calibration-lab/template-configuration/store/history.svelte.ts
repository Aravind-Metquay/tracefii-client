

import { writable, get } from 'svelte/store';
import type { Canvas } from 'fabric';

interface Command {
	execute: () => void;
	undo: () => void;
}

interface HistoryOptions {
	getCanvas: () => Canvas | null;
	saveCallback?: () => void;
	onStateLoaded?: () => void;
}

export function createHistory({ getCanvas, saveCallback, onStateLoaded }: HistoryOptions) {
	const historyStack = writable<string[]>([]);
	const historyIndex = writable<number>(-1);
	let isUpdating = false;

	function save(propertiesToInclude: string[] = []) {
		const canvas = getCanvas();
		if (!canvas || isUpdating) return;

		const state = JSON.stringify(canvas.toJSON(propertiesToInclude));
		
        
        const stack = get(historyStack);
		const currentIndex = get(historyIndex);

		if (stack[currentIndex] === state) return;

		const newStack = stack.slice(0, currentIndex + 1);
		newStack.push(state);

		historyStack.set(newStack);
		historyIndex.set(newStack.length - 1);
		saveCallback?.();
	}

	function init() {
		save(['name']);
	}

	function execute(command: Command) {
		command.execute();
		save(['name']);
	}

	function _loadState(targetIndex: number) {
		const canvas = getCanvas();
		if (!canvas) return;

		const stack = get(historyStack);
		const stateToLoad = stack[targetIndex];

		if (stateToLoad) {
			isUpdating = true;
			canvas.loadFromJSON(JSON.parse(stateToLoad), () => {
				canvas.renderAll();
				historyIndex.set(targetIndex);
				isUpdating = false;
				onStateLoaded?.();
			});
		}
	}

	function undo() {
		const currentIndex = get(historyIndex);
		if (currentIndex > 0) {
			_loadState(currentIndex - 1);
		}
	}

	function redo() {
		const stack = get(historyStack);
		const currentIndex = get(historyIndex);
		if (currentIndex < stack.length - 1) {
			_loadState(currentIndex + 1);
		}
	}

	return {
		init,
		save,
		execute,
		undo,
		redo,
		get canUndo() {
			return get(historyIndex) > 0;
		},
		get canRedo() {
			return get(historyIndex) < get(historyStack).length - 1;
		}
	};
}