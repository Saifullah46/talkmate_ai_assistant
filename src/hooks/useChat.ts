import { useState, useCallback, useEffect } from 'react';
import { Message, ChatStats, ToneType } from '../types';
import { aiService } from '../services/aiService';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! How's your day going? 😊",
      sender: 'other',
      timestamp: new Date(),
      language: 'en'
    }
  ]);

  const [chatStats, setChatStats] = useState<ChatStats>({
    wordsLearned: 0,
    tonesUsed: { funny: 0, romantic: 0, formal: 0, friendly: 0 },
    conversationsImproved: 0,
    messagesExchanged: 0
  });

  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((text: string, sender: 'user' | 'other', language: 'en' | 'hi' = 'en') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      language
    };

    setMessages(prev => [...prev, newMessage]);
    
    setChatStats(prev => ({
      ...prev,
      messagesExchanged: prev.messagesExchanged + 1
    }));

    return newMessage;
  }, []);

  const updateToneUsage = useCallback((tone: ToneType) => {
    setChatStats(prev => ({
      ...prev,
      tonesUsed: {
        ...prev.tonesUsed,
        [tone]: prev.tonesUsed[tone] + 1
      }
    }));
  }, []);

  const incrementWordsLearned = useCallback(() => {
    setChatStats(prev => ({
      ...prev,
      wordsLearned: prev.wordsLearned + 1
    }));
  }, []);

  const simulateTyping = useCallback(async (duration: number = 2000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setIsTyping(false);
  }, []);

  const simulateOtherPersonReply = useCallback(async (userMessage: string) => {
    await simulateTyping(1500);
    
    const replies = [
      "That's interesting! Tell me more about it 🤔",
      "Wow, sounds like you're having a great time! 😄",
      "I can relate to that! How do you feel about it?",
      "That's awesome! What happened next?",
      "Oh really? That's quite something! 😊",
      "I love hearing about your experiences! ✨",
      "That sounds like quite an adventure! 🌟"
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    addMessage(randomReply, 'other');
  }, [addMessage, simulateTyping]);

  return {
    messages,
    chatStats,
    isTyping,
    addMessage,
    updateToneUsage,
    incrementWordsLearned,
    simulateOtherPersonReply
  };
};