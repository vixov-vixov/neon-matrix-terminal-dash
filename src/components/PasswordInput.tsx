
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useSound } from '../hooks/useSound';
import { useAppContext, AppState } from '../context/AppContext';

interface PasswordInputProps {
  onPasswordCorrect: () => void;
  correctPassword?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ 
  onPasswordCorrect,
  correctPassword = "Pass#2020Admin$$"
}) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { playKeypress, playSuccess, playDenied } = useSound();
  const { dispatch } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle password input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    playKeypress();
    
    // Clear previous messages
    if (message) {
      setMessage('');
    }
  };
  
  // Handle key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validatePassword();
    }
  };
  
  // Validate password
  const validatePassword = async () => {
    setIsProcessing(true);
    
    // Simulate authentication processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (password === correctPassword) {
      setMessage('Access Granted');
      playSuccess();
      
      setTimeout(() => {
        onPasswordCorrect();
      }, 1000);
    } else if (password.toLowerCase() === 'neo') {
      // Easter egg - activate Matrix rain
      dispatch({ type: 'TOGGLE_MATRIX_RAIN' });
      setMessage('Follow the white rabbit...');
      setPassword('');
      playKeypress();
      setIsProcessing(false);
    } else {
      setMessage('Access Denied');
      playDenied();
      
      // Log playful terminal-style message
      dispatch({ 
        type: 'ADD_COMMAND', 
        payload: `Authentication failed: Invalid credentials for ${password.length > 0 ? '********' : 'empty password'}`
      });
      
      setPassword('');
      setTimeout(() => {
        setIsProcessing(false);
        setMessage('');
      }, 2000);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="control-panel p-6 relative">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-2 border-b border-hacker-neon/30">
          <div className="text-xs text-hacker-neon/80 font-mono">SECURE AUTHENTICATION</div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-hacker-red"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-hacker-neon"></div>
          </div>
        </div>
        
        <div className="pt-4 pb-4">
          <div className="text-center mb-6 mt-2">
            <h3 className="text-hacker-neon text-lg font-mono animate-pulse">Terminal Access</h3>
            <p className="text-white/60 text-xs mt-1">Enter authorization code</p>
          </div>
          
          <div className="relative mt-6">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              disabled={isProcessing}
              className="terminal-input pb-2 pt-1 px-2 w-full text-center tracking-widest"
              placeholder="********"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 bottom-2 text-hacker-neon/50 hover:text-hacker-neon"
            >
              {showPassword ? '●' : '○'}
            </button>
          </div>
          
          <div className="flex justify-center mt-6">
            <button
              onClick={validatePassword}
              disabled={isProcessing}
              className={`hacker-button ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <span className="inline-flex items-center">
                  <span className="animate-pulse">Processing</span>
                  <span className="ml-2 flex">
                    <span className="h-2 w-2 bg-hacker-neon rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="ml-1 h-2 w-2 bg-hacker-neon rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="ml-1 h-2 w-2 bg-hacker-neon rounded-full animate-bounce"></span>
                  </span>
                </span>
              ) : (
                'Authenticate'
              )}
            </button>
          </div>
          
          {message && (
            <div
              className={`mt-4 text-center font-mono ${
                message === 'Access Granted' ? 'text-green-400' : 'text-hacker-red'
              } animate-text-glitch`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordInput;
