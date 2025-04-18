import React, { useState, useEffect } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';

const BootSequence: React.FC = () => {
  const [bootPhase, setBootPhase] = useState(1);
  const [progressValue, setProgressValue] = useState(0);
  const [bootMessages, setBootMessages] = useState<string[]>([]);
  const { dispatch } = useAppContext();
  const { playBlip, playBoot } = useSound();

  // Boot messages for each phase
  const phaseMessages = {
    1: ['Initializing system...', 'Verifying hardware...', 'Loading kernel...'],
    2: ['Mounting file systems...', 'Checking disk integrity...', 'Starting services...'],
    3: ['Configuring network interfaces...', 'Establishing secure connection...', 'Synchronizing time...'],
    4: ['Starting user interface...', 'Launching virtual assistant...', 'System ready.'],
  };

  // Simulate boot progress
  useEffect(() => {
    let messageIndex = 0;
    let progress = 0;
    let phase = 1;

    const interval = setInterval(() => {
      // Add new boot message
      if (phaseMessages[phase] && messageIndex < phaseMessages[phase].length) {
        setBootMessages(prev => [...prev, phaseMessages[phase][messageIndex]]);
        playBlip();
        messageIndex++;
      }

      // Update progress value
      if (progress < 100) {
        progress += 20;
        setProgressValue(progress);
      } else {
        // Move to the next boot phase
        messageIndex = 0;
        progress = 0;
        phase++;
        setBootPhase(phase);
        setProgressValue(progress);

        // Play boot sound at the start of the sequence
        if (phase === 2) {
          playBoot();
        }
      }

      // Stop interval when all phases are complete
      if (phase > 4) {
        clearInterval(interval);
      }
    }, 750);

    return () => clearInterval(interval);
  }, [playBlip, playBoot]);

  // Complete boot sequence
  useEffect(() => {
    // If all boot phases are complete
    if (bootPhase === 4 && progressValue >= 100) {
      const timer = setTimeout(() => {
        playTransition();
        dispatch({ type: 'SET_STATE', payload: AppState.VIRTUAL_ASSISTANT });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [bootPhase, progressValue, dispatch, playTransition]);

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
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-900">
                <div
                  style={{ width: `${progressValue}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-hacker-neon transition-all duration-500"
                ></div>
              </div>
              <div className="text-right text-xs text-hacker-neon/50 font-mono">
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
