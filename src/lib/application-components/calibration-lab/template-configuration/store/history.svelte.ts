// import { writable, get } from 'svelte/store';
// import type { Canvas } from 'fabric';

// interface HistoryOptions {
// 	canvas: Canvas | null;
// 	saveCallback?: () => void;
// }

// export function createHistory({ canvas, saveCallback }: HistoryOptions) {
// 	const historyStack = writable<string[]>([]);
// 	const historyIndex = writable<number>(-1);
// 	 let isUpdating = false;

// 	function save() {
//         if (!canvas || isUpdating) return;

//         const state = JSON.stringify(canvas.toJSON());
//         const stack = get(historyStack);
//         const currentIndex = get(historyIndex);
        
//         if (stack[currentIndex] === state) return;

//         const newStack = stack.slice(0, currentIndex + 1);
//         newStack.push(state);

//         historyStack.set(newStack);
//         historyIndex.set(newStack.length - 1);
//     }

// 	 function init() {
//         save();
//     }

// 	function execute(command: { execute: () => void; undo: () => void }) {
// 		command.execute();
// 		save();
// 	}

// 	function _loadState(targetIndex: number) {
//         if (!canvas) return;

//         const stack = get(historyStack);
//         const stateToLoad = stack[targetIndex];

//         if (stateToLoad) {
//             isUpdating = true;
//             canvas.loadFromJSON(JSON.parse(stateToLoad), () => {
//                 canvas.renderAll();
//                 historyIndex.set(targetIndex);
//                 isUpdating = false;
//             });
//         }
//     }

// 	function undo() {
//         const currentIndex = get(historyIndex);
//         if (currentIndex > 0) {
//             _loadState(currentIndex - 1);
//         }
//     }

// 	  function redo() {
//         const stack = get(historyStack);
//         const currentIndex = get(historyIndex);
//         if (currentIndex < stack.length - 1) {
//             _loadState(currentIndex + 1);
//         }
//     }
// 	// function canUndo() {
// 	// 	return get(historyIndex) > 0;
// 	// }

// 	// function canRedo() {
// 	// 	 const history = get(canvasHistory);
// 	// 	return get(canvasHistory).length - 1 > get(historyIndex);
// 	// }

// 	// function setHistoryIndex(index: number) {
// 	// 	historyIndex.set(index);
// 	// }

// 	return {
// 		// canvasHistory,
// 		// historyIndex,
// 		init,
// 		save,
// 		execute,
// 		undo,
// 		redo,
// 		   get canUndo() { return get(historyIndex) > 0; },
//         get canRedo() { return get(historyIndex) < get(historyStack).length - 1; }
// 		// setHistoryIndex
// 	};
// }





import { writable, get } from 'svelte/store';
import type { Canvas } from 'fabric';

interface Command {
    execute: () => void;
    undo: () => void;
}

// The options now expect a function that returns the canvas
interface HistoryOptions {
    getCanvas: () => Canvas | null;
    saveCallback?: () => void;
}

export function createHistory({ getCanvas, saveCallback }: HistoryOptions) {
    const historyStack = writable<string[]>([]);
    const historyIndex = writable<number>(-1);
    let isUpdating = false;

    function save() {
		//debugger;
        const canvas = getCanvas(); // Get the current canvas
        if (!canvas || isUpdating) return;

        const state = JSON.stringify(canvas.toJSON());
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
        save();
    }

    function execute(command: Command) {
        command.execute();
        save();
    }

    function _loadState(targetIndex: number) {
        const canvas = getCanvas(); // Get the current canvas
        if (!canvas) return;

        const stack = get(historyStack);
        const stateToLoad = stack[targetIndex];

        if (stateToLoad) {
            isUpdating = true;
            canvas.loadFromJSON(JSON.parse(stateToLoad), () => {
                canvas.renderAll();
                historyIndex.set(targetIndex);
                isUpdating = false;
            });
        }
    }

    function undo() {
		//debugger;
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
        get canUndo() { return get(historyIndex) > 0; },
        get canRedo() { return get(historyIndex) < get(historyStack).length - 1; }
    };
}


// import { writable, get } from 'svelte/store';
// import type { Canvas } from 'fabric';

// interface Command {
//     execute: () => void;
//     undo: () => void;
// }

// interface HistoryOptions {
//     getCanvas: () => Canvas | null;
//     saveCallback?: () => void;
// }

// export function createHistory({ getCanvas, saveCallback }: HistoryOptions) {
//     const historyStack = writable<string[]>([]);
//     const historyIndex = writable<number>(-1);
//     let isUpdating = false;

//     function save() {
//         const canvas = getCanvas();
//         if (!canvas || isUpdating) return;

//         const state = JSON.stringify(canvas.toJSON());
//         const stack = get(historyStack);
//         const currentIndex = get(historyIndex);
        
//         if (stack[currentIndex] === state) return;

//         const newStack = stack.slice(0, currentIndex + 1);
//         newStack.push(state);

//         historyStack.set(newStack);
//         historyIndex.set(newStack.length - 1);
//         saveCallback?.();
//     }

//     function init() {
//         save();
//     }

//     function execute(command: Command) {
//         command.execute();
//         save();
//     }

//     function _loadState(targetIndex: number) {
//         const canvas = getCanvas();
//         if (!canvas) return;

//         const stack = get(historyStack);
//         const stateToLoad = stack[targetIndex];

//         if (stateToLoad) {
//             isUpdating = true;
            
//             canvas.loadFromJSON(JSON.parse(stateToLoad), () => {
//                 try {
//                     // Find and restore the workspace
//                     const workspace = canvas.getObjects().find((object: any) => object.name === 'clip');
//                     if (workspace) {
//                         // Restore workspace properties
//                         workspace.set({
//                             selectable: false,
//                             hasControls: false,
//                             hoverCursor: 'default',
//                             moveCursor: 'default'
//                         });
                        
//                         // Set as clip path
//                         canvas.clipPath = workspace;
                        
//                         // Send to back
//                         canvas.sendObjectToBack(workspace);
//                     }
                    
//                     // Restore canvas background
//                     canvas.setBackgroundColor('#f8fafc', () => {});
                    
//                     // Clear selection
//                     canvas.discardActiveObject();
                    
//                     // Render
//                     canvas.renderAll();
                    
//                     // Update index
//                     historyIndex.set(targetIndex);
                    
//                 } finally {
//                     isUpdating = false;
//                 }
//             });
//         }
//     }

//     function undo() {
//         const currentIndex = get(historyIndex);
//         if (currentIndex > 0) {
//             _loadState(currentIndex - 1);
//         }
//     }

//     function redo() {
//         const stack = get(historyStack);
//         const currentIndex = get(historyIndex);
//         if (currentIndex < stack.length - 1) {
//             _loadState(currentIndex + 1);
//         }
//     }

//     return {
//         init,
//         save,
//         execute,
//         undo,
//         redo,
//         get canUndo() { return get(historyIndex) > 0; },
//         get canRedo() { return get(historyStack).length - 1 > get(historyIndex); }
//     };
// }