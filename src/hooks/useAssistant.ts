import { useState, useCallback } from 'react';
import { Message, AssistantStats, ToneType, SuggestionContext } from '../types';
import { aiAssistantService } from '../services/aiAssistantService';
import { translationService } from '../services/translationService';

export const useAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<AssistantStats>({
    messagesHelped: 0,
    wordsLearned: 0,
    languagesDetected: {},
    platformsUsed: {},
    repliesSuggested: 0
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<string>('whatsapp');
  const [relationship, setRelationship] = useState<'friend' | 'family' | 'colleague' | 'romantic' | 'stranger'>('friend');

  const addIncomingMessage = useCallback(async (text: string, platform: string = 'whatsapp') => {
    setIsProcessing(true);
    
    try {
      // Detect language
      const detectedLanguage = await translationService.detectLanguage(text);
      
      // Translate if not English
      let translatedText = text;
      let isTranslated = false;
      
      if (detectedLanguage !== 'en') {
        const translation = await translationService.translateText(text, 'en');
        translatedText = translation.translatedText;
        isTranslated = true;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        text: translatedText,
        sender: 'incoming',
        timestamp: new Date(),
        language: detectedLanguage as 'en' | 'hi',
        platform: platform as any,
        isTranslated,
        originalText: isTranslated ? text : undefined
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        messagesHelped: prev.messagesHelped + 1,
        languagesDetected: {
          ...prev.languagesDetected,
          [detectedLanguage]: (prev.languagesDetected[detectedLanguage] || 0) + 1
        },
        platformsUsed: {
          ...prev.platformsUsed,
          [platform]: (prev.platformsUsed[platform] || 0) + 1
        }
      }));

      return newMessage;
    } catch (error) {
      console.error('Failed to process incoming message:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateReplySuggestions = useCallback(async (incomingMessage: Message) => {
    if (!incomingMessage) return [];

    setIsProcessing(true);
    
    try {
      const context: SuggestionContext = {
        incomingMessage: incomingMessage.text,
        conversationHistory: messages,
        detectedLanguage: incomingMessage.language || 'en',
        platform: incomingMessage.platform || 'whatsapp',
        relationship
      };

      const replies = await aiAssistantService.generateContextualReplies(context);
      
      setStats(prev => ({
        ...prev,
        repliesSuggested: prev.repliesSuggested + replies.length
      }));

      return replies;
    } catch (error) {
      console.error('Failed to generate replies:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [messages, relationship]);

  const improveUserMessage = useCallback(async (message: string, tone: ToneType) => {
    setIsProcessing(true);
    
    try {
      const improvement = await aiAssistantService.improveMessage(message, tone);
      return improvement;
    } catch (error) {
      console.error('Failed to improve message:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getSmartSuggestions = useCallback(async (platform: string) => {
    try {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage) return null;

      return await aiAssistantService.generateSmartSuggestions(lastMessage.text, platform);
    } catch (error) {
      console.error('Failed to get smart suggestions:', error);
      return null;
    }
  }, [messages]);

  const getCulturalHelp = useCallback(async (language: string, message: string) => {
    try {
      return await aiAssistantService.getCulturalContext(language, message);
    } catch (error) {
      console.error('Failed to get cultural context:', error);
      return null;
    }
  }, []);

  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  const updateRelationship = useCallback((newRelationship: typeof relationship) => {
    setRelationship(newRelationship);
  }, []);

  return {
    messages,
    stats,
    isProcessing,
    currentPlatform,
    relationship,
    addIncomingMessage,
    generateReplySuggestions,
    improveUserMessage,
    getSmartSuggestions,
    getCulturalHelp,
    clearConversation,
    updateRelationship,
    setCurrentPlatform
  };
};