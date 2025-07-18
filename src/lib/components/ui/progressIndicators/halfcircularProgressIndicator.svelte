
<script lang="ts">
  export let progress: number = 40;
  export let width: number = 180;
  export let height: number = 180;
  export let label: string = '';
  export let showLabel: boolean = true;
  export let labelOutside: boolean = false;

  // Calculate radius based on width 
  $: radius = (width * 0.35); // Adjust this ratio to fit your design
  $: stroke = Math.max(4, width * 0.06); // Stroke width scales with size
  $: normalizedRadius = radius - stroke / 2;
  $: circumference = Math.PI * normalizedRadius; // Half circle circumference
  $: strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // SVG viewBox and positioning
  $: viewBoxWidth = radius * 2 + stroke;
  $: viewBoxHeight = radius + stroke;
  $: centerX = viewBoxWidth / 2;
  $: centerY = radius + stroke / 2;
  
  // Font sizes
  $: labelFontSize = Math.max(8, width * 0.08);
  $: progressFontSize = Math.max(12, width * 0.12);
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