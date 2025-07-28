import { Line, FabricObject, Canvas} from 'fabric';

// Extend fabric objects with guides property
declare module 'fabric' {
	interface FabricObject {
		guides?: { [key: string]: Line };
	}
}

// Smart object snapping configuration
const SNAP_THRESHOLD = 5;
const GUIDE_COLOR = 'rgb(178, 207, 255)';

// Check if two coordinates are within snapping range
function inRange(a: number, b: number, threshold: number = SNAP_THRESHOLD): boolean {
	return Math.abs(a - b) <= threshold;
}

// Snap object to a specific position
function snapObject(obj: FabricObject, side: string, pos: number): void {
	obj.set(side, pos);
	obj.setCoords();
	if (obj.guides) {
		drawObjectGuides(obj);
	}
}

// Draw guide lines for an object
function drawObjectGuides(obj: FabricObject): void {
	if (!obj.canvas) return;

	const w = obj.getScaledWidth();
	const h = obj.getScaledHeight();

	drawGuide('top', obj.top!, obj);
	drawGuide('left', obj.left!, obj);
	drawGuide('centerX', obj.left! + w / 2, obj);
	drawGuide('centerY', obj.top! + h / 2, obj);
	drawGuide('right', obj.left! + w, obj);
	drawGuide('bottom', obj.top! + h, obj);

	obj.setCoords();
}

// Draw a single guide line
function drawGuide(side: string, pos: number, obj: FabricObject): void {
	if (!obj.canvas || !obj.guides) return;

	const canvas = obj.canvas;
	const color = GUIDE_COLOR;
	const lineProps = {
		left: 0,
		top: 0,
		evented: false,
		stroke: color,
		selectable: false,
		opacity: 0,
		strokeWidth: 1
	};

	let ln: Line;

	switch (side) {
		case 'top':
		case 'bottom':
		case 'centerY':
			ln = new Line([0, 0, canvas.width!, 0], {
				...lineProps,
				left: 0,
				top: pos
			});
			break;
		case 'left':
		case 'right':
		case 'centerX':
			ln = new Line([0, 0, 0, canvas.height!], {
				...lineProps,
				left: pos,
				top: 0
			});
			break;
		default:
			return;
	}

	// Remove existing guide if it exists
	if (obj.guides[side] instanceof Line) {
		canvas.remove(obj.guides[side]);
		delete obj.guides[side];
	}

	obj.guides[side] = ln;
	console.log("DEBUG: An object is being added from fabric-smart-objects drawGuide function");
	canvas.add(ln);
	canvas.renderAll();
}

