
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import { getTimestamp } from '../utils/terminalEffects';
import { processCommand } from '../utils/commands';
import { appendLogMessage } from '../utils/logger';
import ConsoleHeader from './command-console/ConsoleHeader';
import ConsoleInput from './command-console/ConsoleInput';
import ConsoleLog from './command-console/ConsoleLog';

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

  const appendToLog = (message: string, type: 'input' | 'output' | 'error' | 'success' = 'output') => {
    if (!logRef.current) return;
    appendLogMessage(logRef.current, message, type, getTimestamp());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      
      dispatch({ type: 'ADD_COMMAND', payload: command });
      
      const shouldClear = processCommand(
        command,
        state,
        dispatch,
        appendToLog,
        playSuccess,
        playError,
        playKeypress
      );
      
      if (shouldClear && logRef.current) {
        logRef.current.innerHTML = '';
      }
      
      setCommand('');
    }
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
      <ConsoleHeader />
      <ConsoleLog logRef={logRef} />
      <ConsoleInput
        command={command}
        onChange={handleCommandChange}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        inputRef={inputRef}
      />
      <div className="port-display">
        localhost:{window.location.port || '80'}
      </div>
    </div>
  );
};

export default CommandConsole;
