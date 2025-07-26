import * as  fabric  from 'fabric';
import { createHistory } from './history.svelte.js';
import { createCanvasEvents } from './canvas-events.svelte.js';
import { AddElementCommand, TransformCommand } from '../commands/commands.svelte.js';
import * as fabricHelpers from '../utils.ts';

export function createEditor() {
  let canvas = $state(null);
  let selectedTool = $state('select');
  let selectedObject = $state(null);
  let objects = $state([]);
  let zoom = $state(1);
  let viewport = $state({ x: 0, y: 0 });
  
  const history = createHistory();
  const canvasEvents = createCanvasEvents();
  
  // Derived state
  let hasSelection = $derived(selectedObject !== null);
  let canvasSize = $derived(canvas ? { 
    width: canvas.width, 
    height: canvas.height 
  } : { width: 800, height: 600 });
  
  function initializeCanvas(canvasElement) {
    canvas = new fabric.Canvas(canvasElement, {
      width: 800,
      height: 600,
      renderOnAddRemove: false,
      preserveObjectStacking: true
    });
    
    // Set up canvas events
    canvas.on('selection:created', (e) => {
      selectedObject = e.selected[0];
    });
    
    canvas.on('selection:cleared', () => {
      selectedObject = null;
    });
    
    canvas.on('selection:updated', (e) => {
      selectedObject = e.selected[0];
    });
    
    canvas.on('object:modified', syncCanvasState);
    canvas.on('object:added', syncCanvasState);
    canvas.on('object:removed', syncCanvasState);
    
    // Create workspace
    const workspace = new fabric.Rect({
      width: 800,
      height: 600,
      fill: 'white',
      selectable: false,
      evented: false,
      name: 'workspace'
    });
    
    canvas.add(workspace);
    canvas.centerObject(workspace);
    canvas.renderAll();
    
    // Attach mouse events
    canvasEvents.attachEvents(canvasElement);
    
    return canvas;
  }
  
  function syncCanvasState() {
    if (canvas) {
      objects = [...canvas.getObjects().filter(obj => obj.name !== 'workspace')];
    }
  }
  
  function addText(text = 'Text') {
    if (!canvas) return;
    
    const textObj = fabricHelpers.createFabricText(text);
    const command = new AddElementCommand(canvas, textObj);
    history.execute(command);
    syncCanvasState();
  }
  
  function addDate() {
    if (!canvas) return;
    
    const dateObj = fabricHelpers.createFabricDate();
    const command = new AddElementCommand(canvas, dateObj);
    history.execute(command);
    syncCanvasState();
  }
  
  async function addImage(source) {
    if (!canvas) return;
    
    try {
      const imgObj = await fabricHelpers.createFabricImage(source);
      const command = new AddElementCommand(canvas, imgObj);
      history.execute(command);
      syncCanvasState();
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }
  
  async function addQRCode(value) {
    if (!canvas) return;
    
    try {
      const qrObj = await fabricHelpers.createFabricQRCode(value);
      const command = new AddElementCommand(canvas, qrObj);
      history.execute(command);
      syncCanvasState();
    } catch (error) {
      console.error('Error adding QR code:', error);
    }
  }
  
  async function addBarcode(value) {
    if (!canvas) return;
    
    try {
      const barcodeObj = await fabricHelpers.createFabricBarcode(value);
      const command = new AddElementCommand(canvas, barcodeObj);
      history.execute(command);
      syncCanvasState();
    } catch (error) {
      console.error('Error adding barcode:', error);
    }
  }
  
  function updateSelectedObject(properties) {
    if (!selectedObject) return;
    
    const command = new TransformCommand(selectedObject, properties);
    history.execute(command);
    syncCanvasState();
  }
  
  function deleteSelected() {
    if (!selectedObject || !canvas) return;
    
    canvas.remove(selectedObject);
    selectedObject = null;
    canvas.renderAll();
    syncCanvasState();
  }
  
  function setZoom(newZoom) {
    if (!canvas) return;
    
    zoom = Math.max(0.1, Math.min(5, newZoom));
    const center = canvas.getCenter();
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
  }
  
  function exportToPNG() {
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1
    });
    
    const link = document.createElement('a');
    link.download = 'template.png';
    link.href = dataURL;
    link.click();
  }
  
  function exportToJSON() {
    if (!canvas) return;
    
    const json = JSON.stringify(canvas.toJSON(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'template.json';
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  }
  
  function loadFromJSON(jsonString) {
    if (!canvas) return;
    
    try {
      const data = JSON.parse(jsonString);
      canvas.loadFromJSON(data, () => {
        canvas.renderAll();
        syncCanvasState();
      });
    } catch (error) {
      console.error('Error loading JSON:', error);
    }
  }
  
  return {
    // State getters
    get canvas() { return canvas; },
    get selectedTool() { return selectedTool; },
    get selectedObject() { return selectedObject; },
    get objects() { return objects; },
    get hasSelection() { return hasSelection; },
    get zoom() { return zoom; },
    get canUndo() { return history.canUndo; },
    get canRedo() { return history.canRedo; },
    get canvasEvents() { return canvasEvents; },
    get canvasSize() { return canvasSize; },
    
    // Actions
    initializeCanvas,
    selectTool: (tool) => { selectedTool = tool; },
    addText,
    addDate,
    addImage,
    addQRCode,
    addBarcode,
    updateSelectedObject,
    deleteSelected,
    setZoom,
    undo: history.undo,
    redo: history.redo,
    exportToPNG,
    exportToJSON,
    loadFromJSON,
    syncCanvasState
  };
}