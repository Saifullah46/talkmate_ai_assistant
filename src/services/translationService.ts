class TranslationService {
  private apiKey: string = '';

  constructor() {
    // In production, use Google Translate API or similar
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '';
  }

  async detectLanguage(text: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Simple language detection based on character patterns
    const hindiPattern = /[\u0900-\u097F]/;
    const arabicPattern = /[\u0600-\u06FF]/;
    const chinesePattern = /[\u4e00-\u9fff]/;
    const spanishWords = ['hola', 'como', 'estas', 'gracias', 'por', 'favor'];
    const frenchWords = ['bonjour', 'comment', 'allez', 'vous', 'merci', 'beaucoup'];
    const germanWords = ['hallo', 'wie', 'geht', 'danke', 'bitte', 'gut'];

    const lowerText = text.toLowerCase();

    if (hindiPattern.test(text)) return 'hi';
    if (arabicPattern.test(text)) return 'ar';
    if (chinesePattern.test(text)) return 'zh';
    if (spanishWords.some(word => lowerText.includes(word))) return 'es';
    if (frenchWords.some(word => lowerText.includes(word))) return 'fr';
    if (germanWords.some(word => lowerText.includes(word))) return 'de';

    return 'en'; // Default to English
  }

  async translateText(text: string, targetLanguage: string = 'en'): Promise<{
    translatedText: string;
    sourceLanguage: string;
    confidence: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock translation database
    const translations: { [key: string]: { [key: string]: string } } = {
      hi: {
        en: {
          'नमस्ते': 'Hello',
          'कैसे हैं आप': 'How are you',
          'धन्यवाद': 'Thank you',
          'अच्छा': 'Good',
          'बहुत बढ़िया': 'Very good',
          'मैं ठीक हूं': 'I am fine',
          'आप कैसे हैं': 'How are you',
          'क्या हाल है': 'What\'s up',
          'मिलकर खुशी हुई': 'Nice to meet you'
        }
      },
      es: {
        en: {
          'hola': 'hello',
          'como estas': 'how are you',
          'muy bien': 'very good',
          'gracias': 'thank you',
          'de nada': 'you\'re welcome',
          'buenas noches': 'good night',
          'hasta luego': 'see you later'
        }
      },
      fr: {
        en: {
          'bonjour': 'hello',
          'comment allez-vous': 'how are you',
          'très bien': 'very good',
          'merci': 'thank you',
          'de rien': 'you\'re welcome',
          'bonne nuit': 'good night',
          'à bientôt': 'see you soon'
        }
      },
      en: {
        hi: {
          'hello': 'नमस्ते',
          'how are you': 'कैसे हैं आप',
          'thank you': 'धन्यवाद',
          'good': 'अच्छा',
          'very good': 'बहुत बढ़िया',
          'nice to meet you': 'मिलकर खुशी हुई',
          'goodbye': 'अलविदा',
          'yes': 'हाँ',
          'no': 'नहीं'
        }
      }
    };

    const sourceLanguage = await this.detectLanguage(text);
    const lowerText = text.toLowerCase();
    
    const translationMap = translations[sourceLanguage]?.[targetLanguage];
    let translatedText = text;
    
    if (translationMap) {
      // Find the best match
      const match = Object.keys(translationMap).find(key => 
        lowerText.includes(key.toLowerCase())
      );
      
      if (match) {
        translatedText = translationMap[match];
      }
    }

    return {
      translatedText,
      sourceLanguage,
      confidence: translatedText !== text ? 0.85 : 0.95
    };
  }

  async getLanguageName(code: string): Promise<string> {
    const languageNames: { [key: string]: string } = {
      'en': 'English',
      'hi': 'Hindi',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'ar': 'Arabic',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'it': 'Italian'
    };

    return languageNames[code] || 'Unknown';
  }
}

export const translationService = new TranslationService();