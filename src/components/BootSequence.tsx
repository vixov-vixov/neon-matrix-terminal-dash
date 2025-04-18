
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import { simulateCommandOutput } from '../utils/terminalEffects';
import EarthGlobe from './EarthGlobe';

const BootSequence: React.FC = () => {
  const logRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { state, dispatch } = useAppContext();
  const { playBoot, playKeypress, playSuccess } = useSound();
  const [showEarth, setShowEarth] = useState(false);

  useEffect(() => {
    // Play boot sound
    playBoot();
    
    // Start boot sequence
    const bootSystem = async () => {
      if (!logRef.current) return;
      
      // Initial boot messages
      const commands = [
        { text: 'SYSTEM INITIALIZING...', type: 'output' },
        { text: 'BIOS CHECK...OK', type: 'output' },
        { text: 'MEMORY DIAGNOSTICS...COMPLETE', type: 'output' },
        { text: 'INITIALIZING CORE SYSTEMS', type: 'output' },
        { text: 'LOADING KERNEL...', type: 'output' },
        { text: 'KERNEL LOADED SUCCESSFULLY', type: 'success' },
        { text: 'MOUNTING FILESYSTEMS...', type: 'output' },
        { text: 'NETWORK INTERFACES INITIALIZING...', type: 'output' },
        { text: 'ESTABLISHING SECURE TUNNEL...', type: 'output' },
        { text: 'SECURE CONNECTION ESTABLISHED', type: 'success' },
        { text: 'LOADING USER ENVIRONMENT...', type: 'output' },
        { text: 'AUTHENTICATING USER CREDENTIALS...', type: 'output' },
        { text: `USER ${state.username.toUpperCase()} AUTHENTICATED`, type: 'success' },
        { text: 'INITIALIZING NEURAL UPLINK...', type: 'output' },
        { text: 'BIOELECTRIC INTERFACE CONNECTED', type: 'success' },
        { text: 'INITIALIZING GLOBAL POSITIONING SYSTEM...', type: 'output' },
      ];
      
      await simulateCommandOutput(logRef.current, commands, 120);
      
      // Show Earth animation
      setShowEarth(true);
      setProgress(40);
      
      // Next phase of boot
      const secondPhase = [
        { text: 'GLOBAL POSITIONING SYSTEM ONLINE', type: 'success' },
        { text: 'CONNECTING TO SATELLITE NETWORK...', type: 'output' },
        { text: 'SATELLITE UPLINK ESTABLISHED', type: 'success' },
        { text: 'DOWNLOADING UPDATES...', type: 'output' },
        { text: 'UPDATES INSTALLED SUCCESSFULLY', type: 'success' },
        { text: 'INITIALIZING AI SUBSYSTEMS...', type: 'output' },
        { text: 'QUANTUM PROCESSING UNIT ACTIVATED', type: 'success' },
        { text: 'LOADING REAL-TIME DATA ANALYTICS ENGINE...', type: 'output' },
        { text: 'ACTIVATING GLOBAL MONITORING PROTOCOLS...', type: 'output' },
        { text: 'ALL SYSTEMS NOMINAL', type: 'success' },
        { text: 'LAUNCHING USER INTERFACE...', type: 'output' },
      ];
      
      await simulateCommandOutput(logRef.current, secondPhase, 150);
      
      // Set progress to almost complete
      setProgress(80);
      
      // Final boot messages
      const finalPhase = [
        { text: 'RENDERING DASHBOARD ELEMENTS...', type: 'output' },
        { text: 'INITIALIZING COMMAND INTERFACES...', type: 'output' },
        { text: 'SYSTEM STARTUP COMPLETE', type: 'success' },
        { text: '>> ACCESS GRANTED <<', type: 'success' },
      ];
      
      await simulateCommandOutput(logRef.current, finalPhase, 200);
      
      // Complete progress
      setProgress(100);
      
      // Play success sound
      playSuccess();
      
      // Transition to dashboard after a delay
      setTimeout(() => {
        dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD });
      }, 1500);
    };
    
    bootSystem();
    
    // Keyboard sound effects for immersion
    const interval = setInterval(() => {
      if (progress < 100) {
        playKeypress();
      }
    }, 500);
    
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, playBoot, playKeypress, playSuccess, state.username]);

  return (
    <div className="min-h-screen bg-hacker-dark flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="scanlines"></div>
      
      <div className="fixed top-0 left-0 w-full h-2 bg-hacker-dark">
        <div 
          className="h-full bg-hacker-neon transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="w-full max-w-3xl relative z-10">
        <div className="glass-panel p-4 mb-4 flex justify-between items-center">
          <div className="text-hacker-neon/80 font-mono text-sm">
            SYSTEM BOOT SEQUENCE
          </div>
          <div className="text-hacker-neon/80 font-mono text-sm">
            {progress}% COMPLETE
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div 
              ref={logRef} 
              className="command-log h-[60vh] text-xs md:text-sm overflow-y-auto no-scrollbar"
            ></div>
          </div>
          
          <div className="flex flex-col justify-center items-center">
            {showEarth ? (
              <div className="animate-fade-in">
                <EarthGlobe />
                <div className="mt-4 text-center">
                  <div className="text-hacker-neon/80 font-mono text-xs animate-pulse">
                    GLOBAL NETWORK ACTIVE
                  </div>
                  <div className="text-white/50 font-mono text-xs mt-1">
                    SECURE UPLINK ESTABLISHED
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin h-16 w-16 border-t-2 border-b-2 border-hacker-neon rounded-full"></div>
              </div>
            )}
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
