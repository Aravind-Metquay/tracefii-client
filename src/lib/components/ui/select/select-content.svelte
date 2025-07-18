<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import "./select.css"
	import { cn, type WithoutChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		portalProps,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.ContentProps> & {
		portalProps?: SelectPrimitive.PortalProps;
	} = $props();
</script>

<SelectPrimitive.Portal {...portalProps} >
	<SelectPrimitive.Content
		bind:ref
		{sideOffset}
		data-slot="select-content"
		class={cn(
			"w-[20rem] h-[20rem] font-medium rounded-[0.5rem] border bg-white overflow-y-scroll custom-scrollbar cursor-pointer overflow-x-hidden ",
			className
		)}
		{...restProps}
	>
			{@render children?.()}
		
		
	</SelectPrimitive.Content>
</SelectPrimitive.Portal>


