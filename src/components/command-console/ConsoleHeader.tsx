
import React from 'react';
import { useAppContext, AppState } from '../../context/AppContext';

const ConsoleHeader: React.FC = () => {
  const { dispatch } = useAppContext();
  
  return (
    <div className="flex items-center justify-between mb-2">
      <h1 className="text-hacker-neon font-mono text-lg">Command Console</h1>
      <button 
        onClick={() => dispatch({ type: 'SET_STATE', payload: AppState.DASHBOARD })}
        className="hacker-button py-1 px-3 text-sm"
      >
        Dashboard
      </button>
    </div>
  );
};

export default ConsoleHeader;
