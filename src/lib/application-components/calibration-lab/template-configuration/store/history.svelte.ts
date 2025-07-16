export function createHistory(maxSize = 50) {
  let commands = $state([]);
  let currentIndex = $state(-1);
  
  let canUndo = $derived(currentIndex >= 0);
  let canRedo = $derived(currentIndex < commands.length - 1);
  let currentState = $derived(commands[currentIndex]);
  
  return {
    get canUndo() { return canUndo; },
    get canRedo() { return canRedo; },
    get currentState() { return currentState; },
    
    execute: (command) => {
      // Remove future commands when executing new one
      commands.splice(currentIndex + 1);
      
      // Execute command
      command.execute();
      commands.push(command);
      currentIndex++;
      
      // Limit history size
      if (commands.length > maxSize) {
        commands.shift();
        currentIndex--;
      }
    },
    
    undo: () => {
      if (canUndo) {
        commands[currentIndex].undo();
        currentIndex--;
      }
    },
    
    redo: () => {
      if (canRedo) {
        currentIndex++;
        commands[currentIndex].execute();
      }
    },
    
    clear: () => {
      commands = [];
      currentIndex = -1;
    }
  };
}