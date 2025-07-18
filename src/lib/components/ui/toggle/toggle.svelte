<script lang="ts">
  import { Switch as SwitchPrimitive } from "bits-ui";
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
  let {
    ref = $bindable(null),
    class: className,
    checked = $bindable(false),
    ...restProps
  }: WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props();
</script>
<SwitchPrimitive.Root
  bind:ref
  bind:checked
  data-slot="switch"
  class={cn(
    "w-[2.25rem] h-[1.25rem] p-[0.125rem]  rounded-[0.75rem] data-[state=checked]:bg-primary data-[state=unchecked]:bg-[var(--ring-secondary)] transition-all focus:ring-[0.1875rem] focus:ring-[var(--ring-checkbox)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
    "hover:data-[state=unchecked]:bg-[var(--checkbox-disabled)] ",
    className
  )}
  {...restProps}
>
  <SwitchPrimitive.Thumb
    data-slot="switch-thumb"
    class={cn(
      "bg-background dark:data-[state=unchecked]:bg-[var(--background)] pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
    )}
  />
</SwitchPrimitive.Root>