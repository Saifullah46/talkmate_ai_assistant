import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { ToneType, SmartReply } from '../types';
import { aiService } from '../services/aiService';

interface SmartRepliesProps {
  lastMessage: string;
  selectedTone: ToneType;
  onReplySelect: (reply: string) => void;
  conversationHistory: string[];
}

const SmartReplies: React.FC<SmartRepliesProps> = ({
  lastMessage,
  selectedTone,
  onReplySelect,
  conversationHistory
}) => {
  const [replies, setReplies] = useState<SmartReply[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReplies = async () => {
    if (!lastMessage.trim()) return;
    
    setLoading(true);
    try {
      const smartReplies = await aiService.generateSmartReplies(
        lastMessage,
        selectedTone,
        conversationHistory
      );
      setReplies(smartReplies);
    } catch (error) {
      console.error('Failed to generate replies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReplies();
  }, [lastMessage, selectedTone]);

  if (!lastMessage || replies.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Lightbulb className="h-4 w-4" />
          <span>Smart Replies</span>
        </div>
        <button
          onClick={generateReplies}
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-1 max-h-32 overflow-y-auto">
        {loading ? (
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          replies.map((reply, index) => (
            <button
              key={index}
              onClick={() => onReplySelect(reply.text)}
              className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="flex-1 truncate pr-2">{reply.text}</span>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-xs text-gray-500">
                    {Math.round(reply.confidence * 100)}%
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SmartReplies;