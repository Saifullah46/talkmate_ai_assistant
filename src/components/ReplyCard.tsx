import React, { useState } from 'react';
import { Copy, Check, Volume2, Languages, Heart } from 'lucide-react';
import { SmartReply } from '../types';

interface ReplyCardProps {
  reply: SmartReply;
  onCopy: (text: string) => void;
  onSpeak: (text: string) => void;
  showTranslation?: boolean;
}

const ReplyCard: React.FC<ReplyCardProps> = ({ 
  reply, 
  onCopy, 
  onSpeak, 
  showTranslation = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getToneColor = (tone: string) => {
    const colors = {
      funny: 'border-yellow-200 bg-yellow-50',
      romantic: 'border-pink-200 bg-pink-50',
      formal: 'border-blue-200 bg-blue-50',
      friendly: 'border-green-200 bg-green-50',
      professional: 'border-gray-200 bg-gray-50',
      casual: 'border-purple-200 bg-purple-50'
    };
    return colors[tone as keyof typeof colors] || 'border-gray-200 bg-gray-50';
  };

  const getToneEmoji = (tone: string) => {
    const emojis = {
      funny: '😄',
      romantic: '💕',
      formal: '🤝',
      friendly: '😊',
      professional: '💼',
      casual: '👋'
    };
    return emojis[tone as keyof typeof emojis] || '💬';
  };

  const displayText = showTranslation && reply.translatedText && !showOriginal 
    ? reply.translatedText 
    : reply.text;

  return (
    <div className={`p-4 rounded-2xl border-2 ${getToneColor(reply.tone)} transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getToneEmoji(reply.tone)}</span>
          <span className="text-sm font-medium text-gray-700 capitalize">
            {reply.tone}
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-gray-500">
              {Math.round(reply.confidence * 100)}%
            </span>
          </div>
        </div>

        {showTranslation && reply.translatedText && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="p-1 hover:bg-white/50 rounded-full transition-colors"
            title={showOriginal ? 'Show translation' : 'Show original'}
          >
            <Languages className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Message Text */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed break-words">
          {displayText}
        </p>
        
        {showTranslation && reply.translatedText && showOriginal && (
          <p className="text-sm text-gray-600 mt-2 italic border-t pt-2">
            Translation: {reply.translatedText}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => handleCopy(displayText)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-100 text-green-700' 
                : 'bg-white/70 text-gray-700 hover:bg-white'
            }`}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={() => onSpeak(displayText)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/70 text-gray-700 rounded-lg text-sm font-medium hover:bg-white transition-colors"
          >
            <Volume2 className="h-3 w-3" />
            <span>Listen</span>
          </button>
        </div>

        {reply.tone === 'romantic' && (
          <Heart className="h-4 w-4 text-pink-500" />
        )}
      </div>
    </div>
  );
};

export default ReplyCard;