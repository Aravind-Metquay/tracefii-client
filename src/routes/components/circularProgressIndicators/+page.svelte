<script lang="ts">
  import CircularProgressIndicator from '@/components/ui/progressIndicators/CircularProgressIndicator.svelte';

  const sizes = [
    { outer: 64, inner: 58 },
    { outer: 160, inner: 144 },
    { outer: 200, inner: 180 },
    { outer: 280, inner: 252 },
    { outer: 320, inner: 288 }
  ];
</script>



<div class="min-h-screen p-8 bg-white  flex flex-col items-center">
 
  <div class="flex flex-wrap gap-8 justify-center">
    {#each sizes as size}
      <CircularProgressIndicator
        progress={40}
        outerSize={size.outer}
        innerSize={size.inner}
        
        showLabel={false}
      />
    {/each}
  </div>
  <div class="flex flex-wrap gap-8 justify-center">
    {#each sizes as size}
      <CircularProgressIndicator
        progress={40}
        outerSize={size.outer}
        innerSize={size.inner}
        label="Active users"
        showLabel={true}
      />
    {/each}
  </div>
</div>

