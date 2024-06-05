// SuggestionChat.tsx
import React from 'react';
import './SuggestionChat.scss';

interface SuggestionChatProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionChat: React.FC<SuggestionChatProps> = ({ suggestions, onSuggestionClick }) => {
  return (
    <div className="suggestion-chat-container">
      {suggestions.map((suggestion, index) => (
        <div 
          key={index} 
          className="suggestion-chat-item" 
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
};

export default SuggestionChat;
