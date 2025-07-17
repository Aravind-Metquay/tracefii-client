<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";
	

	export const buttonVariants = tv({
		base: "items-center justify-center gap-2 rounded-md text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
				primary:"bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] focus:ring-4 focus:ring-[var(--ring-primary)] focus:bg-primary ",
				secondary: "bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)] focus:ring-4 focus:ring-[var(--ring-secondary)]  ",
				destructive:
					"bg-destructive text-white hover:bg-[var(--destructive-hover)] focus:ring-4 focus:ring-[var(--ring-destructive)] focus:bg-destructive",
				outline:
					"bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border",
				ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},	
			size: {
				default: "h-[40px] w-[110px] py-[10px] px-[16px] border rounded-lg",
				sm: "h-[36px] w-[106px] py-[8px] px-[14px] border rounded-lg ",
				lg: "h-[44px] w-[125px] py-[10px] px-[18px] border rounded-lg",
				xl: "h-[48px] w-[129px] py-[12px] px-[20px] border rounded-lg",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
