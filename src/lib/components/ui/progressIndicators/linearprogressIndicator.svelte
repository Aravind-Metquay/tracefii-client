<script lang="ts">
  export let progress: number = 0; // Progress value (0-100)
  export let labelPosition: 'none'| 'right' | 'bottom' | 'topfloating' | 'botomfloating' = 'right'; // Label position
  export let size: 'sm' | 'md' | 'lg' = 'md'; // Size variant
  export let color: 'brand' = 'brand'; // Color variant
  export let width: string = 'w-80'; //  (default: w-80 = 320px)

  // Ensure progress is between 0 and 100
  $: clampedProgress = Math.max(0, Math.min(100, progress));

  // Size configurations
  const sizes: Record<string, { height: string; text: string; labelGap: string }> = {
    sm: {
      height: "h-[8px]",
      text: "text-sm",
      labelGap: "gap-1"
    },
    md: {
      height: "h-[8px]",
      text: "text-[14px]",
      labelGap: "gap-2"
    },
    lg: {
      height: "h-[8px]",
      text: "text-[14px]",
      labelGap: "gap-3"
    }
  };

  // Color configurations
  const colors: Record<string, { bg: string; fill: string; text: string }> = {
    brand: {
      bg: "bg-gray-200",
      fill: "bg-purple-600", 
      text: "text-gray-700"
    },
  };

  $: sizeConfig = sizes[size] || sizes.md;
  $: colorConfig = colors[color] || colors.brand;
</script>

<!-- Progress Label Component -->
{#if labelPosition !== 'none'}
  <!-- Label for floating positions -->
  {#if labelPosition === 'topfloating' || labelPosition === 'botomfloating'}
    <div class="relative" style="width: 320px;">
      <!-- Progress bar -->
      <div class="flex-1 {sizeConfig.height} {colorConfig.bg}  rounded-[4px] overflow-hidden">
        <div 
          class="h-full {colorConfig.fill} rounded-[4px] transition-all duration-300 ease-out"
          style="width: {clampedProgress}%"
        ></div>
      </div>
      
      <!-- Floating label -->

      <div 
        class="absolute {labelPosition === 'topfloating' ? '-top-6' : '-bottom-6'} transform -translate-x-1/2 {sizeConfig.text} {colorConfig.text} font-medium bg-white px-2 py-1 rounded-[4px] shadow-sm border transition-all duration-300 ease-out font-inter"
        style="left: {clampedProgress}%"
      >
        {Math.round(clampedProgress)}%
      </div>
    </div>
  
  <!-- Label for right position -->
  {:else if labelPosition === 'right'}
    <div class="flex items-center space-x-[12px]"
    
    style="width: 320px;">
  
      <!-- Progress track -->
      <div class="flex-1 {sizeConfig.height} {colorConfig.bg} rounded-[4px] overflow-hidden">
        <div 
          class="h-full {colorConfig.fill} rounded-[4px] transition-all duration-300 ease-out"
          style="width: {clampedProgress}%"
        ></div>
      </div>
      
      <!-- Progress percentage -->
      <div class="flex-shrink-0 {sizeConfig.text} {colorConfig.text} font-medium min-w-8 text-right">
        {Math.round(clampedProgress)}%
      </div>
    </div>
  
 

    <!-- Label for bottom position -->
  {:else if labelPosition === 'bottom'}
    <div class="flex flex-col space-y-[2px] {sizeConfig.labelGap}" style="width: 320px;">
      <!-- Progress track -->
   
      <div
        class={` rounded-[4px] overflow-hidden ${sizeConfig.height} ${color === 'brand' ? 'bg-gray-200' : ''}`}>
            <div 
            class={`h-full rounded-[4px] transition-all duration-300 ease-out ${color === 'brand' ? 'bg-purple-600' : ''}`}
            style="width: {clampedProgress}%"
            ></div>
      </div>
      
      <!-- Progress percentage -->
      <div class="flex-shrink-0 {sizeConfig.text} {colorConfig.text} font-medium min-w-8 text-right">
        {Math.round(clampedProgress)}%
      </div>
    </div>
  {/if}




  <!-- No label - just progress bar -->
{:else}
  <div style="width: 320px;">
    <div class="flex-1 {sizeConfig.height} {colorConfig.bg} rounded-[4px] overflow-hidden">
      <div 
        class="h-full {colorConfig.fill} rounded-[4px] transition-all duration-300 ease-out"
        style="width: {clampedProgress}%"
      ></div>
    </div>
  </div>
{/if}