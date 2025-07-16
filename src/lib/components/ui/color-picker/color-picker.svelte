<script>
  let { 
    color = $bindable({ r: 255, g: 255, b: 255 }),
    onchange
  } = $props();
  
  let showPicker = $state(false);
  
  $effect(() => {
    if (onchange) {
      onchange(color);
    }
  });
  
  function rgbToHex(rgb) {
    return '#' + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
  }
  
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
  
  function handleColorInput(event) {
    color = hexToRgb(event.target.value);
  }
</script>

<div class="relative">
  <button
    onclick={() => showPicker = !showPicker}
    class="w-8 h-8 rounded border border-gray-300 cursor-pointer"
    style="background-color: {rgbToHex(color)}"
  ></button>
  
  {#if showPicker}
    <div class="absolute top-10 left-0 p-4 bg-white border border-gray-300 rounded shadow-lg z-50">
      <input
        type="color"
        value={rgbToHex(color)}
        oninput={handleColorInput}
        class="w-32 h-8"
      />
      <div class="mt-2 space-y-1">
        <label class="text-xs">R: <input type="range" min="0" max="255" bind:value={color.r} class="w-full" /></label>
        <label class="text-xs">G: <input type="range" min="0" max="255" bind:value={color.g} class="w-full" /></label>
        <label class="text-xs">B: <input type="range" min="0" max="255" bind:value={color.b} class="w-full" /></label>
      </div>
    </div>
  {/if}
</div>