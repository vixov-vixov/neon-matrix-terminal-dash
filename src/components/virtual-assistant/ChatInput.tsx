
import React from 'react';

interface ChatInputProps {
  userInput: string;
  isProcessing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  userInput,
  isProcessing,
  onInputChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-auto">
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={onInputChange}
          disabled={isProcessing}
          placeholder="Enter command or speak naturally..."
          className="terminal-input w-full px-4 py-3 pr-20"
          autoFocus
        />
        <button
          type="submit"
          disabled={isProcessing || !userInput.trim()}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 hacker-button py-1 px-2 text-sm ${
            isProcessing || !userInput.trim() ? 'opacity-50' : ''
          }`}
        >
          {isProcessing ? 'PROCESSING...' : 'SEND'}
        </button>
      </div>
      <div className="mt-2 text-center text-hacker-neon/40 text-xs font-mono">
        TRY: "open accounts", "help", "toggle matrix", or "logout"
      </div>
    </form>
  );
};

export default ChatInput;
