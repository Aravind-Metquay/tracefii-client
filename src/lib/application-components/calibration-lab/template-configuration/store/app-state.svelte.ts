import type { Color, ComponentType, Dimensions, TemplateType, UnitType } from '../lib/types.js';
import { createEditor } from './editor.svelte.js';

export class AppState {
	// UI State
	uiState = $state({
		selectedType: '' as TemplateType,
		selectedComponentType: null as ComponentType,
		unit: 'cm' as UnitType,
		dimensions: { width: '', height: '' } as Dimensions,
		backgroundColor: { r: 255, g: 255, b: 255 } as Color
	});

	// Editor instance
	editor = createEditor();

	// Derived state
	canAddComponents = $derived(['Label', 'Certificate'].includes(this.uiState.selectedType));

	availableComponents = $derived(
		this.canAddComponents ? ['Text', 'Date', 'Image', 'Barcode', 'QR Code'] : []
	);

	// Actions
	setSelectedType = (type: TemplateType): void => {
		this.uiState.selectedType = type;
	};

	setSelectedComponentType = (type: ComponentType): void => {
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
}

export const appState = new AppState();
