
import React, { useRef, useEffect } from 'react';
import { getTimestamp } from '../../utils/terminalEffects';

interface ConsoleLogProps {
  logRef: React.RefObject<HTMLDivElement>;
}

const ConsoleLog: React.FC<ConsoleLogProps> = ({ logRef }) => {
  return (
    <div className="flex-grow glass-panel p-2 relative mb-2 overflow-hidden">
      <div 
        ref={logRef} 
        className="command-log h-[calc(100vh-180px)] overflow-y-auto pb-4 no-scrollbar"
      ></div>
    </div>
  );
};

export default ConsoleLog;
