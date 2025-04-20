import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import { processSharedCommand } from '../utils/commandProcessor';
import MatrixRain from './MatrixRain';
import AssistantHeader from './virtual-assistant/AssistantHeader';
import ChatMessage from './virtual-assistant/ChatMessage';
import ChatInput from './virtual-assistant/ChatInput';

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, typingText]);

  useEffect(() => {
    if (conversation.length > 0 && !conversation[conversation.length - 1].isUser) {
      const fullText = conversation[conversation.length - 1].text;
      if (currentTypingIndex < fullText.length) {
        const timer = setTimeout(() => {
          setTypingText(fullText.substring(0, currentTypingIndex + 1));
          setCurrentTypingIndex(prev => prev + 1);
        }, 25);
        return () => clearTimeout(timer);
      }
    }
  }, [conversation, currentTypingIndex]);

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
    
    const wasSharedCommand = processSharedCommand({
      command: normalizedCommand,
      state,
      dispatch,
      onResponse: (text) => setConversation(prev => [...prev, { text, isUser: false }]),
      playSuccess,
      playTransition
    });
    
    if (wasSharedCommand) return;
    
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
      
      <AssistantHeader />
      
      <div className="flex-grow p-4 flex flex-col relative z-10">
        <div className="glass-panel p-4 flex-grow flex flex-col">
          <div className="mb-4 border-b border-hacker-neon/20 pb-2">
            <h2 className="text-hacker-neon font-mono text-lg">Neural Interface Terminal</h2>
            <p className="text-hacker-neon/60 font-mono text-xs">
              Advanced Query System <span className="animate-pulse">•</span> Real-time Response Protocol
            </p>
          </div>
          
          <div className="flex-grow overflow-y-auto mb-4 font-mono">
            {conversation.map((msg, index) => (
              <ChatMessage
                key={index}
                text={msg.text}
                isUser={msg.isUser}
                typingText={index === conversation.length - 1 ? typingText : undefined}
                isLatest={index === conversation.length - 1}
              />
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <ChatInput
            userInput={userInput}
            isProcessing={isProcessing}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      
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
