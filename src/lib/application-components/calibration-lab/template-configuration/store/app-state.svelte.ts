import { createEditor } from './editor.svelte.js';

export class AppState {
  // UI State
  uiState = $state({
    selectedType: '',
    selectedComponentType: null,
    unit: 'cm',
    dimensions: { width: '', height: '' },
    backgroundColor: { r: 255, g: 255, b: 255 }
  });
  
  // Editor instance
  editor = createEditor();
  
  // Derived state
  canAddComponents = $derived(
    ['Label', 'Certificate'].includes(this.uiState.selectedType)
  );
  
  availableComponents = $derived(
    this.canAddComponents 
      ? ['Text', 'Date', 'Image', 'Barcode', 'QR Code']
      : []
  );
  
  // Actions
  setSelectedType = (type) => {
    this.uiState.selectedType = type;
  };
  
  setSelectedComponentType = (type) => {
    this.uiState.selectedComponentType = type;
  };
  
  setUnit = (unit) => {
    this.uiState.unit = unit;
  };
  
  setDimensions = (dimensions) => {
    this.uiState.dimensions = dimensions;
  };
  
  setBackgroundColor = (color) => {
    this.uiState.backgroundColor = color;
  };
}

export const appState = new AppState();