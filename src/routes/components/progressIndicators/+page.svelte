<script lang="ts">
  import ProgressIndicator from "@/components/ui/progressIndicators/linearprogressIndicator.svelte";
     
  // Initialize some progress values
  let progress: number = 5;
  let progressValues = [0, 10,20,30, 40,50,60, 70, 80, 90, 100];
       
</script>



  <section class="container mx-auto ">
    <h1 class="text-2xl font-inter  mb-6">Linear Progress Indicators</h1>
    
   
    
    <!-- Progress Indicators with different label positions and sizes -->
 
   <div class="flex space-y-6 space-x-4 flex gap-4 bg-white p-6 justify-center">  
    
      
      
      
      <div class="flex flex-col gap-10  "> 
        {#each progressValues as progress}
          <ProgressIndicator {progress} color="brand" labelPosition="none" />
        {/each}
      </div>
    
       
      

    
      
          <div class="flex flex-col gap-6 ">
        {#each progressValues as progress}
          <ProgressIndicator {progress} color="brand" labelPosition="right" />
        {/each}
      </div>
     

    
  
     <div class="flex flex-col gap-3">
        {#each progressValues as progress}
          <ProgressIndicator {progress} color="brand" labelPosition="bottom" />
        {/each}
      </div>
 

   
    

   
         
   
     
    
           
   
       </div> 
       
       <div class="flex space-y-6 space-x-4 flex gap-4 bg-white p-6 justify-center"> 
        <div class="flex flex-col gap-8">
        {#each progressValues as progress}
          <ProgressIndicator {progress} color="brand" labelPosition="topfloating" />
        {/each}
      </div>
   

     
    
      <div class="flex flex-col gap-8">
        {#each progressValues as progress}
          <ProgressIndicator {progress} color="brand" labelPosition="botomfloating" />
        {/each}
      </div>
    
       </div>

   </section>  
