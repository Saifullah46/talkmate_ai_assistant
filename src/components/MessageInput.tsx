import React, { useState } from 'react';
import { Copy, Send, Wand2, Volume2, Languages } from 'lucide-react';
import { ToneType } from '../types';

interface MessageInputProps {
  onMessageSubmit: (message: string) => void;
  onImproveMessage: (message: string, tone: ToneType) => void;
  onSpeak: (text: string) => void;
  isProcessing: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onMessageSubmit,
  onImproveMessage,
  onSpeak,
  isProcessing,
  placeholder = "Paste the message you received..."
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>('friendly');

  const tones = [
    { id: 'friendly' as ToneType, label: 'Friendly', emoji: '😊', color: 'bg-green-100 text-green-700' },
    { id: 'funny' as ToneType, label: 'Funny', emoji: '😄', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'romantic' as ToneType, label: 'Romantic', emoji: '💕', color: 'bg-pink-100 text-pink-700' },
    { id: 'formal' as ToneType, label: 'Formal', emoji: '🤝', color: 'bg-blue-100 text-blue-700' },
    { id: 'professional' as ToneType, label: 'Professional', emoji: '💼', color: 'bg-gray-100 text-gray-700' },
    { id: 'casual' as ToneType, label: 'Casual', emoji: '👋', color: 'bg-purple-100 text-purple-700' }
  ];

  const handleSubmit = () => {
    if (inputMessage.trim()) {
      onMessageSubmit(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleImprove = () => {
    if (inputMessage.trim()) {
      onImproveMessage(inputMessage.trim(), selectedTone);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputMessage(text);
    } catch (error) {
      console.error('Failed to paste:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tone Selection */}
      <div className="grid grid-cols-3 gap-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => setSelectedTone(tone.id)}
            className={`p-2 rounded-xl text-xs font-medium transition-all ${
              selectedTone === tone.id
                ? tone.color + ' scale-105 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="text-sm mb-1">{tone.emoji}</div>
            <div>{tone.label}</div>
          </button>
        ))}
      </div>

      {/* Message Input */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          
          <div className="absolute top-3 right-3 flex space-x-1">
            <button
              onClick={handlePaste}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Paste from clipboard"
            >
              <Copy className="h-4 w-4 text-gray-400" />
            </button>
            
            <button
              onClick={() => onSpeak(inputMessage)}
              disabled={!inputMessage.trim()}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              title="Listen to message"
            >
              <Volume2 className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleSubmit}
            disabled={!inputMessage.trim() || isProcessing}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>{isProcessing ? 'Processing...' : 'Get Help'}</span>
          </button>
          
          <button
            onClick={handleImprove}
            disabled={!inputMessage.trim() || isProcessing}
            className="flex-1 bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Wand2 className="h-4 w-4" />
            <span>Improve</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;