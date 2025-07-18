export class Command {
	execute() {
		throw new Error('Must implement execute method');
	}

	undo() {
		throw new Error('Must implement undo method');
	}
}

export class AddElementCommand extends Command {
	constructor(canvas, element) {
		super();
		this.canvas = canvas;
		this.element = element;
		if (!this.canvas) return;
	}

	execute() {
		if (!this.canvas) return;
		this.canvas.add(this.element);
		this.canvas.renderAll();
	}

	undo() {
		if (!this.canvas) return;
		this.canvas.remove(this.element);
		this.canvas.renderAll();
	}
}

export class TransformCommand extends Command {
	constructor(object, newProperties) {
		super();
		this.object = object;
		this.newProperties = newProperties;
		this.oldProperties = {};

		// Store original properties
		Object.keys(newProperties).forEach((key) => {
			this.oldProperties[key] = object[key];
		});
	}

	execute() {
		this.object.set(this.newProperties);
		this.object.canvas?.renderAll();
	}

	undo() {
		this.object.set(this.oldProperties);
		this.object.canvas?.renderAll();
	}
}

export class MacroCommand extends Command {
	constructor(commands = []) {
		super();
		this.commands = commands;
	}

	execute() {
		this.commands.forEach((cmd) => cmd.execute());
	}

	undo() {
		for (let i = this.commands.length - 1; i >= 0; i--) {
			this.commands[i].undo();
		}
	}

	addCommand(command) {
		this.commands.push(command);
	}
}
