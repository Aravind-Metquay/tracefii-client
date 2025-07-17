<script lang="ts">
  import {
    RadioGroup,
    Label,
    type WithoutChildrenOrChild,
    useId,
  } from "bits-ui";
 
  type Item = {
    value: string;
    label?: string;
    disabled?: boolean;
  };
 
  type Props = WithoutChildrenOrChild<RadioGroup.RootProps> & {
    items: Item[];
  };
 
  let {
    value = $bindable(""),
    ref = $bindable(null),
    items,
    ...restProps
  }: Props = $props();
</script>
 
<RadioGroup.Root bind:value bind:ref {...restProps}>
  {#each items as item}
    {@const id = useId()}
    <div class="flex items-center gap-3 cursor-pointer my-2">
      <RadioGroup.Item
        {id}
        value={item.value}
        disabled={item.disabled}
        class="
  relative w-4 h-4 rounded-full border border-gray-400 cursor-pointer
  hover:border-primary
  data-[state=checked]:border-primary

  after:content-[''] after:absolute after:inset-1 after:rounded-full
  after:bg-transparent data-[state=checked]:after:bg-primary
  after:transition-transform after:scale-0 data-[state=checked]:after:scale-100

  focus:outline-none focus:ring-2 focus:ring-[var(--ring-checkbox)]

  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-400
  transition-all
">
        {#snippet children({ checked })}
          {#if checked}
            <!-- Optional: Custom check icon or leave empty since styling handles it -->
          {/if}
        {/snippet}
      </RadioGroup.Item>
      {#if item.label}
      <Label.Root for={id} class="text-gray-700 ">{item.label}</Label.Root>
	  {/if}
    </div>
  {/each}
</RadioGroup.Root>

