<script>
  import { onMount } from 'svelte';
  
  let { editor } = $props();
  let canvasElement = $state();
  
  onMount(() => {
    if (canvasElement && editor) {
      editor.initializeCanvas(canvasElement);
    }
    
    return () => {
      if (editor.canvas) {
        editor.canvas.dispose();
      }
    };
  });
</script>

<div class="canvas-container w-full h-full flex items-center justify-center">
  <canvas bind:this={canvasElement} class="border border-gray-300 shadow-lg"></canvas>
</div>

<style>
  .canvas-container {
    min-height: 400px;
  }
</style>