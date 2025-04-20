import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import { getTimestamp } from '../utils/terminalEffects';

const CommandConsole: React.FC = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { state, dispatch } = useAppContext();
  const { playKeypress, playSuccess, playError } = useSound();
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
    playKeypress();
  };

  const processCommand = (cmd: string) => {
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    
    dispatch({ type: 'ADD_COMMAND', payload: cmd });
    
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
        appendToLog(state.commandHistory.slice(-10).map(cmd => 
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
        if (logRef.current) {
          logRef.current.innerHTML = '';
        }
        playKeypress();
        break;
        
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      processCommand(command);
      setCommand('');
    }
  };

  const appendToLog = (message: string, type: 'input' | 'output' | 'error' | 'success' = 'output') => {
    if (!logRef.current) return;
    
    const logItem = document.createElement('div');
    logItem.className = 'mb-1';
    
    if (type === 'input') {
      logItem.innerHTML = `<span class="log-timestamp">${getTimestamp()}</span> ${message}`;
    } else if (type === 'error') {
      logItem.innerHTML = `<span class="log-timestamp">${getTimestamp()}</span> <span class="text-hacker-red">${message}</span>`;
    } else if (type === 'success') {
      logItem.innerHTML = `<span class="log-timestamp">${getTimestamp()}</span> <span class="text-green-400">${message}</span>`;
    } else {
      const lines = message.split('\n');
      logItem.innerHTML = lines.map(line => 
        `<span class="log-timestamp">${getTimestamp()}</span> ${line}`
      ).join('<br>');
    }
    
    logRef.current.appendChild(logItem);
    logRef.current.scrollTop = logRef.current.scrollHeight;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    } else if (e.key === 'Escape') {
      dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD });
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      if (logRef.current) {
        logRef.current.innerHTML = '';
      }
    }
  };

  useEffect(() => {
    if (logRef.current && logRef.current.childElementCount === 0) {
      appendToLog(`Welcome to the Command Terminal, ${state.username}.`, 'output');
      appendToLog('What do you want to access?', 'output');
      appendToLog('Type "help" for available commands.', 'output');
    }
  }, [state.username]);

  return (
    <div className="min-h-screen bg-hacker-dark flex flex-col p-4 overflow-hidden">
      <div className="scanlines"></div>
      
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-hacker-neon font-mono text-lg">Command Console</h1>
        <button 
          onClick={() => dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD })}
          className="hacker-button py-1 px-3 text-sm"
        >
          Dashboard
        </button>
      </div>
      
      <div className="flex-grow glass-panel p-2 relative mb-2 overflow-hidden">
        <div 
          ref={logRef} 
          className="command-log h-[calc(100vh-180px)] overflow-y-auto pb-4 no-scrollbar"
        ></div>
      </div>
      
      <form onSubmit={handleSubmit} className="glass-panel p-2 flex">
        <span className="text-hacker-cyan font-mono self-center mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={handleCommandChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="terminal-input flex-grow bg-transparent border-none focus:ring-0"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </form>
      
      <div className="port-display">
        localhost:{window.location.port || '80'}
      </div>
    </div>
  );
};

export default CommandConsole;
