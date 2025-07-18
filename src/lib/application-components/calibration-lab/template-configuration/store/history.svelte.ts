interface Command {
	execute(): void;
	undo(): void;
}

export function createHistory(maxSize: number = 50) {
	let commands = $state<Command[]>([]);
	let currentIndex = $state(-1);

	let canUndo = $derived(currentIndex >= 0);
	let canRedo = $derived(currentIndex < commands.length - 1);
	let currentState = $derived(commands[currentIndex]);

	function execute(command: Command) {
		// Remove future commands when executing new one
		commands.splice(currentIndex + 1);

		// Execute command
		command.execute();
		commands.push(command);
		currentIndex++;

		// Limit history size
		if (commands.length > maxSize) {
			commands.shift();
			currentIndex--;
		}
	}

	function undo() {
		if (canUndo) {
			commands[currentIndex].undo();
			currentIndex--;
		}
	}

	function redo() {
		if (canRedo) {
			currentIndex++;
			commands[currentIndex].execute();
		}
	}

	function clear() {
		commands = [];
		currentIndex = -1;
	}

	function save() {
		// This is a placeholder for saving the current state
		// It can be used to mark a checkpoint in the history
	}

	return {
		get canUndo() {
			return canUndo;
		},
		get canRedo() {
			return canRedo;
		},
		get currentState() {
			return currentState;
		},
		execute,
		undo,
		redo,
		clear,
		save
	};
}
