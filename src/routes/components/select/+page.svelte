<script lang="ts">
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectLabel
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

</script>

<div class="flex items-center justify-center h-screen bg-gray-100 ">
  <div class="p-[1.5rem] bg-white rounded-lg shadow-md w-[22rem]">
    <h2 class="text-xl font-semibold mb-[1rem] text-center"> Select</h2>

  <Select bind:value={selectedValue} type="single">
  <SelectLabel>Fruits</SelectLabel>
  <SelectTrigger placeholder="Pick a Fruit" value={selectedValue}>
  </SelectTrigger>

  <SelectContent>
    {#each fruits as fruit}
      <SelectItem value={fruit.value}>{fruit.label}</SelectItem>
    {/each}
  </SelectContent>
  </Select>

  </div>
</div>

