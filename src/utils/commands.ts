
import { AppState } from '../context/AppContext';
import { appendLogMessage } from './logger';
import { processSharedCommand } from './commandProcessor';

export const processCommand = (
  cmd: string,
  state: any,
  dispatch: any,
  appendToLog: any,
  playSuccess: () => void,
  playError: () => void,
  playKeypress: () => void
) => {
  const lowerCmd = cmd.toLowerCase().trim();
  
  appendToLog(`<span class="text-hacker-cyan">$</span> ${cmd}`, 'input');
  
  // First try shared commands
  const wasSharedCommand = processSharedCommand({
    command: lowerCmd,
    state,
    dispatch,
    onResponse: (text) => appendToLog(text, 'output'),
    playSuccess,
    playTransition: playSuccess // Using playSuccess as transition sound for consistency
  });
  
  if (wasSharedCommand) return false;
  
  // Handle console-specific commands
  switch (lowerCmd) {
    case 'clear':
      return true; // Signal to clear the log
      
    case 'system logs':
      appendToLog('SYSTEM LOGS ACCESS - Displaying recent activity:', 'output');
      appendToLog(state.commandHistory.slice(-10).map((cmd: string) => 
        `<span class="text-hacker-neon/60">[SYSTEM] ${cmd}</span>`
      ).join('\n'), 'output');
      playSuccess();
      break;
      
    case '':
      break;
      
    default:
      if (lowerCmd.startsWith('echo ')) {
        appendToLog(cmd.substring(5), 'output');
        playSuccess();
      } else {
        appendToLog(`Command not recognized: "${cmd}"`, 'error');
        appendToLog('Type "help" for available commands.', 'output');
        playError();
      }
      break;
  }
  
  return false;
};