// Handle object snapping during movement
function handleObjectMoving(e: any): void {
	const obj = e.target as FabricObject;
	if (!obj || !obj.canvas || !obj.guides) return;

	const canvas = obj.canvas;
	drawObjectGuides(obj);

	// Get all other objects (excluding lines and the moving object)
	const objects = canvas.getObjects().filter(
		(o: FabricObject) => o.type !== 'line' && o !== obj && (o as any).name !== 'clip' // Exclude workspace
	);

	const matches = new Set<string>();

	for (const targetObj of objects) {
		if (!targetObj.guides) continue;

		// Check all guide alignments
		for (const side in obj.guides) {
			let axis: string;
			let newPos: number;

			switch (side) {
				case 'right':
					axis = 'left';
					newPos = targetObj.guides[side]?.left! - obj.getScaledWidth();
					break;
				case 'bottom':
					axis = 'top';
					newPos = targetObj.guides[side]?.top! - obj.getScaledHeight();
					break;
				case 'centerX':
					axis = 'left';
					newPos = targetObj.guides[side]?.left! - obj.getScaledWidth() / 2;
					break;
				case 'centerY':
					axis = 'top';
					newPos = targetObj.guides[side]?.top! - obj.getScaledHeight() / 2;
					break;
				default:
					axis = side;
					newPos = targetObj.guides[side]?.[axis as keyof Line] as number;
					break;
			}

			// Check if objects should snap to each other
			const objGuidePos = obj.guides[side]?.[axis as keyof Line] as number;
			const targetGuidePos = targetObj.guides[side]?.[axis as keyof Line] as number;

			if (
				objGuidePos !== undefined &&
				targetGuidePos !== undefined &&
				inRange(objGuidePos, targetGuidePos)
			) {
				matches.add(side);
				snapObject(obj, axis, newPos);
			}

			// Check edge-to-edge snapping
			if (side === 'left') {
				const rightPos = targetObj.guides['right']?.[axis as keyof Line] as number;
				if (rightPos !== undefined && inRange(objGuidePos, rightPos)) {
					matches.add(side);
					snapObject(obj, axis, rightPos);
				}
			} else if (side === 'right') {
				const leftPos = targetObj.guides['left']?.[axis as keyof Line] as number;
				if (leftPos !== undefined && inRange(objGuidePos, leftPos)) {
					matches.add(side);
					snapObject(obj, axis, leftPos - obj.getScaledWidth());
				}
			} else if (side === 'top') {
				const bottomPos = targetObj.guides['bottom']?.[axis as keyof Line] as number;
				if (bottomPos !== undefined && inRange(objGuidePos, bottomPos)) {
					matches.add(side);
					snapObject(obj, axis, bottomPos);
				}
			} else if (side === 'bottom') {
				const topPos = targetObj.guides['top']?.[axis as keyof Line] as number;
				if (topPos !== undefined && inRange(objGuidePos, topPos)) {
					matches.add(side);
					snapObject(obj, axis, topPos - obj.getScaledHeight());
				}
			} else if (side === 'centerX') {
				const leftPos = targetObj.guides['left']?.[axis as keyof Line] as number;
				const rightPos = targetObj.guides['right']?.[axis as keyof Line] as number;

				if (leftPos !== undefined && inRange(objGuidePos, leftPos)) {
					matches.add(side);
					snapObject(obj, axis, leftPos - obj.getScaledWidth() / 2);
				} else if (rightPos !== undefined && inRange(objGuidePos, rightPos)) {
					matches.add(side);
					snapObject(obj, axis, rightPos - obj.getScaledWidth() / 2);
				}
			} else if (side === 'centerY') {
				const topPos = targetObj.guides['top']?.[axis as keyof Line] as number;
				const bottomPos = targetObj.guides['bottom']?.[axis as keyof Line] as number;

				if (topPos !== undefined && inRange(objGuidePos, topPos)) {
					matches.add(side);
					snapObject(obj, axis, topPos - obj.getScaledHeight() / 2);
				} else if (bottomPos !== undefined && inRange(objGuidePos, bottomPos)) {
					matches.add(side);
					snapObject(obj, axis, bottomPos - obj.getScaledHeight() / 2);
				}
			}
		}
	}

	// Show active snap guides
	matches.forEach((side) => {
		if (obj.guides?.[side]) {
			obj.guides[side].set('opacity', 1);
		}
	});

	obj.setCoords();
}

// Handle object added to canvas
function handleObjectAdded(e: { target: FabricObject }): void {
	const obj = e.target as FabricObject | undefined;
	if (!obj || obj.type === 'line') return;

	// Initialize guides for the object
	if (!obj.guides) {
		obj.guides = {};
	}

	drawObjectGuides(obj);
}

// Handle object moved (after movement is complete)
function handleObjectMoved(e: { target: FabricObject }): void {
	const obj = e.target as FabricObject | undefined;
	if (!obj || obj.type === 'line') return;

	drawObjectGuides(obj);
}

// Enhanced snapping functionality for Fabric.js objects
export class SmartObjectSnapping {
	private canvas: Canvas;
	public snapThreshold: number = 10;
	private guideColor: string = 'rgb(178, 207, 255)';
	private isEnabled: boolean = true;

