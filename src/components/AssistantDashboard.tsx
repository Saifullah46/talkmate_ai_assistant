import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Globe, 
  TrendingUp, 
  Copy, 
  Settings,
  RefreshCw,
  Lightbulb,
  Heart
} from 'lucide-react';

import { useAssistant } from '../hooks/useAssistant';
import { useSpeech } from '../hooks/useSpeech';
import { SmartReply } from '../types';

import MessageInput from './MessageInput';
import ReplyCard from './ReplyCard';
import PlatformSelector from './PlatformSelector';

const AssistantDashboard: React.FC = () => {
  const {
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
  } = useAssistant();

  const { speak, isSupported: speechSupported } = useSpeech();

  const [smartReplies, setSmartReplies] = useState<SmartReply[]>([]);
  const [quickSuggestions, setQuickSuggestions] = useState<any>(null);
  const [culturalHelp, setCulturalHelp] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedText, setCopiedText] = useState<string>('');

  const lastIncomingMessage = messages.filter(m => m.sender === 'incoming').pop();

  useEffect(() => {
    if (lastIncomingMessage) {
      generateReplies();
      getQuickSuggestions();
      getCulturalContext();
    }
  }, [lastIncomingMessage, relationship]);

  const generateReplies = async () => {
    if (!lastIncomingMessage) return;
    
    const replies = await generateReplySuggestions(lastIncomingMessage);
    setSmartReplies(replies);
  };

  const getQuickSuggestions = async () => {
    const suggestions = await getSmartSuggestions(currentPlatform);
    setQuickSuggestions(suggestions);
  };

  const getCulturalContext = async () => {
    if (!lastIncomingMessage) return;
    
    const context = await getCulturalHelp(
      lastIncomingMessage.language || 'en',
      lastIncomingMessage.text
    );
    setCulturalHelp(context);
  };

  const handleIncomingMessage = async (message: string) => {
    await addIncomingMessage(message, currentPlatform);
  };

  const handleImproveMessage = async (message: string, tone: any) => {
    const improvement = await improveUserMessage(message, tone);
    if (improvement) {
      // Show improvement suggestions
      console.log('Message improvement:', improvement);
    }
  };

  const handleCopyReply = (text: string) => {
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 3000);
  };

  const handleSpeak = async (text: string) => {
    if (speechSupported) {
      try {
        await speak(text, lastIncomingMessage?.language || 'en');
      } catch (error) {
        console.error('Speech failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 p-4 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-800">TalkMate Assistant</h1>
              <p className="text-sm text-gray-500">Your personal communication helper</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            
            <button
              onClick={clearConversation}
              className="p-2 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
            >
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white/90 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-4xl mx-auto">
            <PlatformSelector
              selectedPlatform={currentPlatform}
              onPlatformChange={setCurrentPlatform}
              relationship={relationship}
              onRelationshipChange={updateRelationship}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Messages Helped</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.messagesHelped}</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Languages</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {Object.keys(stats.languagesDetected).length}
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Replies Suggested</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.repliesSuggested}</div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Words Learned</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats.wordsLearned}</div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Paste Message You Received</span>
          </h2>
          
          <MessageInput
            onMessageSubmit={handleIncomingMessage}
            onImproveMessage={handleImproveMessage}
            onSpeak={handleSpeak}
            isProcessing={isProcessing}
          />
        </div>

        {/* Incoming Message Display */}
        {lastIncomingMessage && (
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Received Message</h3>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600">
                    From: {lastIncomingMessage.platform}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {lastIncomingMessage.language?.toUpperCase()}
                  </span>
                </div>
                
                {lastIncomingMessage.isTranslated && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Translated
                  </span>
                )}
              </div>
              
              <p className="text-gray-800 leading-relaxed">{lastIncomingMessage.text}</p>
              
              {lastIncomingMessage.originalText && (
                <p className="text-sm text-gray-600 mt-2 italic border-t pt-2">
                  Original: {lastIncomingMessage.originalText}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Smart Replies */}
        {smartReplies.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Smart Reply Suggestions</span>
              </h3>
              
              <button
                onClick={generateReplies}
                disabled={isProcessing}
                className="p-2 hover:bg-white/50 rounded-full transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {smartReplies.map((reply, index) => (
                <ReplyCard
                  key={index}
                  reply={reply}
                  onCopy={handleCopyReply}
                  onSpeak={handleSpeak}
                  showTranslation={lastIncomingMessage?.language !== 'en'}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quick Suggestions */}
        {quickSuggestions && (
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            
            <div className="space-y-4">
              {/* Quick Replies */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Replies</h4>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.quickReplies.map((reply: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleCopyReply(reply)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reactions */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Reactions</h4>
                <div className="flex space-x-2">
                  {quickSuggestions.reactions.map((reaction: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleCopyReply(reaction)}
                      className="text-2xl hover:scale-110 transition-transform p-1 rounded-full hover:bg-gray-100"
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cultural Context */}
        {culturalHelp && (
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Cultural Context & Tips</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cultural Notes</h4>
                <ul className="space-y-1">
                  {culturalHelp.culturalNotes.map((note: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Communication Etiquette</h4>
                <div className="flex flex-wrap gap-2">
                  {culturalHelp.etiquette.map((tip: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                    >
                      {tip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Copy Notification */}
        {copiedText && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
            <Copy className="h-4 w-4" />
            <span>Copied to clipboard!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantDashboard;