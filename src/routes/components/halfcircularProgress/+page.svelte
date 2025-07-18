
<script lang="ts">
  import HalfcircularProgressIndicator from "@/components/ui/progressIndicators/halfcircularProgressIndicator.svelte";
  
  const sizes = [
    { width: 58, height: 58 },
    { width: 144, height: 144 },
    { width: 180, height: 180 },
    { width: 240, height: 132 },
    { width: 280, height: 154 }
  ];
</script>

<div class="p-8 bg-gray-50 min-h-screen">
  
  <div class="grid grid-cols-5 gap-6 mb-12 ">
  
    {#each sizes.slice(0, 5) as size, index}
      <div class="flex justify-start items-center">
        <HalfcircularProgressIndicator
          progress={40}
          width={size.width}
          height={size.height}
          showLabel={false}
        />
      </div>
    {/each}
  </div>
  
  <div class="grid grid-cols-5 gap-6">
  
    {#each sizes.slice(0, 5) as size, index}
      <div class="flex justify-center items-center">
        <HalfcircularProgressIndicator
          progress={40}
          width={size.width}
          height={size.height}
          label="Active users"
          showLabel={true}
          labelOutside={size.width === 58 && size.height === 58}
        />
      </div>
    {/each}
  </div>
  
  
</div>