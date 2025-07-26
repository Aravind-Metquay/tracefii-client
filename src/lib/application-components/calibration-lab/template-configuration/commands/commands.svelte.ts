import type { Canvas, FabricObject } from 'fabric';

export class Command {
	execute() {
		throw new Error('Must implement execute method');
	}

	undo() {
		throw new Error('Must implement undo method');
	}
}

export class AddElementCommand extends Command {
	canvas: Canvas;
	element: FabricObject;

	constructor(canvas: Canvas, element: FabricObject) {
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
	object: FabricObject;
	newProperties: any;
	oldProperties: any;

	constructor(object: FabricObject, newProperties: any) {
		super();
		this.object = object;
		this.newProperties = newProperties;
		this.oldProperties = {};

		// Store original properties
		Object.keys(newProperties).forEach((key) => {
			this.oldProperties[key] = (object as any)[key];
		});
	}

	execute() {
		this.object.set(this.newProperties);
		(this.object as any).canvas?.renderAll();
	}

	undo() {
		this.object.set(this.oldProperties);
		(this.object as any).canvas?.renderAll();
	}
}

export class MacroCommand extends Command {
	commands: Command[];

	constructor(commands: Command[] = []) {
		super();
		this.commands = commands;
	}

	execute() {
		this.commands.forEach((cmd: Command) => cmd.execute());
	}

	undo() {
		for (let i = this.commands.length - 1; i >= 0; i--) {
			this.commands[i].undo();
		}
	}

	addCommand(command: Command) {
		this.commands.push(command);
	}
}
