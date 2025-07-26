<script lang="ts">
  import { fade, fly } from 'svelte/transition';

  // Props now include `children` for the new render tag syntax.
  let {
    children, // The default snippet passed from the parent
    open = $bindable(false),
    position = 'right' as 'top' | 'bottom' | 'left' | 'right',
    size = '320px',
    duration = 300,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    preventScroll = true,
    ariaLabel = 'Drawer',
    ariaDescribedBy = undefined as string | undefined,
    onOpen = () => {},
    onClose = () => {},
    onOpenComplete = () => {},
    onCloseComplete = () => {},
  } = $props();

  // State, Derived State, and Effects remain the same as they are part of the component's logic,
  // not its template syntax.
  let drawerElement = $state<HTMLElement | null>(null);
  let isTransitioning = $state(false);
  let previouslyFocusedElement = $state<Element | null>(null);

  let scrollbarWidth = 0;
  let originalBodyPaddingRight = '';
  let originalBodyOverflow = '';

  const FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const isVertical = $derived(position === 'top' || position === 'bottom');
  const transformAxis = $derived(isVertical ? 'y' : 'x');
  const transformDirection = $derived(position === 'bottom' || position === 'right' ? 1 : -1);

  const drawerStyleString = $derived(`
    position: fixed;
    ${position}: 0;
    ${isVertical ? `
      left: 0;
      right: 0;
      height: ${size};
      max-height: 100vh;
    ` : `
      top: 0;
      bottom: 0;
      width: ${size};
      max-width: 100vw;
    `}
    z-index: 50;
    background-color: white;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  `);
  
  $effect(() => {
    if (typeof window === 'undefined') return;

    if (open) {
      // OPEN LOGIC
      previouslyFocusedElement = document.activeElement;
      isTransitioning = true;
      if (preventScroll) lockScroll();
      onOpen();

      const openTimeout = setTimeout(() => {
        focusFirstElement();
        isTransitioning = false;
        onOpenComplete();
      }, duration);

      return () => {
        clearTimeout(openTimeout);
        // CLOSE LOGIC
        isTransitioning = true;
        if (preventScroll) restoreScroll();
        onClose();

        setTimeout(() => {
          if (previouslyFocusedElement instanceof HTMLElement && previouslyFocusedElement.focus) {
            previouslyFocusedElement.focus();
          }
          isTransitioning = false;
          onCloseComplete();
        }, duration);
      };
    }
  });

  // --- Helper Functions (unchanged) ---

  function lockScroll() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    originalBodyPaddingRight = document.body.style.paddingRight;
    originalBodyOverflow = document.body.style.overflow;

    if (scrollbarWidth > 0) {
      const currentPadding = parseInt(window.getComputedStyle(document.body).paddingRight, 10) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
  }

  function restoreScroll() {
    document.body.style.paddingRight = originalBodyPaddingRight;
    document.body.style.overflow = originalBodyOverflow;
  }

  function focusFirstElement() {
    if (!drawerElement) return;
    const focusable = drawerElement.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      drawerElement.focus();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!open || isTransitioning) return;

    if (closeOnEscape && event.key === 'Escape') {
      event.preventDefault();
      open = false;
    }

    if (event.key === 'Tab') {
      const focusable = Array.from(drawerElement?.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS) ?? []);
      if (focusable.length === 0) return;
      
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  function handleBackdropClick() {
    if (closeOnOutsideClick) {
      open = false;
    }
  }

  function getTransitionParams() {
    return {
      [transformAxis]: 100,
      duration,
      opacity: 1
    };
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div
    class="drawer-backdrop"
    onclick={handleBackdropClick}
    transition:fade={{ duration: duration / 2 }}
    style="
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 40;
    "
  ></div>
  
  <div
    bind:this={drawerElement}
    class="drawer"
    role="dialog"
    aria-modal="true"
    aria-label={ariaLabel}
    aria-describedby={ariaDescribedBy}
    tabindex="-1"
    style={drawerStyleString}
    transition:fly={getTransitionParams()}
  >
    {@render children({ open })}
  </div>
{/if}

<style>
  .drawer {
    outline: none;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    will-change: transform;
  }
  .drawer:focus-visible {
    outline: 2px solid #3b82f6; /* Tailwind's blue-500 */
    outline-offset: -2px;
  }
  @media (prefers-reduced-motion: reduce) {
    .drawer {
      transition-duration: 0.01ms !important;
    }
  }
</style>