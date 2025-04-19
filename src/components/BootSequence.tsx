
import React, { useState, useEffect } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import { Progress } from "@/components/ui/progress";

const BootSequence: React.FC = () => {
  const [bootPhase, setBootPhase] = useState(1);
  const [progressValue, setProgressValue] = useState(0);
  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const { state, dispatch } = useAppContext();
  const { playKeypress, playTransition, playBoot } = useSound();

  // Boot messages for each phase
  const phaseMessages = {
    1: ['Initializing system...', 'Verifying hardware...', 'Loading kernel...'],
    2: ['Mounting file systems...', 'Checking disk integrity...', 'Starting services...'],
    3: ['Configuring network interfaces...', 'Establishing secure connection...', 'Synchronizing time...'],
    4: ['Starting user interface...', 'Launching virtual assistant...', 'System ready.'],
  };

  // Fixed shorter duration to prevent getting stuck (10-20 seconds)
  const totalDuration = Math.floor(Math.random() * (20000 - 10000) + 10000);
  const messagesPerPhase = 3; // Each phase has 3 messages
  const totalMessages = Object.values(phaseMessages).flat().length;
  const messageInterval = totalDuration / totalMessages;

  // Simulate boot progress with improved error handling
  useEffect(() => {
    console.log("Boot sequence started, duration will be", totalDuration, "ms");
    
    let currentPhase = 1;
    let currentMessage = 0;
    let totalMessagesShown = 0;
    let mountedRef = true;

    // Try to play boot sound
    try {
      playBoot();
    } catch (error) {
      console.log("Boot sound failed to play, continuing anyway");
    }

    // Add first message immediately
    setBootMessages([phaseMessages[1][0]]);
    totalMessagesShown++;
    
    // Use message-based intervals instead of progress-based
    const interval = setInterval(() => {
      if (!mountedRef) return;
      
      totalMessagesShown++;
      currentMessage++;
      
      // Check if we need to move to next phase
      if (currentMessage >= messagesPerPhase && currentPhase < 4) {
        currentPhase++;
        currentMessage = 0;
        setBootPhase(currentPhase);
      }
      
      // Add the next message if available
      if (phaseMessages[currentPhase] && phaseMessages[currentPhase][currentMessage]) {
        setBootMessages(prev => [...prev, phaseMessages[currentPhase][currentMessage]]);
        try {
          playKeypress();
        } catch (error) {
          console.log("Keypress sound failed, continuing");
        }
      }
      
      // Update progress based on total messages shown
      const progress = Math.min(100, Math.floor((totalMessagesShown / totalMessages) * 100));
      setProgressValue(progress);
      
      // If we've shown all messages, complete the boot sequence
      if (progress >= 100) {
        clearInterval(interval);
        finishBoot();
      }
    }, messageInterval);
    
    // Function to handle boot completion
    const finishBoot = () => {
      if (!mountedRef) return;
      
      console.log("Boot sequence completed, authentication starting...");
      
      // Set authenticated first
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
      console.log("Authentication set to true");
      
      // Wait a moment then redirect
      setTimeout(() => {
        if (!mountedRef) return;
        
        try {
          playTransition();
        } catch (error) {
          console.log("Transition sound failed, continuing");
        }
        
        console.log("Redirecting to VIRTUAL_ASSISTANT");
        dispatch({ type: 'SET_STATE', payload: AppState.VIRTUAL_ASSISTANT });
        
        // Verify the state change happened
        setTimeout(() => {
          console.log("Current state after transition:", state.currentState);
        }, 100);
      }, 2000);
    };
    
    // Cleanup - prevent state updates after unmounting
    return () => {
      mountedRef = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-hacker-dark text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="scanlines"></div>
      
      <div className="absolute top-0 left-0 w-full h-full bg-hacker-dark opacity-80 z-0"></div>
      
      <div className="control-panel w-full max-w-md mx-auto p-6 relative z-10">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-2 border-b border-hacker-neon/30">
          <div className="text-xs text-hacker-neon/80 font-mono">SYSTEM INITIALIZATION</div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-hacker-red"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-hacker-neon"></div>
          </div>
        </div>
        
        <div className="pt-6">
          <h1 className="text-xl font-mono text-center mb-8 neon-text">
            BOOT SEQUENCE
          </h1>
          
          <div className="space-y-4">
            {bootMessages.map((message, index) => (
              <div key={index} className="text-sm font-mono text-hacker-neon/80">
                {message}
              </div>
            ))}
            
            <div className="relative pt-1">
              <Progress 
                value={progressValue} 
                className="h-2 w-full bg-gray-900"
              />
              <div className="text-right text-xs text-hacker-neon/50 font-mono mt-1">
                {progressValue}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="port-display">
        localhost:{window.location.port || '80'}
      </div>
    </div>
  );
};

export default BootSequence;
