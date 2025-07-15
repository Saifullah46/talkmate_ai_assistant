import { ToneType, SmartReply, SuggestionContext, TranslationResult } from '../types';
import { translationService } from './translationService';

class AIAssistantService {
  private apiKey: string = '';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async generateContextualReplies(context: SuggestionContext): Promise<SmartReply[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const { incomingMessage, detectedLanguage, platform, relationship } = context;

    // Context-aware reply templates based on relationship and platform
    const replyTemplates = {
      friend: {
        funny: [
          "Haha, you're hilarious! 😂",
          "LOL! That made my day! 🤣",
          "You always crack me up! 😄",
          "That's so funny, I can't stop laughing! 😆"
        ],
        casual: [
          "That's awesome! 😊",
          "Cool! Tell me more about it",
          "Sounds great! 👍",
          "Nice! How did that go?"
        ],
        friendly: [
          "That's really interesting! 😊",
          "Thanks for sharing that with me!",
          "I love hearing about your experiences!",
          "That sounds wonderful!"
        ]
      },
      colleague: {
        professional: [
          "Thank you for the update.",
          "I appreciate you letting me know.",
          "That sounds like a good approach.",
          "I understand. Let me know if you need anything."
        ],
        formal: [
          "Thank you for your message.",
          "I acknowledge your communication.",
          "That's very informative, thank you.",
          "I appreciate your professional approach."
        ]
      },
      romantic: {
        romantic: [
          "You always know how to make me smile 💕",
          "I love talking with you ❤️",
          "You're so sweet! 😍",
          "That means so much to me 💖"
        ],
        friendly: [
          "That's so thoughtful of you! 😊",
          "You're amazing! ✨",
          "I really appreciate you 💫",
          "You make me happy 😊"
        ]
      }
    };

    // Platform-specific adjustments
    const platformAdjustments = {
      whatsapp: { emoji: true, casual: true },
      instagram: { emoji: true, trendy: true },
      snapchat: { short: true, emoji: true },
      telegram: { detailed: true }
    };

    const relationshipTemplates = replyTemplates[relationship] || replyTemplates.friend;
    const availableTones = Object.keys(relationshipTemplates) as ToneType[];
    
    const replies: SmartReply[] = [];

    // Generate replies for available tones
    for (const tone of availableTones.slice(0, 3)) {
      const templates = relationshipTemplates[tone] || relationshipTemplates.friendly || [];
      const template = templates[Math.floor(Math.random() * templates.length)];
      
      let replyText = template;
      
      // Platform-specific modifications
      const platformSettings = platformAdjustments[platform as keyof typeof platformAdjustments];
      if (platformSettings?.short && replyText.length > 50) {
        replyText = replyText.substring(0, 47) + '...';
      }

      replies.push({
        text: replyText,
        tone,
        confidence: 0.9 - (replies.length * 0.1)
      });
    }

    // Translate replies if needed
    if (detectedLanguage !== 'en') {
      for (const reply of replies) {
        try {
          const translation = await translationService.translateText(reply.text, detectedLanguage);
          reply.translatedText = translation.translatedText;
        } catch (error) {
          console.error('Translation failed:', error);
        }
      }
    }

    return replies;
  }

  async generateSmartSuggestions(incomingMessage: string, platform: string): Promise<{
    quickReplies: string[];
    questions: string[];
    reactions: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const quickReplies = [
      "Thanks for letting me know!",
      "That sounds great!",
      "I understand",
      "Let me think about it",
      "Sure, no problem!",
      "That works for me"
    ];

    const questions = [
      "How was your day?",
      "What are your plans for the weekend?",
      "How's everything going?",
      "What have you been up to?",
      "Any exciting news?",
      "How's work/school?"
    ];

    const reactions = platform === 'whatsapp' 
      ? ['👍', '❤️', '😂', '😮', '😢', '🙏']
      : ['👍', '❤️', '😂', '😮', '😢', '🔥', '💯', '✨'];

    return {
      quickReplies: quickReplies.slice(0, 4),
      questions: questions.slice(0, 3),
      reactions
    };
  }

  async improveMessage(message: string, tone: ToneType, targetLanguage: string = 'en'): Promise<{
    improvedMessage: string;
    suggestions: string[];
    grammarFixes: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 700));

    // Grammar and style improvements
    const improvements = {
      funny: {
        improvedMessage: message + " 😄",
        suggestions: ["Add more emojis", "Use casual language", "Include humor"],
        grammarFixes: ["Consider adding punctuation", "Check spelling"]
      },
      romantic: {
        improvedMessage: message + " 💕",
        suggestions: ["Use warmer words", "Add heart emojis", "Be more expressive"],
        grammarFixes: ["Perfect grammar for romantic messages"]
      },
      formal: {
        improvedMessage: message.charAt(0).toUpperCase() + message.slice(1) + ".",
        suggestions: ["Use proper capitalization", "Add formal closing", "Be more specific"],
        grammarFixes: ["Ensure proper punctuation", "Use complete sentences"]
      },
      professional: {
        improvedMessage: "Thank you for your message. " + message,
        suggestions: ["Add professional greeting", "Use business language", "Be concise"],
        grammarFixes: ["Check for professional tone", "Ensure clarity"]
      }
    };

    return improvements[tone] || improvements.formal;
  }

  async getCulturalContext(language: string, message: string): Promise<{
    culturalNotes: string[];
    appropriateResponses: string[];
    etiquette: string[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const culturalContexts = {
      hi: {
        culturalNotes: [
          "In Indian culture, respect for elders is very important",
          "Using 'ji' shows respect in Hindi conversations",
          "Family relationships are highly valued"
        ],
        appropriateResponses: [
          "धन्यवाद जी (Thank you with respect)",
          "आपका स्वागत है (You're welcome)",
          "नमस्कार (Respectful greeting)"
        ],
        etiquette: [
          "Always greet with respect",
          "Ask about family and health",
          "Use formal language with elders"
        ]
      },
      es: {
        culturalNotes: [
          "Spanish speakers often use more expressive language",
          "Family and personal relationships are central",
          "Warmth and friendliness are highly valued"
        ],
        appropriateResponses: [
          "¡Qué bueno! (How good!)",
          "Me alegra mucho (I'm very happy)",
          "Un abrazo (A hug - friendly closing)"
        ],
        etiquette: [
          "Be warm and expressive",
          "Ask about family",
          "Use appropriate formal/informal address"
        ]
      }
    };

    return culturalContexts[language as keyof typeof culturalContexts] || {
      culturalNotes: ["Be respectful and friendly"],
      appropriateResponses: ["Thank you", "That's great", "I understand"],
      etiquette: ["Be polite", "Show interest", "Respond appropriately"]
    };
  }
}

export const aiAssistantService = new AIAssistantService();