
import React from 'react';
import { useAppContext, AppState } from '../../context/AppContext';
import { useSound } from '../../hooks/useSound';

const AssistantHeader: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { playTransition } = useSound();
  
  return (
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
  );
};

export default AssistantHeader;
