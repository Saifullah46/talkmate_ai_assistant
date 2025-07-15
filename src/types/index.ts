export interface Message {
  id: string;
  text: string;
  sender: 'incoming' | 'outgoing';
  timestamp: Date;
  language?: 'en' | 'hi' | 'auto';
  platform?: 'whatsapp' | 'instagram' | 'snapchat' | 'telegram' | 'other';
  isTranslated?: boolean;
  originalText?: string;
}

export interface WordMeaning {
  word: string;
  meaning: string;
  example: string;
  pronunciation: string;
  hindi?: string;
  partOfSpeech?: string;
}

export interface AssistantStats {
  messagesHelped: number;
  wordsLearned: number;
  languagesDetected: { [key: string]: number };
  platformsUsed: { [key: string]: number };
  repliesSuggested: number;
}

export type ToneType = 'funny' | 'romantic' | 'formal' | 'friendly' | 'casual' | 'professional';

export interface SmartReply {
  text: string;
  tone: ToneType;
  confidence: number;
  translatedText?: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

export interface SuggestionContext {
  incomingMessage: string;
  conversationHistory: Message[];
  detectedLanguage: string;
  platform: string;
  relationship: 'friend' | 'family' | 'colleague' | 'romantic' | 'stranger';
}