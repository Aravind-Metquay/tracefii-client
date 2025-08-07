<script lang="ts">
    import type * as fabric from 'fabric';
    import type { BarcodeOptions } from '../../../shared/canvas-manager.svelte'

    // --- Props ---
    let { selectedObject, updateBarcode } = $props<{
        selectedObject: fabric.Object & { data?: any };
        updateBarcode: (options: BarcodeOptions) => Promise<void>;
    }>();

    // --- Reactive state for the UI controls ---
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
            console.log('✅ Object is a barcode, syncing UI...');
            
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
                console.log(' Setting isGenerating = false');
            }
        }, 800);
        
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
            class="w-full rounded border border-gray-300 p-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
            disabled={isGenerating}
            bind:value={format}
        >
            <option value="CODE128">CODE128</option>
            <option value="CODE39">CODE39</option>
            <option value="EAN13">EAN-13</option>
            <option value="UPC">UPC</option>
            <option value="ITF14">ITF-14</option>
        </select>
    </div>

    <div class="flex flex-col gap-1">
        <label for="barcode-expression" class="text-xs text-gray-600">Data / Expression</label>
        <input
            id="barcode-expression"
            class="w-full rounded border border-gray-300 p-2 text-sm"
            placeholder="e.g., BAR##date_code##"
            disabled={isGenerating}
            bind:value={expression}
        />
        <p class="mt-1 w-full truncate text-xs text-gray-500" title={evaluatedValue}>
            <span class="font-medium">Preview:</span>
            {evaluatedValue}
        </p>
    </div>

    <div class="flex items-center gap-2">
        <input
            id="display-value"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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