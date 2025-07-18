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
    isDragging && dragStart ? Math.sqrt(
      Math.pow(mousePos.x - dragStart.x, 2) + 
      Math.pow(mousePos.y - dragStart.y, 2)
    ) : 0
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
    
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }
  
  return {
    get mousePos() { return mousePos; },
    get isPressed() { return isPressed; },
    get isDragging() { return isDragging; },
    get dragDistance() { return dragDistance; },
    attachEvents
  };
}