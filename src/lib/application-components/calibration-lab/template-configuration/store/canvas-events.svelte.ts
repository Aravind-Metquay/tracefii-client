export function createCanvasEvents() {
  let mousePos = $state({ x: 0, y: 0 });
  let isPressed = $state(false);
  let dragStart = $state(null);
  let canvas = $state(null);
  
  let isDragging = $derived(isPressed && dragStart !== null);
  let dragDistance = $derived(
    isDragging ? Math.sqrt(
      Math.pow(mousePos.x - dragStart.x, 2) + 
      Math.pow(mousePos.y - dragStart.y, 2)
    ) : 0
  );
  
  function attachEvents(canvasElement) {
    canvas = canvasElement;
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    
    const handleMouseDown = (e) => {
      isPressed = true;
      dragStart = { ...mousePos };
    };
    
    const handleMouseUp = () => {
      isPressed = false;
      dragStart = null;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove);
      canvas?.removeEventListener('mousedown', handleMouseDown);
      canvas?.removeEventListener('mouseup', handleMouseUp);
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