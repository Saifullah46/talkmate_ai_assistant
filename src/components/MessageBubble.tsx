import React from 'react';
import { Volume2, User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onWordClick: (word: string) => void;
  onSpeak: (text: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onWordClick, onSpeak }) => {
  const handleTextClick = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 2) {
      onWordClick(selectedText);
    } else {
      // If no selection, try to get word from click position
      const target = e.target as HTMLElement;
      const text = target.textContent || '';
      const words = text.split(/\s+/);
      const clickedWord = words.find(word => word.length > 3);
      if (clickedWord) {
        onWordClick(clickedWord.replace(/[.,!?;:]/, ''));
      }
    }
  };

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`flex items-end space-x-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.sender === 'user' 
            ? 'bg-blue-500' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500'
        }`}>
          {message.sender === 'user' ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-3 py-2 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md ${
            message.sender === 'user'
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
          }`}
          onClick={handleTextClick}
        >
          <p className="text-sm leading-relaxed select-text break-words">
            {message.text}
          </p>
          
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs ${
              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            
            {message.sender === 'other' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(message.text);
                }}
                className="opacity-60 hover:opacity-100 transition-opacity ml-1 p-0.5 rounded-full hover:bg-gray-100"
              >
                <Volume2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;