<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger
  } from '@/components/ui/select/index';

  let selectedValue = '';

  const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'mango', label: 'Mango' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'raspberry', label: 'Raspberry' },
  { value: 'blackberry', label: 'Blackberry' },
  { value: 'pear', label: 'Pear' },
  { value: 'peach', label: 'Peach' },
  { value: 'plum', label: 'Plum' },
  { value: 'pomegranate', label: 'Pomegranate' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'lime', label: 'Lime' },
];


  function handleValueChange(event) {
    console.log('Selected:', event.detail);
  }
</script>

<div class="flex items-center justify-center h-screen bg-gray-100">
  <div class="p-6 bg-white rounded-lg shadow-md w-80">
    <h2 class="text-xl font-semibold mb-4 text-center">Basic Select</h2>

    <Select bind:value={selectedValue} on:change={handleValueChange}>
      <SelectTrigger class="w-full border rounded-md px-3 py-2 text-left">
        <span>{selectedValue || 'Select a fruit...'}</span>
      </SelectTrigger>

      <SelectContent class="w-full">
        {#each fruits as fruit}
          <SelectItem value={fruit.value}>{fruit.label}</SelectItem>
        {/each}
      </SelectContent>
    </Select>

    <p class="mt-4 text-center text-gray-600">Selected: {selectedValue}</p>
  </div>
</div>
