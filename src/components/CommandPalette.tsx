
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';

interface CommandOption {
  label: string;
  action: () => void;
  keywords: string[];
}

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { state, dispatch } = useAppContext();
  const { playKeypress, playSuccess } = useSound();
  
  // Command options list
  const commandOptions: CommandOption[] = [
    {
      label: 'Go to Dashboard',
      action: () => dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD }),
      keywords: ['home', 'main', 'dashboard', 'back'],
    },
    {
      label: 'Open Terminal',
      action: () => dispatch({ type: 'SET_STATE', payload: AppState.COMMAND_CONSOLE }),
      keywords: ['console', 'terminal', 'command', 'cmd', 'cli'],
    },
    {
      label: 'View Accounts',
      action: () => dispatch({ type: 'SET_STATE', payload: AppState.ACCOUNTS_TABLE }),
      keywords: ['accounts', 'money', 'finance', 'transactions', 'ledger'],
    },
    {
      label: 'Toggle Matrix Effect',
      action: () => dispatch({ type: 'TOGGLE_MATRIX_RAIN' }),
      keywords: ['matrix', 'rain', 'code', 'visual', 'background'],
    },
    {
      label: 'Toggle Sound',
      action: () => dispatch({ type: 'TOGGLE_SOUND' }),
      keywords: ['sound', 'audio', 'mute', 'volume', 'effects'],
    },
    {
      label: 'Log Out',
      action: () => {
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_STATE', payload: AppState.LOGIN });
      },
      keywords: ['logout', 'signout', 'exit', 'quit', 'leave'],
    },
  ];
  
  // Filter commands based on search term
  const filteredCommands = commandOptions.filter(option => {
    const searchLower = search.toLowerCase();
    return (
      option.label.toLowerCase().includes(searchLower) ||
      option.keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K to toggle command palette
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setSearch('');
        setSelectedIndex(0);
        playKeypress();
      }
      
      // Handle Escape key to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, playKeypress]);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Handle navigation within the command list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
        break;
    }
  };
  
  // Execute selected command
  const executeCommand = (command: CommandOption) => {
    playSuccess();
    command.action();
    setIsOpen(false);
    setSearch('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-md bg-black/90 border border-hacker-neon/50 shadow-lg rounded-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-2 border-b border-hacker-neon/30">
          <div className="flex items-center">
            <span className="text-hacker-neon/70 text-sm mr-2">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setSelectedIndex(0);
                playKeypress();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a command..."
              className="terminal-input flex-grow bg-transparent border-none focus:ring-0 font-mono"
              autoComplete="off"
            />
            <span className="text-hacker-neon/50 text-xs px-2 border border-hacker-neon/30 rounded ml-2">
              ESC
            </span>
          </div>
        </div>
        
        <div className="max-h-60 overflow-y-auto">
          {filteredCommands.length > 0 ? (
            <ul>
              {filteredCommands.map((command, index) => (
                <li
                  key={command.label}
                  className={`px-4 py-2 cursor-pointer ${
                    selectedIndex === index
                      ? 'bg-hacker-neon/10 border-l-2 border-hacker-neon'
                      : 'hover:bg-black/50'
                  }`}
                  onClick={() => executeCommand(command)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="text-white/90 font-mono">{command.label}</div>
                  <div className="text-white/50 text-xs font-mono">
                    {command.keywords.join(', ')}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-white/50 text-center p-4 font-mono">
              No matching commands found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
