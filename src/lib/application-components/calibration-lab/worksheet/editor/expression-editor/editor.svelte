<script lang="ts">
	import { EditorView, Decoration, WidgetType, ViewPlugin, type ViewUpdate } from '@codemirror/view';
	import { EditorState, RangeSet, RangeSetBuilder } from '@codemirror/state';
	import { autocompletion, snippet, type CompletionContext } from '@codemirror/autocomplete';

	let editorContainer = $state<HTMLDivElement | null>();

	interface SchemaNode {
		type: 'object' | 'array' | 'variable' | 'function';
		children?: { [key: string]: SchemaNode };
		dataType?: 'T' | 'N' | 'D'; 
	}

	const schema: SchemaNode = {
		type: 'object',
		children: {
			User: {
				type: 'object',
				children: {
					Name: { type: 'variable', dataType: 'T' },
					Email: { type: 'variable', dataType: 'T' },
					Address: {
						type: 'object',
						children: {
							Street: { type: 'variable', dataType: 'T' },
							City: { type: 'variable', dataType: 'T' }
						}
					}
				}
			},
			Date: { type: 'variable', dataType: 'D' },
			Page: {
				type: 'object',
				children: {
					Title: { type: 'variable', dataType: 'T' },
					Author: { type: 'variable', dataType: 'T' }
				}
			}
		}
	};
	

	function getNodeForPath(path: string, schemaNode: SchemaNode): SchemaNode | null {
		const parts = path.split('.');
		let currentNode = schemaNode;
		for (const part of parts) {
			if (!currentNode.children || !currentNode.children[part]) {
				return null;
			}
			currentNode = currentNode.children[part];
		}
		return currentNode;
	}

	const levelColors = [
		'#166534', // Level 1: dark green
		'#1d4ed8', // Level 2: dark blue
		'#7c3aed', // Level 3: dark purple
		'#be185d', // Level 4: dark pink
		'#b91c1c'  // Level 5: dark red
	];

	class VariableChipWidget extends WidgetType {
		readonly name: string;
		readonly dataType: string | undefined;

		constructor(name: string, dataType?: string) {
			super();
			this.name = name;
			this.dataType = dataType;
		}

		eq(other: VariableChipWidget) {
			return other.name === this.name && other.dataType === this.dataType;
		}

		toDOM() {
			const span = document.createElement('span');
			span.className = 'cm-variable-chip';

			const parts = this.name.split('.');
			const displayName = parts[parts.length - 1]; 
			const depth = parts.length;

			const color = levelColors[(depth - 1) % levelColors.length];
			span.style.backgroundColor = color;

			const textSpan = document.createElement('span');
			textSpan.textContent = displayName;
			span.appendChild(textSpan);

			if (this.dataType) {
				const icon = document.createElement('span');
				icon.className = 'cm-variable-chip-icon';
				icon.textContent = this.dataType;
				span.appendChild(icon);
			}

			return span;
		}
	}

	const formulaCompletions = [
		{ label: 'If', type: 'function', apply: snippet('If(${condition}, ${ifTrue}, ${ifFalse})') },
		{ label: 'IfBlank', type: 'function', apply: snippet('IfBlank(${value}, ${valueIfBlank})') }
	];
	function formulaAutocomplete(context: CompletionContext) {
		let word = context.matchBefore(/\w*/);
		if (word && word.from === word.to && !context.explicit) return null;
		return { from: word?.from ?? context.pos, options: formulaCompletions, validFor: /^\w*$/ };
	}


	function variableAutocomplete(context: CompletionContext) {
		const match = context.matchBefore(/[\w\.]+/);
		if (!match) {
			const options = Object.keys(schema.children ?? {}).map(name => ({ label: name, type: schema.children![name].type }));
			return { from: context.pos, options, validFor: /^\w*$/ };
		}
		const text = match.text;
		const parts = text.split('.');
		const isDotTrigger = text.endsWith('.');
		let pathPrefix: string[];
		let activePart: string;
		if (isDotTrigger) {
			pathPrefix = parts.slice(0, -1);
			activePart = '';
		} else {
			pathPrefix = parts.slice(0, -1);
			activePart = parts[parts.length - 1];
		}
		let currentNode = schema;
		for (const part of pathPrefix) {
			if (currentNode.children && currentNode.children[part]) {
				currentNode = currentNode.children[part];
			} else {
				return null;
			}
		}
		if (!currentNode.children) return null;
		const options = Object.keys(currentNode.children)
			.filter((key) => key.toLowerCase().startsWith(activePart.toLowerCase()))
			.map((name) => ({
				label: name,
				type: currentNode.children![name].type,
				boost: name.toLowerCase() === activePart.toLowerCase() ? 10 : 0,
			}));
		return {
			from: match.from + pathPrefix.join('.').length + (pathPrefix.length > 0 ? 1 : 0),
			options,
			validFor: /^\w*$/
		};
	}


	const variablePathRegex = /\b[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*\b/g;
	const variableChipPlugin = ViewPlugin.fromClass(
		class {
			decorations: RangeSet<Decoration>;
			constructor(view: EditorView) {
				this.decorations = this.buildDecorations(view);
			}
			update(update: ViewUpdate) {
				if (update.docChanged || update.viewportChanged || update.selectionSet) {
					this.decorations = this.buildDecorations(update.view);
				}
			}
			buildDecorations(view: EditorView) {
				const builder = new RangeSetBuilder<Decoration>();
				const selection = view.state.selection.main;
				for (const { from, to } of view.visibleRanges) {
					const text = view.state.doc.sliceString(from, to);
					let match;
					while ((match = variablePathRegex.exec(text))) {
						const path = match[0];
						
						const node = getNodeForPath(path, schema);

						if (!node || node.type !== 'variable') {
							continue;
						}

						const start = from + match.index;
						const end = start + path.length;

						if (selection.from <= end && selection.to >= start) {
							continue;
						}
						
						builder.add(start, end, Decoration.replace({ widget: new VariableChipWidget(path, node.dataType) }));
					}
				}
				return builder.finish();
			}
		},
		{
			decorations: (v) => v.decorations
		}
	);

	let expression : string = $state('');

	$effect(() => {
		if (editorContainer) {
			// editorContainer.innerHTML = '';
			const state = EditorState.create({
				doc: expression,
				extensions: [
					autocompletion({ override: [formulaAutocomplete, variableAutocomplete] }),
					variableChipPlugin,
					EditorView.baseTheme({
						'.cm-completionIcon-object': { '&:after': { content: "'{}'" } },
						'.cm-completionIcon-variable': { '&:after': { content: "'v'" } },
						'.cm-completionLabel.cm-completion-object': { color: '#9a348e' },
					})
				]
			});
			new EditorView({ state, parent: editorContainer });
		}
	});
</script>

<div class="p-6 h-full">
	<div class="overflow-hidden rounded-md border h-full">
		<div bind:this={editorContainer}></div>
	</div>
</div>

<style>
	:global(.cm-variable-chip) {
		color: #f0fdf4;
		padding: 3px 4px 3px 8px; 
		border-radius: 12px;
		display: inline-flex; 
		align-items: center;
		gap: 6px; 
		line-height: 1;
		font-family: sans-serif;
		font-size: 13px;
		vertical-align: middle;
		cursor: pointer;
	}

	:global(.cm-variable-chip-icon) {
		background-color: rgba(255, 255, 255, 0.2);
		color: white;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		text-align: center;
		line-height: 16px; 
		font-size: 10px;
		font-weight: 500;
		font-family: monospace;
		user-select: none;
	}
	:global(.cm-completion-function) {
		color: #457b9d;
	}
	:global(.cm-completion-variable) {
		color: #166534;
	}
	:global(.cm-completion-object) {
		color: #9a348e;
		font-style: italic;
	}
</style>