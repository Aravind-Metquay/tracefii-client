<script lang="ts">
  import { getContext } from "svelte";
  import type { WorksheetManager } from "../store.svelte";
	import AddComponentModal from "./add-component-modal.svelte";
  const worksheetManager = getContext<WorksheetManager>("worksheetManager");
</script>

<div class="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
  <div class="flex items-center gap-4">
    <!-- <button>
      Exit
    </button> -->

    <div>
      <h1 class="text-lg font-semibold text-gray-800">{worksheetManager.getWorksheet().metadata.worksheetName || "Untitled Worksheet"}</h1>
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span>ID: {worksheetManager.getWorksheet().metadata.worksheetId || "N/A"}</span>
        <span>&bull;</span>
        <span>Version: {worksheetManager.getWorksheet().metadata.worksheetName || "1.0.0"}</span>
      </div>
    </div>
  </div>

  <AddComponentModal />

  <div class="flex items-center gap-4">
    <div class="flex items-center p-1 bg-gray-200 rounded-lg">
      <button>Edit</button>
      <button>View</button>
    </div>
    <button>Save</button>
  </div>
</div>