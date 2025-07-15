import { ToneType, SmartReply, NextQuestion, WordMeaning } from '../types';

// Mock AI service - In production, replace with actual OpenAI API calls
class AIService {
  private apiKey: string = '';

  constructor() {
    // In production, get from environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async generateSmartReplies(
    incomingMessage: string, 
    tone: ToneType, 
    conversationHistory: string[] = []
  ): Promise<SmartReply[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const replyTemplates = {
      funny: [
        "Haha, that's hilarious! 😄 You always know how to make me laugh!",
        "LOL! You're killing me with these jokes! 🤣",
        "That's so funny, I almost spit out my coffee! ☕😂",
        "You should do stand-up comedy! That was amazing! 🎭",
        "I'm literally rolling on the floor laughing! 🤣"
      ],
      romantic: [
        "Your message just made my heart skip a beat 💕",
        "I love how you express yourself, it's so beautiful ✨",
        "Every word from you feels like poetry to my soul 🌹",
        "You have such a way with words, it's enchanting 💖",
        "Reading your messages is the highlight of my day 🌟"
      ],
      formal: [
        "Thank you for sharing that information with me.",
        "I appreciate your thoughtful message and perspective.",
        "That's a very interesting point you've raised.",
        "I understand your position and respect your viewpoint.",
        "Thank you for taking the time to explain that."
      ],
      friendly: [
        "That sounds awesome! Tell me more about it! 😊",
        "Oh wow, that's really cool! I'm excited to hear more! 🎉",
        "That's so nice! You always have the best stories! 👍",
        "I love chatting with you, you're such great company! 🤗",
        "That's wonderful! Thanks for sharing that with me! ✨"
      ]
    };

    const templates = replyTemplates[tone];
    const selectedReplies = templates
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((text, index) => ({
        text,
        tone,
        confidence: 0.9 - (index * 0.1)
      }));

    return selectedReplies;
  }

  async predictNextQuestions(
    conversationHistory: string[]
  ): Promise<NextQuestion[]> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const commonQuestions = [
      { question: "What have you been up to today?", probability: 0.8, context: "daily_activities" },
      { question: "How was your weekend?", probability: 0.7, context: "weekend_plans" },
      { question: "Any exciting plans coming up?", probability: 0.6, context: "future_plans" },
      { question: "How's work/school going?", probability: 0.75, context: "work_life" },
      { question: "What's your favorite thing to do?", probability: 0.5, context: "hobbies" },
      { question: "Have you watched anything good lately?", probability: 0.6, context: "entertainment" },
      { question: "What's the weather like there?", probability: 0.4, context: "weather" },
      { question: "Do you have any recommendations?", probability: 0.65, context: "recommendations" }
    ];

    return commonQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }

  async getWordMeaning(word: string): Promise<WordMeaning | null> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const wordDatabase: { [key: string]: WordMeaning } = {
      awesome: {
        word: "awesome",
        meaning: "Extremely impressive or daunting; inspiring awe",
        example: "The view from the mountain was awesome!",
        pronunciation: "/ˈɔːsəm/",
        hindi: "अद्भुत, शानदार",
        partOfSpeech: "adjective"
      },
      exciting: {
        word: "exciting",
        meaning: "Causing great enthusiasm and eagerness",
        example: "This is an exciting opportunity for growth.",
        pronunciation: "/ɪkˈsaɪtɪŋ/",
        hindi: "रोमांचक, उत्साहजनक",
        partOfSpeech: "adjective"
      },
      beautiful: {
        word: "beautiful",
        meaning: "Pleasing the senses or mind aesthetically",
        example: "She has a beautiful smile.",
        pronunciation: "/ˈbjuːtɪfʊl/",
        hindi: "सुंदर, खूबसूरत",
        partOfSpeech: "adjective"
      },
      wonderful: {
        word: "wonderful",
        meaning: "Inspiring delight, pleasure, or admiration; extremely good",
        example: "We had a wonderful time at the party.",
        pronunciation: "/ˈwʌndəfʊl/",
        hindi: "अद्भुत, बेहतरीन",
        partOfSpeech: "adjective"
      },
      amazing: {
        word: "amazing",
        meaning: "Causing great surprise or wonder; astonishing",
        example: "The magician's tricks were amazing.",
        pronunciation: "/əˈmeɪzɪŋ/",
        hindi: "आश्चर्यजनक, कमाल का",
        partOfSpeech: "adjective"
      }
    };

    return wordDatabase[word.toLowerCase()] || null;
  }

  async translateText(text: string, targetLanguage: 'en' | 'hi'): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock translation - In production, use Google Translate API
    const translations: { [key: string]: { [key: string]: string } } = {
      en: {
        "नमस्ते": "Hello",
        "कैसे हैं आप": "How are you",
        "धन्यवाद": "Thank you",
        "अच्छा": "Good",
        "बहुत बढ़िया": "Very good"
      },
      hi: {
        "Hello": "नमस्ते",
        "How are you": "कैसे हैं आप",
        "Thank you": "धन्यवाद",
        "Good": "अच्छा",
        "Very good": "बहुत बढ़िया"
      }
    };

    return translations[targetLanguage]?.[text] || text;
  }

  async analyzeSentiment(text: string): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const sentimentEmojis: { [key: string]: string[] } = {
      positive: ['😊', '😄', '🎉', '👍', '❤️', '✨', '🌟', '🤗'],
      negative: ['😔', '😢', '😞', '💔', '😕', '😰', '😓', '😪'],
      neutral: ['😐', '🤔', '😌', '🙂', '😊', '👋', '🤷‍♂️', '💭'],
      excited: ['🎉', '🚀', '⚡', '🔥', '💫', '🌈', '🎊', '🥳'],
      love: ['❤️', '💕', '💖', '💝', '😍', '🥰', '💘', '💞']
    };

    // Simple sentiment analysis based on keywords
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('love') || lowerText.includes('heart') || lowerText.includes('romantic')) {
      return sentimentEmojis.love;
    } else if (lowerText.includes('excited') || lowerText.includes('amazing') || lowerText.includes('awesome')) {
      return sentimentEmojis.excited;
    } else if (lowerText.includes('sad') || lowerText.includes('sorry') || lowerText.includes('bad')) {
      return sentimentEmojis.negative;
    } else if (lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('happy')) {
      return sentimentEmojis.positive;
    }
    
    return sentimentEmojis.neutral;
  }
}

export const aiService = new AIService();