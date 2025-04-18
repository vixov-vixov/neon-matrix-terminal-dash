
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import { typeText, glitchText } from '../utils/terminalEffects';
import MatrixRain from './MatrixRain';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [headerText, setHeaderText] = useState('Login');
  const headerRef = useRef<HTMLHeadingElement>(null);
  const { state, dispatch } = useAppContext();
  const { playKeypress, playTransition, playError, playSuccess } = useSound();

  // Add a glitch effect to the header text on mount
  useEffect(() => {
    if (headerRef.current) {
      glitchText(headerRef.current, 'SYSTEM ACCESS', 1500);
    }
    
    // Type in the header text
    const headerElement = headerRef.current;
    if (headerElement) {
      typeText('NEURAL UPLINK TERMINAL', headerElement, 50, 500);
    }
  }, []);

  // Handle input changes
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    playKeypress();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    playKeypress();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setErrorMessage('Username and password required');
      playError();
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check for specific credentials: username "VIXOV" and password "23wesdee"
    if (username === 'VIXOV' && password === '23wesdee') {
      playSuccess();
      dispatch({ type: 'SET_USERNAME', payload: username });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      
      // Transition to boot sequence with delay
      setTimeout(() => {
        playTransition();
        dispatch({ type: 'SET_STATE', payload: AppState.BOOT_SEQUENCE });
      }, 500);
    } else {
      playError();
      setErrorMessage('Invalid credentials');
      setLoginAttempts(prev => prev + 1);
      setIsLoading(false);
      
      // Reset password field
      setPassword('');
      
      // Show special message after multiple attempts
      if (loginAttempts >= 2) {
        setErrorMessage('ALERT: Security protocols activated [Hint: VIXOV/23wesdee]');
      }
    }
  };

  // Handle Easter egg - press alt+shift+M for matrix effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'M') {
        dispatch({ type: 'TOGGLE_MATRIX_RAIN' });
        playTransition();
      }
      
      // Ctrl+Alt+D for developer mode
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        dispatch({ type: 'TOGGLE_DEVELOPER_MODE' });
        playSuccess();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, playTransition, playSuccess]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {state.isMatrixRainActive && <MatrixRain />}
      
      <div className="scanlines"></div>
      
      <div className="control-panel w-full max-w-md mx-auto p-6 relative z-10">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-2 border-b border-hacker-neon/30">
          <div className="text-xs text-hacker-neon/80 font-mono">SECURE INTERFACE v3.8.2</div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-hacker-red"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-hacker-neon"></div>
          </div>
        </div>
        
        <div className="pt-6">
          <h1 
            ref={headerRef} 
            className="text-xl font-mono text-center mb-8 neon-text"
          >
            NEURAL UPLINK TERMINAL
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-hacker-neon/70 text-sm font-mono mb-1">
                IDENTIFIER
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className="terminal-input w-full px-3 py-2"
                autoComplete="off"
                autoFocus
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-hacker-neon/70 text-sm font-mono mb-1">
                ACCESS KEY
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="terminal-input w-full px-3 py-2"
                autoComplete="off"
              />
            </div>
            
            {errorMessage && (
              <div className="text-hacker-red text-sm font-mono animate-pulse">
                {errorMessage}
              </div>
            )}
            
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`hacker-button ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center">
                    <span className="animate-pulse">AUTHENTICATING</span>
                    <span className="ml-2 flex">
                      <span className="h-1 w-1 bg-hacker-neon rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="ml-1 h-1 w-1 bg-hacker-neon rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="ml-1 h-1 w-1 bg-hacker-neon rounded-full animate-bounce"></span>
                    </span>
                  </span>
                ) : (
                  'CONNECT'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-hacker-neon/40 text-xs font-mono">
              NETWORK STATUS: <span className="text-hacker-neon animate-pulse">ACTIVE</span>
            </p>
            <p className="text-hacker-neon/40 text-xs font-mono mt-1">
              SECURITY PROTOCOL: <span className="text-hacker-neon">RHIZOME-7</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="port-display">
        localhost:{window.location.port || '80'}
      </div>
    </div>
  );
};

export default Login;
