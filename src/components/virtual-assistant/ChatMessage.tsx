
import React from 'react';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  typingText?: string;
  isLatest?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  text, 
  isUser, 
  typingText, 
  isLatest = false 
}) => {
  return (
    <div className={`mb-3 ${isUser ? 'text-right' : ''}`}>
      <div 
        className={`inline-block rounded px-3 py-2 max-w-[80%] ${
          isUser 
            ? 'bg-hacker-dark border border-hacker-neon/40 text-hacker-neon' 
            : 'bg-hacker-neon/10 text-white'
        }`}
      >
        {isLatest && !isUser ? typingText : text}
        {isLatest && !isUser && typingText && typingText.length < text.length && (
          <span className="inline-block w-2 h-4 bg-hacker-neon ml-1 animate-pulse"></span>
        )}
      </div>
      <div className={`text-xs mt-1 ${isUser ? 'text-hacker-neon/50' : 'text-white/50'}`}>
        {isUser ? 'YOU' : 'JARVIS'} • {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ChatMessage;
