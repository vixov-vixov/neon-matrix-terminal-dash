
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import MatrixRain from './MatrixRain';

const VirtualAssistant: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hello. I am JARVIS, your neural interface assistant. How may I help you today?", isUser: false }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useAppContext();
  const { playKeypress, playTransition, playSuccess } = useSound();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, typingText]);

  // Typing animation effect
  useEffect(() => {
    if (conversation.length > 0 && !conversation[conversation.length - 1].isUser) {
      const fullText = conversation[conversation.length - 1].text;
      if (currentTypingIndex < fullText.length) {
        const timer = setTimeout(() => {
          setTypingText(fullText.substring(0, currentTypingIndex + 1));
          setCurrentTypingIndex(prev => prev + 1);
        }, 25); // Speed of typing

        return () => clearTimeout(timer);
      }
    }
  }, [conversation, currentTypingIndex]);

  // Reset typing animation when new message is added
  useEffect(() => {
    if (conversation.length > 0 && !conversation[conversation.length - 1].isUser) {
      setTypingText('');
      setCurrentTypingIndex(0);
    }
  }, [conversation.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    playKeypress();
  };

  const processCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Check for account-related commands
    if (
      normalizedCommand.includes('account') || 
      normalizedCommand.includes('transaction') ||
      normalizedCommand.includes('ledger') ||
      normalizedCommand.includes('open accounts')
    ) {
      setConversation(prev => [...prev, { text: "Opening accounts module. Transferring control...", isUser: false }]);
      
      setTimeout(() => {
        playTransition();
        dispatch({ type: 'SET_STATE', payload: AppState.ACCOUNTS_TABLE });
      }, 1500);
      return;
    }
    
    // Check for dashboard commands
    if (
      normalizedCommand.includes('dashboard') || 
      normalizedCommand.includes('main screen') ||
      normalizedCommand.includes('home')
    ) {
      setConversation(prev => [...prev, { text: "Accessing main dashboard. Initializing...", isUser: false }]);
      
      setTimeout(() => {
        playTransition();
        dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD });
      }, 1500);
      return;
    }
    
    // Check for terminal/console commands
    if (
      normalizedCommand.includes('terminal') || 
      normalizedCommand.includes('console') ||
      normalizedCommand.includes('command line')
    ) {
      setConversation(prev => [...prev, { text: "Activating command console interface. Standby...", isUser: false }]);
      
      setTimeout(() => {
        playTransition();
        dispatch({ type: 'SET_STATE', payload: AppState.COMMAND_CONSOLE });
      }, 1500);
      return;
    }
    
    // Matrix Easter Egg
    if (
      normalizedCommand.includes('matrix') || 
      normalizedCommand.includes('neo')
    ) {
      dispatch({ type: 'TOGGLE_MATRIX_RAIN' });
      setConversation(prev => [...prev, { text: "Digital rain protocol toggled. 'There is no spoon.'", isUser: false }]);
      return;
    }
    
    // Sound toggle command
    if (
      normalizedCommand.includes('mute') || 
      normalizedCommand.includes('sound off') ||
      normalizedCommand.includes('toggle sound')
    ) {
      dispatch({ type: 'TOGGLE_SOUND' });
      setConversation(prev => [...prev, { 
        text: state.soundEnabled ? 
          "Sound disabled. Entering silent mode." : 
          "Sound enabled. Audio feedback restored.", 
        isUser: false 
      }]);
      return;
    }
    
    // Help command
    if (
      normalizedCommand.includes('help') || 
      normalizedCommand.includes('what can you do') ||
      normalizedCommand.includes('commands')
    ) {
      setConversation(prev => [...prev, { 
        text: "Available commands:\n• 'Open accounts' - Access the accounts ledger\n• 'Dashboard' - Return to main dashboard\n• 'Terminal' - Open command console\n• 'Toggle sound' - Enable/disable audio\n• 'Matrix' - Toggle digital rain effect\n• 'Logout' - End current session", 
        isUser: false 
      }]);
      return;
    }
    
    // Logout command
    if (
      normalizedCommand.includes('logout') || 
      normalizedCommand.includes('sign out') ||
      normalizedCommand.includes('exit')
    ) {
      setConversation(prev => [...prev, { text: "Initiating logout sequence. Goodbye.", isUser: false }]);
      
      setTimeout(() => {
        playTransition();
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_STATE', payload: AppState.LOGIN });
      }, 1500);
      return;
    }
    
    // Default response for unrecognized commands
    const responses = [
      "I'm sorry, I don't understand that command. Try 'help' for a list of available commands.",
      "Command not recognized. Would you like to access 'accounts', 'dashboard', or 'terminal'?",
      "I'm not programmed to respond to that input. Please try something else or type 'help'.",
      "That query falls outside my operational parameters. Perhaps you'd like to check the 'accounts' module?",
      "I didn't quite catch that. Try asking me to open a specific module or type 'help'."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    setConversation(prev => [...prev, { text: randomResponse, isUser: false }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    const userMessage = userInput.trim();
    setConversation(prev => [...prev, { text: userMessage, isUser: true }]);
    setUserInput('');
    setIsProcessing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      processCommand(userMessage);
      setIsProcessing(false);
      playSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-hacker-dark text-white overflow-hidden flex flex-col relative">
      {state.isMatrixRainActive && <MatrixRain />}
      <div className="scanlines"></div>
      
      {/* Header bar */}
      <header className="glass-panel border-b-0 p-3 flex justify-between items-center">
        <div className="text-hacker-neon font-mono text-lg tracking-wide">
          JARVIS <span className="text-xs opacity-70">v3.8.2</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-hacker-neon/70 font-mono text-sm">
            USER: <span className="text-hacker-neon">{state.username.toUpperCase()}</span>
          </div>
          <button 
            onClick={() => {
              dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD });
              playTransition();
            }}
            className="hacker-button py-1 px-3 text-sm"
          >
            DASHBOARD
          </button>
        </div>
      </header>
      
      {/* Main chat interface */}
      <div className="flex-grow p-4 flex flex-col relative z-10">
        <div className="glass-panel p-4 flex-grow flex flex-col">
          <div className="mb-4 border-b border-hacker-neon/20 pb-2">
            <h2 className="text-hacker-neon font-mono text-lg">Neural Interface Terminal</h2>
            <p className="text-hacker-neon/60 font-mono text-xs">
              Advanced Query System <span className="animate-pulse">•</span> Real-time Response Protocol
            </p>
          </div>
          
          {/* Conversation display */}
          <div className="flex-grow overflow-y-auto mb-4 font-mono">
            {conversation.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-3 ${msg.isUser ? 'text-right' : ''}`}
              >
                <div 
                  className={`inline-block rounded px-3 py-2 max-w-[80%] ${
                    msg.isUser 
                      ? 'bg-hacker-dark border border-hacker-neon/40 text-hacker-neon' 
                      : 'bg-hacker-neon/10 text-white'
                  }`}
                >
                  {index === conversation.length - 1 && !msg.isUser ? typingText : msg.text}
                  {index === conversation.length - 1 && !msg.isUser && typingText.length < msg.text.length && (
                    <span className="inline-block w-2 h-4 bg-hacker-neon ml-1 animate-pulse"></span>
                  )}
                </div>
                <div className={`text-xs mt-1 ${msg.isUser ? 'text-hacker-neon/50' : 'text-white/50'}`}>
                  {msg.isUser ? 'YOU' : 'JARVIS'} • {new Date().toLocaleTimeString()}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          {/* Input form */}
          <form onSubmit={handleSubmit} className="mt-auto">
            <div className="relative">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                disabled={isProcessing}
                placeholder="Enter command or speak naturally..."
                className="terminal-input w-full px-4 py-3 pr-20"
                autoFocus
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 hacker-button py-1 px-2 text-sm ${
                  isProcessing || !userInput.trim() ? 'opacity-50' : ''
                }`}
              >
                {isProcessing ? 'PROCESSING...' : 'SEND'}
              </button>
            </div>
            <div className="mt-2 text-center text-hacker-neon/40 text-xs font-mono">
              TRY: "open accounts", "help", "toggle matrix", or "logout"
            </div>
          </form>
        </div>
      </div>
      
      {/* Status indicators */}
      <div className="flex justify-between items-center p-2 text-xs font-mono text-hacker-neon/40">
        <div>NEURAL LINK: ACTIVE</div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'} mr-2`}></div>
          <div>{isProcessing ? 'PROCESSING' : 'READY'}</div>
        </div>
      </div>
      
      <div className="port-display">
        localhost:{window.location.port || '80'}
      </div>
    </div>
  );
};

export default VirtualAssistant;
