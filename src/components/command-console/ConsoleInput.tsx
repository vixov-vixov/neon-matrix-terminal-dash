
import React from 'react';

interface ConsoleInputProps {
  command: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ConsoleInput: React.FC<ConsoleInputProps> = ({
  command,
  onChange,
  onKeyDown,
  onSubmit,
  inputRef
}) => {
  return (
    <form onSubmit={onSubmit} className="glass-panel p-2 flex">
      <span className="text-hacker-cyan font-mono self-center mr-2">$</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Enter command..."
        className="terminal-input flex-grow bg-transparent border-none focus:ring-0"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </form>
  );
};

export default ConsoleInput;