	constructor(canvas: Canvas, snapThreshold: number = 10) {
		this.canvas = canvas;
		this.snapThreshold = snapThreshold;
		this.setupEventListeners();
		this.initializeExistingObjects();
	}

	private setupEventListeners(): void {
		this.canvas.on('object:added', this.onObjectAdded.bind(this));
		this.canvas.on('object:moving', this.onObjectMoving.bind(this));
		this.canvas.on('object:modified', this.onObjectMoved.bind(this));
		this.canvas.on('selection:cleared', this.clearAllGuides.bind(this));
	}

	private initializeExistingObjects(): void {
		// Initialize guides for any existing objects on the canvas
		const objects = this.canvas.getObjects();
		objects.forEach((obj) => {
			if (this.isSnappableObject(obj)) {
				this.initializeObjectGuides(obj);
				this.drawObjectGuides(obj);
			}
		});
	}

	private onObjectAdded(e: { target: FabricObject }): void {
		const obj = e.target as FabricObject | undefined;
		if (obj && this.isSnappableObject(obj)) {
			this.initializeObjectGuides(obj);
			this.drawObjectGuides(obj);
		}
	}

	private onObjectMoved(e: { target: FabricObject }): void {
		const obj = e.target as FabricObject | undefined;
		if (obj && this.isSnappableObject(obj)) {
			this.drawObjectGuides(obj);
		}
	}

	private onObjectMoving(e: any): void {
		if (!this.isEnabled) return;

		const obj = e.target as FabricObject | undefined;
		if (!obj || !this.isSnappableObject(obj as FabricObject)) return;

		this.drawObjectGuides(obj);
		this.performSnapping(obj);
	}

	private isSnappableObject(obj: FabricObject): boolean {
		// Exclude lines (guides) and workspace clip objects
		return obj.type !== 'line' && (obj as any).name !== 'clip';
	}

	private initializeObjectGuides(obj: FabricObject): void {
		if (!obj.guides) {
			obj.guides = {};
		}
	}

	private performSnapping(obj: FabricObject): void {
		const objects = this.canvas
			.getObjects()
			.filter((o: FabricObject) => this.isSnappableObject(o) && o !== obj);

		const matches = new Set<string>();

		for (const targetObj of objects) {
			if (!obj.guides || !targetObj.guides) continue;

			for (const side in obj.guides) {
				let axis: 'left' | 'top';
				let newPos: number;

				switch (side) {
					case 'right':
						axis = 'left';
						newPos = targetObj.guides[side].left! - obj.getScaledWidth();
						break;
					case 'bottom':
						axis = 'top';
						newPos = targetObj.guides[side].top! - obj.getScaledHeight();
						break;
					case 'centerX':
						axis = 'left';
						newPos = targetObj.guides[side].left! - obj.getScaledWidth() / 2;
						break;
					case 'centerY':
						axis = 'top';
						newPos = targetObj.guides[side].top! - obj.getScaledHeight() / 2;
						break;
					default:
						axis = side as 'left' | 'top';
						newPos = targetObj.guides[side][axis]!;
						break;
				}

				// Check if objects are in snap range
				if (this.inRange(obj.guides[side][axis]!, targetObj.guides[side][axis]!)) {
					matches.add(side);
					this.snapObject(obj, axis, newPos);
				}

				// Check edge-to-edge snapping
				this.checkEdgeSnapping(obj, targetObj, side, axis, matches);
			}
		}

		// Show active snap guides
		matches.forEach((match) => {
			if (obj.guides?.[match]) {
				obj.guides[match].set('opacity', 1);
			}
		});

		obj.setCoords();
	}

