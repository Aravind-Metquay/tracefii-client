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
		defaultHeight: 600,
		saveCallback: () => console.log('Saved'),
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

	loadState = (json: string): void => {
		const canvas = this.editor.canvas;
		const autoZoom = this.editor.autoZoom;
		const canvasHistory = this.editor.history.canvasHistory;
		const setHistoryIndex = this.editor.history.setHistoryIndex;

		if (!canvas) return;
		const data = JSON.parse(json);
		canvas.loadFromJSON(data, () => {
			canvasHistory.update((history) => {
				const currentState = JSON.stringify(canvas.toJSON());
				return [currentState];
			});
			setHistoryIndex(0);
			autoZoom();
		});
	};
}
export const appState = new AppState();
