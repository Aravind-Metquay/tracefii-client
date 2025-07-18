interface MousePosition {
	x: number;
	y: number;
}

export function createCanvasEvents() {
	let mousePos = $state<MousePosition>({ x: 0, y: 0 });
	let isPressed = $state(false);
	let dragStart = $state<MousePosition | null>(null);
	let canvas = $state<HTMLCanvasElement | null>(null);

	let isDragging = $derived(isPressed && dragStart !== null);
	let dragDistance = $derived(
		isDragging && dragStart
			? Math.sqrt(Math.pow(mousePos.x - dragStart.x, 2) + Math.pow(mousePos.y - dragStart.y, 2))
			: 0
	);

	function attachEvents(canvasElement: HTMLCanvasElement) {
		canvas = canvasElement;

		const handleMouseMove = (e: MouseEvent) => {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			mousePos = {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			};
		};

		const handleMouseDown = (_e: MouseEvent) => {
			isPressed = true;
			dragStart = { ...mousePos };
		};

		const handleMouseUp = () => {
			isPressed = false;
			dragStart = null;
		};

		// Add event listeners globally to handle mouse events outside canvas
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);

		if (canvas) {
			canvas.addEventListener('mousedown', handleMouseDown);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			if (canvas) {
				canvas.removeEventListener('mousedown', handleMouseDown);
			}
		};
	}

	return {
		get mousePos() {
			return mousePos;
		},
		get isPressed() {
			return isPressed;
		},
		get isDragging() {
			return isDragging;
		},
		get dragDistance() {
			return dragDistance;
		},
		attachEvents
	};
}
