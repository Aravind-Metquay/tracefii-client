<script lang="ts">
    import type * as fabric from 'fabric';
    import type { BarcodeOptions } from '../../../shared/canvas-manager.svelte'

    let { selectedObject, updateBarcode } = $props<{
        selectedObject: fabric.Object & { data?: any };
        updateBarcode: (options: BarcodeOptions) => Promise<void>;
    }>();

    let expression = $state('');
    let format = $state('CODE128');
    let barWidth = $state(2);
    let barHeight = $state(50);
    let displayValue = $state(true);
    let isGenerating = $state(false);
    let evaluatedValue = $state('');
    let debounceTimer: NodeJS.Timeout;

    // --- Effect to sync the UI when the selected object changes ---
    $effect(() => {
     
        const data = selectedObject?.data;
       
        if (data?.type === 'Barcode') {
            
            const newExpression = data.expression || 'BAR##date_code##';
            const newFormat = data.format || 'CODE128';
            const newBarWidth = data.barWidth || 2;
            const newBarHeight = data.barHeight || 50;
            const newDisplayValue = data.displayValue ?? true;
            

            expression = newExpression;
            format = newFormat;
            barWidth = newBarWidth;
            barHeight = newBarHeight;
            displayValue = newDisplayValue;
            
            
        } else {
            console.log(' Object is not a barcode or no data available');
        }
    });

    // --- Main effect to handle updates ---
    $effect(() => {
       
        // Log current values
        const currentOptions: BarcodeOptions = { expression, format, barWidth, barHeight, displayValue };
       
        // 1. Update preview instantly
        const today = new Date();
        const dateCode = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
        const newEvaluatedValue = currentOptions.expression.replace(/##date_code##/gi, dateCode);
        
        evaluatedValue = newEvaluatedValue;
       
        // 2. Debounce the actual canvas update
        clearTimeout(debounceTimer);
        
        debounceTimer = setTimeout(async () => {
          
            isGenerating = true;
      
            try {
                await updateBarcode(currentOptions);
            } catch (error) {
                console.error(' Error in updateBarcode:', error);
            } finally {
                isGenerating = false;
            }
        }, 300);
        
    });

    // --- Cleanup effect ---
    $effect(() => {
        return () => {
            clearTimeout(debounceTimer);
        };
    });

</script>

<div class="space-y-4">
    <h4 class="text-sm font-medium text-gray-700">Barcode Properties</h4>

    <div class="flex flex-col gap-1">
        <label for="barcode-format" class="text-xs text-gray-600">Format</label>
        <select
            id="barcode-format"
           class="w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat 
			bg-[right_0.75rem_center] bg-[length:1em_1em] 
			bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22currentColor%22%20class%3d%22h-5%20w-5%22%3e%3cpath%20fill-rule%3d%22evenodd%22%20d%3d%22M5.23%207.21a.75.75%200%20011.06.02L10%2010.94l3.71-3.71a.75.75%200%20111.06%201.06l-4.25%204.25a.75.75%200%2001-1.06%200L5.21%208.27a.75.75%200%2001.02-1.06z%22%20clip-rule%3d%22evenodd%22%20/%3e%3c/svg%3e')]
			mt-1 py-2 pl-3 pr-8 text-sm focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 "
            disabled={isGenerating}
            bind:value={format}
        >
            <option value="CODE128">CODE128</option>
            <option value="CODE39">CODE39</option>
          
        </select>
    </div>

    <div class="flex flex-col gap-1">
        <label for="barcode-expression" class="text-xs text-gray-600">Data / Expression</label>
        <input
            id="barcode-expression"
            class="w-full rounded-md border border-gray-300 p-2 text-sm"
            placeholder="e.g., BAR##date_code##"
            disabled={isGenerating}
            bind:value={expression}
        />
        <!-- <p class="mt-1 w-full truncate text-xs text-gray-500" title={evaluatedValue}>
            <span class="font-medium">Preview:</span>
            {evaluatedValue}
        </p> -->
    </div>

    <div class="flex items-center gap-2">
        <input
            id="display-value"
            type="checkbox"
            class="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
            disabled={isGenerating}
            bind:checked={displayValue}
        />
        <label for="display-value" class="text-sm text-gray-700">Show Text</label>
    </div>

   

    {#if isGenerating}
        <div class="flex items-center gap-2 text-xs text-blue-600">
            <div class="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent"></div>
            Generating barcode...
        </div>
    {/if}
</div>