<script lang="ts">
  export let progress: number = 40;
  export let outerSize: number = 160;
  export let innerSize: number = 144;
  export let label: string = '';
  export let showLabel: boolean = true;

  $: isTiny = outerSize === 64 && innerSize === 58;

  
  const strokeWidth = 10;
  const center = 80;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  $: strokeDashoffset = circumference - (progress / 100) * circumference;

  $: progressFontSize = (() => {
    switch (outerSize) {
      case 64: return '14px';
      case 160: return '24px';
      case 200: return '30px';
      case 280: return '36px';
      case 320: return '48px';
      default: return '24px'; 
    }
  })();


</script>

<div class="flex flex-col items-center" style="width: {outerSize}px;">
  <!-- Circle -->
  <div class="relative" style="width: {outerSize}px; height: {outerSize}px;">
    <div class="absolute inset-0 flex items-center justify-center bg-white rounded-full">
      <!-- SVG -->
      <svg width={innerSize} height={innerSize} viewBox="0 0 160 160" fill="none">
        <!-- Background Circle -->
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#F5F5F5"
          stroke-width={strokeWidth}
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
        <!-- Progress Circle -->
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#7F56D9"
          stroke-width={strokeWidth}
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          stroke-dasharray={circumference}
          stroke-dashoffset={strokeDashoffset}
          transform="rotate(-90 80 80)"
        />
      </svg>

     
      <div class="absolute text-center px-1">
        {#if showLabel && label && !isTiny}
          <div class="text-gray-500 text-sm font-medium mb-1">{label}</div>
        {/if}
     
        <div class="text-gray-900 font-bold" style="font-size: {progressFontSize};">
          {progress}%
      </div>
      </div>
    </div>
  </div>

  <!-- Label outside for tiny version -->
  {#if isTiny && showLabel && label}
    <div class="mt-2 text-center text-gray-500 text-sm font-medium">{label}</div>
  {/if}
</div>