	private checkEdgeSnapping(
		obj: FabricObject,
		targetObj: FabricObject,
		side: string,
		axis: 'left' | 'top',
		matches: Set<string>
	): void {
		if (!obj.guides || !targetObj.guides) return;

		if (side === 'left') {
			if (this.inRange(obj.guides['left'][axis]!, targetObj.guides['right'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['right'][axis]!);
			}
		} else if (side === 'right') {
			if (this.inRange(obj.guides['right'][axis]!, targetObj.guides['left'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['left'][axis]! - obj.getScaledWidth());
			}
		} else if (side === 'top') {
			if (this.inRange(obj.guides['top'][axis]!, targetObj.guides['bottom'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['bottom'][axis]!);
			}
		} else if (side === 'bottom') {
			if (this.inRange(obj.guides['bottom'][axis]!, targetObj.guides['top'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['top'][axis]! - obj.getScaledHeight());
			}
		} else if (side === 'centerX') {
			if (this.inRange(obj.guides['centerX'][axis]!, targetObj.guides['left'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['left'][axis]! - obj.getScaledWidth() / 2);
			} else if (this.inRange(obj.guides['centerX'][axis]!, targetObj.guides['right'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['right'][axis]! - obj.getScaledWidth() / 2);
			}
		} else if (side === 'centerY') {
			if (this.inRange(obj.guides['centerY'][axis]!, targetObj.guides['top'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['top'][axis]! - obj.getScaledHeight() / 2);
			} else if (this.inRange(obj.guides['centerY'][axis]!, targetObj.guides['bottom'][axis]!)) {
				matches.add(side);
				this.snapObject(obj, axis, targetObj.guides['bottom'][axis]! - obj.getScaledHeight() / 2);
			}
		}
	}

	private inRange(a: number, b: number): boolean {
		return Math.abs(a - b) <= this.snapThreshold;
	}

	private snapObject(obj: FabricObject, side: 'left' | 'top', pos: number): void {
		obj.set(side, pos);
		obj.setCoords();
		this.drawObjectGuides(obj);
	}

	private drawObjectGuides(obj: FabricObject): void {
		const w = obj.getScaledWidth();
		const h = obj.getScaledHeight();

		this.drawGuide('top', obj.top!, obj);
		this.drawGuide('left', obj.left!, obj);
		this.drawGuide('centerX', obj.left! + w / 2, obj);
		this.drawGuide('centerY', obj.top! + h / 2, obj);
		this.drawGuide('right', obj.left! + w, obj);
		this.drawGuide('bottom', obj.top! + h, obj);

		obj.setCoords();
	}

	private drawGuide(side: string, pos: number, obj: FabricObject): void {
		if (!obj.guides) {
			obj.guides = {};
		}

		let line: Line;
		const lineProps = {
			left: 0,
			top: 0,
			evented: false,
			stroke: this.guideColor,
			selectable: false,
			opacity: 0,
			strokeWidth: 1
		};

		switch (side) {
			case 'top':
			case 'bottom':
			case 'centerY':
				line = new Line([0, 0, this.canvas.width!, 0], {
					...lineProps,
					left: 0,
					top: pos
				});
				break;
			case 'left':
			case 'right':
			case 'centerX':
				line = new Line([0, 0, 0, this.canvas.height!], {
					...lineProps,
					left: pos,
					top: 0
				});
				break;
			default:
				return;
		}

		// Remove existing guide
		if (obj.guides[side] instanceof Line) {
			this.canvas.remove(obj.guides[side]);
			delete obj.guides[side];
		}

		obj.guides[side] = line;
		console.log("DEBUG: An object is being added from fabric-smart-object.ts private drawGuide function");
		this.canvas.add(line);
		this.canvas.renderAll();
	}

	private clearAllGuides(): void {
		const objects = this.canvas.getObjects();
		objects.forEach((obj) => {
			if (obj.guides) {
				Object.values(obj.guides).forEach((guide) => {
					this.canvas.remove(guide);
				});
				obj.guides = {};
			}
		});
		this.canvas.renderAll();
	}

	// Public methods for controlling snapping
	public enable(): void {
		this.isEnabled = true;
	}

	public disable(): void {
		this.isEnabled = false;
		this.clearAllGuides();
	}

	public isActive(): boolean {
		return this.isEnabled;
	}

	public setSnapThreshold(threshold: number): void {
		this.snapThreshold = threshold;
	}

	public getSnapThreshold(): number {
		return this.snapThreshold;
	}

	public clearGuides(): void {
		this.clearAllGuides();
	}

	public destroy(): void {
		this.canvas.off('object:added', this.onObjectAdded.bind(this));
		this.canvas.off('object:moving', this.onObjectMoving.bind(this));
		this.canvas.off('object:modified', this.onObjectMoved.bind(this));
		this.canvas.off('selection:cleared', this.clearAllGuides.bind(this));
		this.clearAllGuides();
	}
}

// Create enhanced Fabric object with snapping capabilities
export class SnappyRect extends FabricObject {
	static type = 'snappyRect';
	guides: { [key: string]: Line } = {};

	constructor(options: any = {}) {
		// Remove type from options if it exists to avoid the read-only error
		const { type, ...cleanOptions } = options;
		super(cleanOptions);
		this.guides = {};
	}

	get type() {
		return 'snappyRect';
	}

	_render(ctx: CanvasRenderingContext2D) {
		super._render(ctx);
		this._drawObjectGuides();
	}

	_drawObjectGuides() {
		if (!this.canvas) return;

		const w = this.getScaledWidth();
		const h = this.getScaledHeight();

		this._drawGuide('top', this.top!);
		this._drawGuide('left', this.left!);
		this._drawGuide('centerX', this.left! + w / 2);
		this._drawGuide('centerY', this.top! + h / 2);
		this._drawGuide('right', this.left! + w);
		this._drawGuide('bottom', this.top! + h);

		this.setCoords();
	}

	_drawGuide(side: string, pos: number) {
		if (!this.canvas) return;

		const color = GUIDE_COLOR;
		const lineProps = {
			left: 0,
			top: 0,
			evented: false,
			stroke: color,
			selectable: false,
			opacity: 1,
			strokeWidth: 1
		};

		let ln: Line;

		switch (side) {
			case 'top':
			case 'bottom':
			case 'centerY':
				ln = new Line([0, 0, this.canvas.width!, 0], {
					...lineProps,
					left: 0,
					top: pos
				});
				break;
			case 'left':
			case 'right':
			case 'centerX':
				ln = new Line([0, 0, 0, this.canvas.height!], {
					...lineProps,
					left: pos,
					top: 0
				});
				break;
			default:
				return;
		}

		// Remove existing guide if it exists
		if (this.guides[side] instanceof Line) {
			this.canvas.remove(this.guides[side]);
			delete this.guides[side];
		}

		this.guides[side] = ln;
		console.log("DEBUG: An object is being added from fabric-smart-object.ts _drawGuide inside SnappyRect that extends FabricObject");
		this.canvas.add(ln);
	}
}

// Setup smart object snapping for a canvas (function-based approach)
export function setupSmartObjectSnapping(canvas: Canvas): SmartObjectSnapping {
	return new SmartObjectSnapping(canvas);
}

// Remove smart object snapping from a canvas (function-based approach)
export function removeSmartObjectSnapping(canvas: Canvas): void {
	canvas.off('object:added', handleObjectAdded);
	canvas.off('object:moving', handleObjectMoving);
	canvas.off('object:modified', handleObjectMoved);

	// Remove all guide lines
	canvas.getObjects().forEach((obj) => {
		if (obj.guides) {
			Object.values(obj.guides).forEach((guide) => {
				if (guide instanceof Line) {
					canvas.remove(guide);
				}
			});
			obj.guides = {};
		}
	});

	canvas.renderAll();
}

// Export utility functions
export {
	inRange,
	snapObject,
	drawObjectGuides,
	drawGuide,
	handleObjectMoving,
	handleObjectAdded,
	handleObjectMoved
};

// Register SnappyRect with Fabric.js
FabricObject.ownDefaults.type = 'FabricObject';
