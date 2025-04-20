
import React, { useState, useEffect } from 'react';
import { useAppContext, AppState } from '../context/AppContext';
import { useSound } from '../hooks/useSound';
import MatrixRain from './MatrixRain';
import EarthGlobe from './EarthGlobe';
import PasswordInput from './PasswordInput';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { playTransition, playSuccess } = useSound();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    networkStatus: 'ONLINE',
    securityLevel: 'MAXIMUM',
    activeNodes: Math.floor(Math.random() * 500) + 500,
  });
  
  // Update random stats for animation effect
  useEffect(() => {
    if (loading) {
      // Initial load
      setTimeout(() => setLoading(false), 1000);
    }
    
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
        memoryUsage: Math.floor(Math.random() * 30) + 40, // 40-70%
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 21) - 10, // +/- 10 nodes
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [loading]);
  
  // Handle command console access
  const handlePasswordSuccess = () => {
    playTransition();
    setTimeout(() => {
      dispatch({ type: 'SET_STATE', payload: AppState.COMMAND_CONSOLE });
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-hacker-dark flex items-center justify-center">
        <div className="text-hacker-neon font-mono animate-pulse">
          LOADING INTERFACE...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hacker-dark overflow-hidden relative">
      {state.isMatrixRainActive && <MatrixRain />}
      <div className="scanlines"></div>
      
      {/* Top header bar */}
      <header className="glass-panel border-b-0 p-2 flex justify-between items-center">
        <div className="text-hacker-neon font-mono">
          GLOBAL COMMAND CENTER
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              playSuccess();
              dispatch({ type: 'SET_STATE', payload: AppState.VIRTUAL_ASSISTANT });
            }}
            className="hacker-button py-1 px-3 text-sm"
          >
            AI ASSISTANT
          </button>
          <div className="text-hacker-neon/70 font-mono text-sm">
            USER: <span className="text-hacker-neon">{state.username.toUpperCase()}</span>
          </div>
          <button 
            onClick={() => {
              playSuccess();
              dispatch({ type: 'SET_AUTHENTICATED', payload: false });
              dispatch({ type: 'SET_STATE', payload: AppState.LOGIN });
            }}
            className="hacker-button py-1 px-3 text-sm"
          >
            LOGOUT
          </button>
        </div>
      </header>
      
      <main className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Left sidebar */}
        <aside className="md:col-span-1 space-y-4">
          <div className="glass-panel p-4">
            <h2 className="text-hacker-neon font-mono text-lg mb-4">System Status</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-hacker-neon/70 font-mono text-xs">CPU USAGE</label>
                <div className="w-full bg-gray-900 rounded-full h-2.5 mb-1 overflow-hidden">
                  <div 
                    className="bg-hacker-neon h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${stats.cpuUsage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-hacker-neon/50 font-mono">
                  <span>{stats.cpuUsage}%</span>
                  <span>NORMAL</span>
                </div>
              </div>
              
              <div>
                <label className="text-hacker-neon/70 font-mono text-xs">MEMORY ALLOCATION</label>
                <div className="w-full bg-gray-900 rounded-full h-2.5 mb-1 overflow-hidden">
                  <div 
                    className="bg-hacker-cyan h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${stats.memoryUsage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-hacker-neon/50 font-mono">
                  <span>{stats.memoryUsage}%</span>
                  <span>OPTIMAL</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="glass-panel p-2 text-center">
                  <div className="text-hacker-neon/70 font-mono text-xs">NETWORK</div>
                  <div className="text-hacker-neon font-mono text-sm animate-pulse">
                    {stats.networkStatus}
                  </div>
                </div>
                
                <div className="glass-panel p-2 text-center">
                  <div className="text-hacker-neon/70 font-mono text-xs">SECURITY</div>
                  <div className="text-hacker-neon font-mono text-sm">
                    {stats.securityLevel}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-4">
            <h2 className="text-hacker-neon font-mono text-lg mb-4">Quick Access</h2>
            
            <div className="space-y-2">
              <button 
                onClick={() => {
                  playSuccess();
                  dispatch({ type: 'SET_STATE', payload: AppState.ACCOUNTS_TABLE });
                }}
                className="hacker-button w-full flex justify-between items-center"
              >
                <span>Accounts Module</span>
                <span className="text-xs opacity-70">&rarr;</span>
              </button>
              
              <button
                onClick={() => dispatch({ type: 'TOGGLE_MATRIX_RAIN' })}
                className="hacker-button w-full flex justify-between items-center"
              >
                <span>Toggle Matrix Effect</span>
                <span className="text-xs opacity-70">&rarr;</span>
              </button>
              
              <div className="pt-2 text-center text-hacker-neon/50 font-mono text-xs">
                Press Ctrl+K to access command palette
              </div>
            </div>
          </div>
        </aside>
        
        {/* Middle section */}
        <div className="md:col-span-2 space-y-4">
          <div className="glass-panel p-4 flex flex-col items-center">
            <h2 className="text-hacker-neon font-mono text-lg mb-4">Global Operations Center</h2>
            
            <div className="my-2">
              <EarthGlobe />
            </div>
            
            <div className="mt-2 text-center">
              <div className="text-hacker-neon/70 font-mono text-sm">
                Active Nodes: <span className="text-hacker-neon">{stats.activeNodes}</span>
              </div>
              <div className="text-hacker-neon/50 font-mono text-xs mt-1">
                Global network integrity at optimal levels
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-4">
            <h2 className="text-hacker-neon font-mono text-lg mb-4">Command Console Access</h2>
            <PasswordInput onPasswordCorrect={handlePasswordSuccess} />
          </div>
          
          {state.isDeveloperMode && (
            <div className="glass-panel p-4 border-hacker-red/50 animate-fade-in">
              <h2 className="text-hacker-red font-mono text-lg mb-2">DEVELOPER MODE ACTIVE</h2>
              <div className="text-white/70 font-mono text-xs">
                <div className="mb-1">App Version: 1.0.0-dev</div>
                <div className="mb-1">Build: {new Date().toISOString()}</div>
                <div>Debug Tools: ENABLED</div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <div className="port-display">
        localhost:{window.location.port || '80'}
      </div>
    </div>
  );
};

export default Dashboard;
