
<script lang="ts">
	import { derived } from "svelte/store";
  let { width = 180, progress = 40,
    height = 180, label = '', showLabel = true, labelOutside = false
   }: { width?: number; progress?: number
    height?: number; label?: string; showLabel?: boolean; labelOutside?: boolean  } = $props(); 
  
 
  // Calculate radius based on width 
  const radius = $derived(width * 0.35); // Adjust this ratio to fit your design
  const stroke = $derived(Math.max(4, width * 0.06)); // Stroke width scales with size
  const normalizedRadius =$derived(radius - stroke/2);
  const circumference = $derived(Math.PI * normalizedRadius); // Half circle circumference
  const strokeDashoffset = $derived(circumference - (progress / 100) * circumference);
  
  // SVG viewBox and positioning
  const viewBoxWidth =$derived(radius * 2 + stroke); 
  const viewBoxHeight =$derived( radius + stroke);
  const centerX = $derived(viewBoxWidth / 2);
  const centerY = $derived(radius + stroke / 2);
  
  // Font sizes
  const labelFontSize =$derived( Math.max(8, width * 0.08));
  const progressFontSize = $derived(Math.max(12, width * 0.12));
</script>

<div class="relative flex items-center justify-center" style="width: {width}px; height: {height}px;">

  <svg
    class="absolute"
    width={width}
    height={height}
    viewBox="0 0 {viewBoxWidth} {viewBoxHeight}"
  >
    <!-- Background semicircle -->
    <path
      d="M {stroke/2} {centerY} A {normalizedRadius} {normalizedRadius} 0 0 1 {viewBoxWidth - stroke/2} {centerY}"
      fill="transparent"
      stroke="#e5e7eb"
      stroke-width={stroke}
      stroke-linecap="round"
    />
    
    <!-- Progress semicircle -->
    <path
      d="M {stroke/2} {centerY} A {normalizedRadius} {normalizedRadius} 0 0 1 {viewBoxWidth - stroke/2} {centerY}"
      fill="none"
      stroke="url(#gradient-{width}-{height})"
      stroke-width={stroke}
      stroke-dasharray={circumference}
      stroke-dashoffset={strokeDashoffset}
      stroke-linecap="round"
    />
    
    <defs>
      <linearGradient id="gradient-{width}-{height}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#7F56D9" />
        <stop offset="100%" stop-color="#7F56D9" />
      </linearGradient>
    </defs>
  </svg>
  
  <!-- Text content -->
  {#if labelOutside && showLabel && label}
    <!-- Label outside semicircle -->
    <div class="absolute" style="top: {height + 5}px; left: 50%; transform: translateX(-50%);">
      <div 
        class="text-gray-500 text-center"
        style="font-size: {labelFontSize}px;"
      >
        {label}
      </div>
    </div>
    <!-- Percentage inside semicircle -->
    <div class="absolute inset-0 flex items-center justify-center text-center" style="margin-top: {height * 0.1}px;">
      <div 
        class="font-semibold text-gray-800"
        style="font-size: {progressFontSize}px;"
      >
        {progress}%
      </div>
    </div>
  {:else}
    <!-- Default: both label and percentage inside semicircle -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-2" style="margin-top: {height * 0.1}px;">
      {#if showLabel && label}
        <div 
          class="text-gray-500 leading-tight mb-1 max-w-full overflow-hidden"
          style="font-size: {labelFontSize}px;"
        >
          {label}
        </div>
      {/if}
      <div 
        class="font-semibold text-gray-800"
        style="font-size: {progressFontSize}px;"
      >
        {progress}%
      </div>
    </div>
  {/if}
</div>