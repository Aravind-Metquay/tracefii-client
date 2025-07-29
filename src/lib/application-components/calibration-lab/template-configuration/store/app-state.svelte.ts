import type { Color, ComponentType, Dimensions, TemplateType, UnitType } from '../lib/types.js';
import { createEditor } from './editor.svelte.js';

export class AppState {
	// UI State
	uiState = $state({
		selectedType: '' as TemplateType,
		selectedComponentType: null as ComponentType | null,
		unit: 'cm' as UnitType,
		dimensions: { width: '', height: '' } as Dimensions,
		backgroundColor: { r: 255, g: 255, b: 255 } as Color,
		defaultState: '{}' as string
	});

	// Editor instance
	editor = createEditor({
		defaultState: this.uiState.defaultState,
		defaultWidth: 800,
		defaultHeight: 400,
		saveCallback: () =>{ 
			console.log('Saved');
		
		},
		clearSelectionCallback: () => console.log('Selection cleared')
	});

	// Derived state
	canAddComponents = $derived(true);

	availableComponents = $derived(
		this.canAddComponents
			? (['Text', 'Date', 'Image', 'Barcode', 'QR Code'] as ComponentType[])
			: []
	);

	// Actions
	setSelectedType = (type: TemplateType): void => {
		this.uiState.selectedType = type;
	};

	setSelectedComponentType = (type: ComponentType | null): void => {
		this.uiState.selectedComponentType = type;
	};

	setUnit = (unit: UnitType): void => {
		this.uiState.unit = unit;
	};

	setDimensions = (dimensions: Dimensions): void => {
		this.uiState.dimensions = dimensions;
	};

	setBackgroundColor = (color: Color): void => {
		this.uiState.backgroundColor = color;
	};

	setDefaultState = (state: string): void => {
		this.uiState.defaultState = state;
	};
	saveStateToLocalStorage = (): void => {
    if (!this.editor.canvas) return;
    const json = JSON.stringify(this.editor.canvas.toJSON());
    localStorage.setItem('canvasState', json);
    console.log('State saved to Local Storage.');
};

	loadState = (json: string): void => {
    const canvas = this.editor.canvas;
    const autoZoom = this.editor.autoZoom;
    const history = this.editor.history; // Get the history object

    if (!canvas) return;

    const data = JSON.parse(json);
    canvas.loadFromJSON(data, () => {
        // 1. Reset the history stack
        history.init();
        // 2. Save the loaded state as the new initial state
        history.save(); 
        // 3. Perform auto-zoom
        autoZoom();
        console.log('State loaded and history has been reset.');
    });
};
}
export const appState = new AppState();
