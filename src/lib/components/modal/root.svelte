<script lang='ts'>
  import { X } from '@lucide/svelte';
  
  // Props
  let { 
    isOpen = $bindable(false),
    title = '',
    size = 'medium',
    onClose = () => {},
    children
  } = $props();
  

  
  let dialogElement : HTMLDialogElement | null = $state(null);
  
  // Close modal function
  function closeModal() {
    isOpen = false;
    onClose();
  }
  
  // Handle backdrop click (light dismiss)
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogElement) {
      closeModal();
    }
  }
  
  // Handle escape key
  function handleKeydown(event: { key: string; }) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
  
  // Update dialog state when isOpen changes
  $effect(() => {
    if (dialogElement) {
      if (isOpen) {
        dialogElement.showModal();
      } else {
        dialogElement.close();
      }
    }
  });
</script>

<dialog 
  bind:this={dialogElement}
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
  class="modal"
>
  <div class="modal-content {size}" onclick={(e) => e.stopPropagation()}>
    <!-- Header with title and close button -->
    <header class="modal-header">
      <h2 class="modal-title">{title}</h2>
      <button 
        type="button" 
        onclick={closeModal}
        class="close-button"
        aria-label="Close modal"
      >
        <X size={20} />
      </button>
    </header>
    
    <!-- Body content -->
    <div class="modal-body">
      {@render children()}
    </div>
  </div>
</dialog>

<style>
  .modal {
    border: none;
    border-radius: 12px;
    padding: 0;
    background: transparent;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }
  
  .modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 300px;
  }
  
  /* Size variants */
  .modal-content.small {
    width: 400px;
    max-width: 90vw;
  }
  
  .modal-content.medium {
    width: 500px;
    max-width: 90vw;
  }
  
  .modal-content.large {
    width: 700px;
    max-width: 90vw;
  }
  
  .modal-content.xlarge {
    width: 900px;
    max-width: 95vw;
  }
  
  .modal-content.full {
    width: 95vw;
    height: 90vh;
    max-width: none;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #fafafa;
  }
  
  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .close-button:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  .close-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }
  
  @media (max-width: 480px) {
    .modal-content.small,
    .modal-content.medium,
    .modal-content.large,
    .modal-content.xlarge {
      width: 90vw;
      margin: 20px;
    }
    
    .modal-content.full {
      width: 95vw;
      height: 85vh;
    }
    
    .modal-header {
      padding: 16px 20px 12px 20px;
    }
    
    .modal-body {
      padding: 20px;
    }
  }
</style>