import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Settings, 
  Languages, 
  Smile, 
  Send,
  Bot,
  RotateCcw,
  Zap
} from 'lucide-react';

import { ToneType, WordMeaning } from '../types';
import { useChat } from '../hooks/useChat';
import { useSpeech } from '../hooks/useSpeech';
import { aiService } from '../services/aiService';

import MessageBubble from './MessageBubble';
import SmartReplies from './SmartReplies';
import NextQuestions from './NextQuestions';
import WordMeaningPopup from './WordMeaningPopup';

const TalkMate: React.FC = () => {
  const { 
    messages, 
    chatStats, 
    isTyping, 
    addMessage, 
    updateToneUsage, 
    incrementWordsLearned,
    simulateOtherPersonReply 
  } = useChat();

  const { 
    isListening, 
    isSpeaking, 
    error: speechError, 
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking,
    isSupported: speechSupported 
  } = useSpeech();

  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>('friendly');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [autoReply, setAutoReply] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordMeaning | null>(null);
  const [emojiSuggestions, setEmojiSuggestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tones = [
    { id: 'funny' as ToneType, label: 'Funny', emoji: '😄', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'romantic' as ToneType, label: 'Romantic', emoji: '💕', color: 'bg-pink-100 text-pink-700' },
    { id: 'formal' as ToneType, label: 'Formal', emoji: '🤝', color: 'bg-blue-100 text-blue-700' },
    { id: 'friendly' as ToneType, label: 'Friendly', emoji: '😊', color: 'bg-green-100 text-green-700' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (currentMessage.trim()) {
      generateEmojiSuggestions(currentMessage);
    }
  }, [currentMessage]);

  const generateEmojiSuggestions = async (text: string) => {
    try {
      const emojis = await aiService.analyzeSentiment(text);
      setEmojiSuggestions(emojis.slice(0, 6));
    } catch (error) {
      console.error('Failed to generate emoji suggestions:', error);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = addMessage(text, 'user', language);
    setCurrentMessage('');
    updateToneUsage(selectedTone);

    // Simulate other person's response after a delay
    if (autoReply) {
      setTimeout(() => {
        simulateOtherPersonReply(text);
      }, 2000);
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    try {
      const transcript = await startListening(language);
      if (transcript) {
        setCurrentMessage(transcript);
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Voice input failed:', error);
    }
  };

  const handleWordClick = async (word: string) => {
    try {
      const wordMeaning = await aiService.getWordMeaning(word);
      if (wordMeaning) {
        setSelectedWord(wordMeaning);
        incrementWordsLearned();
      }
    } catch (error) {
      console.error('Failed to get word meaning:', error);
    }
  };

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    try {
      await speak(text, language);
    } catch (error) {
      console.error('Speech failed:', error);
    }
  };

  const conversationHistory = messages.map(m => m.text);
  const lastOtherMessage = messages.filter(m => m.sender === 'other').pop()?.text || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 p-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">TalkMate</h1>
              <p className="text-sm text-gray-500">AI Chat Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
              title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Languages className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white/90 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Auto-Reply</span>
              <button
                onClick={() => setAutoReply(!autoReply)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoReply ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoReply ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Chat Improvement Stats</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{chatStats.wordsLearned}</div>
                  <div className="text-xs text-green-500">Words Learned</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{chatStats.messagesExchanged}</div>
                  <div className="text-xs text-blue-500">Messages</div>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {Object.values(chatStats.tonesUsed).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-xs text-purple-500">Replies Sent</div>
                </div>
              </div>
            </div>

            {speechError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{speechError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 p-4 pb-96 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onWordClick={handleWordClick}
              onSpeak={handleSpeak}
            />
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Word Meaning Popup */}
      {selectedWord && (
        <WordMeaningPopup
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          onSpeak={handleSpeak}
        />
      )}

      {/* Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-white/20 p-4 z-30 max-h-96 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          {/* Tone Selection */}
          <div className="flex space-x-2">
            {tones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`flex-1 p-2 rounded-xl text-xs font-medium transition-all ${
                  selectedTone === tone.id
                    ? tone.color + ' scale-105 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="text-lg mb-1">{tone.emoji}</div>
                <div>{tone.label}</div>
              </button>
            ))}
          </div>

          {/* Smart Replies */}
          {lastOtherMessage && !isTyping && (
            <SmartReplies
              lastMessage={lastOtherMessage}
              selectedTone={selectedTone}
              onReplySelect={handleSendMessage}
              conversationHistory={conversationHistory}
            />
          )}

          {/* Next Questions */}
          {conversationHistory.length > 2 && !isTyping && (
            <NextQuestions conversationHistory={conversationHistory} />
          )}

          {/* Input Area */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder={language === 'hi' ? 'अपना संदेश लिखें...' : 'Type your message...'}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(currentMessage)}
              />
              
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setCurrentMessage(prev => prev + '😊')}
                >
                  <Smile className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Voice Input */}
            {speechSupported && (
              <button
                onClick={handleVoiceInput}
                className={`p-3 rounded-2xl transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage(currentMessage)}
              disabled={!currentMessage.trim()}
              className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Emoji Suggestions */}
          {emojiSuggestions.length > 0 && currentMessage.trim() && (
            <div className="flex justify-center space-x-3">
              {emojiSuggestions.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMessage(prev => prev + emoji)}
                  className="text-xl hover:scale-110 transition-transform p-1 rounded-full hover:bg-gray-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalkMate;