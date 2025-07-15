import { useState, useCallback } from 'react';
import { speechService } from '../services/speechService';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(async (language: 'en' | 'hi' = 'en'): Promise<string | null> => {
    try {
      setError(null);
      setIsListening(true);
      const transcript = await speechService.startListening(language);
      setIsListening(false);
      return transcript;
    } catch (err) {
      setIsListening(false);
      setError(err instanceof Error ? err.message : 'Speech recognition failed');
      return null;
    }
  }, []);

  const stopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
  }, []);

  const speak = useCallback(async (text: string, language: 'en' | 'hi' = 'en'): Promise<void> => {
    try {
      setError(null);
      setIsSpeaking(true);
      await speechService.speak(text, language);
      setIsSpeaking(false);
    } catch (err) {
      setIsSpeaking(false);
      setError(err instanceof Error ? err.message : 'Speech synthesis failed');
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported: speechService.isSupported
  };
};