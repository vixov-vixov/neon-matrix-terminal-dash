
import { AppState } from '../context/AppContext';

interface CommandProcessor {
  command: string;
  state: any;
  dispatch: any;
  onResponse?: (text: string) => void;
  playSuccess?: () => void;
  playTransition?: () => void;
}

export const processSharedCommand = ({
  command,
  state,
  dispatch,
  onResponse,
  playSuccess,
  playTransition
}: CommandProcessor): boolean => {
  const normalizedCommand = command.toLowerCase().trim();
  
  // Shared command processing logic
  if (
    normalizedCommand.includes('dashboard') || 
    normalizedCommand.includes('main screen') ||
    normalizedCommand.includes('home')
  ) {
    onResponse?.("Accessing main dashboard. Initializing...");
    setTimeout(() => {
      playTransition?.();
      dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD });
    }, 1500);
    return true;
  }
  
  if (
    normalizedCommand.includes('terminal') || 
    normalizedCommand.includes('console') ||
    normalizedCommand.includes('command line')
  ) {
    onResponse?.("Activating command console interface. Standby...");
    setTimeout(() => {
      playTransition?.();
      dispatch({ type: 'SET_STATE', payload: AppState.COMMAND_CONSOLE });
    }, 1500);
    return true;
  }
  
  if (
    normalizedCommand.includes('matrix') || 
    normalizedCommand.includes('neo')
  ) {
    dispatch({ type: 'TOGGLE_MATRIX_RAIN' });
    onResponse?.("Digital rain protocol toggled. 'There is no spoon.'");
    playSuccess?.();
    return true;
  }
  
  if (
    normalizedCommand.includes('mute') || 
    normalizedCommand.includes('sound off') ||
    normalizedCommand.includes('toggle sound')
  ) {
    dispatch({ type: 'TOGGLE_SOUND' });
    onResponse?.(
      state.soundEnabled ? 
        "Sound disabled. Entering silent mode." : 
        "Sound enabled. Audio feedback restored."
    );
    playSuccess?.();
    return true;
  }
  
  if (
    normalizedCommand.includes('help') || 
    normalizedCommand.includes('what can you do') ||
    normalizedCommand.includes('commands')
  ) {
    onResponse?.("Available commands:\n• 'Open accounts' - Access the accounts ledger\n• 'Dashboard' - Return to main dashboard\n• 'Terminal' - Open command console\n• 'Toggle sound' - Enable/disable audio\n• 'Matrix' - Toggle digital rain effect\n• 'Logout' - End current session");
    playSuccess?.();
    return true;
  }
  
  if (
    normalizedCommand.includes('logout') || 
    normalizedCommand.includes('sign out') ||
    normalizedCommand.includes('exit')
  ) {
    onResponse?.("Initiating logout sequence. Goodbye.");
    setTimeout(() => {
      playTransition?.();
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      dispatch({ type: 'SET_STATE', payload: AppState.LOGIN });
    }, 1500);
    return true;
  }

  return false;
};
