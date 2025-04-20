
import { AppState } from '../context/AppContext';
import { appendLogMessage } from './logger';

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
  
  switch (lowerCmd) {
    case 'help':
      appendToLog(`Available commands:
- accounts: View and manage account transactions
- system logs: View system activity logs
- settings: Adjust system settings
- assistant: Open AI virtual assistant
- clear: Clear the console display
- exit: Return to dashboard
- hello/hi/hey: Simple greeting command
- help: Display this help message`, 'output');
      playSuccess();
      break;
      
    case 'accounts':
      playSuccess();
      dispatch({ type: 'SET_STATE', payload: AppState.ACCOUNTS_TABLE });
      appendToLog('Accessing accounts module...', 'output');
      break;
      
    case 'system logs':
      appendToLog('SYSTEM LOGS ACCESS - Displaying recent activity:', 'output');
      appendToLog(state.commandHistory.slice(-10).map((cmd: string) => 
        `<span class="text-hacker-neon/60">[SYSTEM] ${cmd}</span>`
      ).join('\n'), 'output');
      playSuccess();
      break;
      
    case 'settings':
      appendToLog('SETTINGS MODULE - Options:', 'output');
      appendToLog(`- Sound: ${state.soundEnabled ? 'ENABLED' : 'DISABLED'}
- Developer Mode: ${state.isDeveloperMode ? 'ENABLED' : 'DISABLED'}
- Matrix Effect: ${state.isMatrixRainActive ? 'ENABLED' : 'DISABLED'}`, 'output');
      appendToLog('Use "toggle sound", "toggle dev", or "toggle matrix" to change settings.', 'output');
      playSuccess();
      break;
      
    case 'toggle sound':
      dispatch({ type: 'TOGGLE_SOUND' });
      appendToLog(`Sound effects ${!state.soundEnabled ? 'ENABLED' : 'DISABLED'}`, 'success');
      if (!state.soundEnabled) playSuccess();
      break;
      
    case 'toggle dev':
      dispatch({ type: 'TOGGLE_DEVELOPER_MODE' });
      appendToLog(`Developer mode ${!state.isDeveloperMode ? 'ENABLED' : 'DISABLED'}`, 'success');
      playSuccess();
      break;
      
    case 'toggle matrix':
      dispatch({ type: 'TOGGLE_MATRIX_RAIN' });
      appendToLog(`Matrix effect ${!state.isMatrixRainActive ? 'ENABLED' : 'DISABLED'}`, 'success');
      playSuccess();
      break;
      
    case 'clear':
      return true; // Signal to clear the log
      
    case 'exit':
      dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD });
      playSuccess();
      break;
      
    case 'neo':
      dispatch({ type: 'TOGGLE_MATRIX_RAIN' });
      appendToLog('Wake up, Neo...', 'output');
      appendToLog('The Matrix has you...', 'output');
      appendToLog('Follow the white rabbit.', 'output');
      playSuccess();
      break;

    case 'assistant':
      playSuccess();
      dispatch({ type: 'SET_STATE', payload: AppState.VIRTUAL_ASSISTANT });
      appendToLog('Opening AI Virtual Assistant...', 'output');
      break;

    case 'hello':
    case 'hi':
    case 'hey':
      appendToLog(`Greetings, ${state.username}. How may I assist you today?`, 'success');
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
  
  return false; // Don't clear the log
};
