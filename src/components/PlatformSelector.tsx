import React from 'react';
import { MessageCircle, Instagram, Send, Zap } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  relationship: string;
  onRelationshipChange: (relationship: string) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onPlatformChange,
  relationship,
  onRelationshipChange
}) => {
  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-100 text-green-700' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-100 text-pink-700' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-100 text-blue-700' },
    { id: 'snapchat', name: 'Snapchat', icon: Zap, color: 'bg-yellow-100 text-yellow-700' }
  ];

  const relationships = [
    { id: 'friend', name: 'Friend', emoji: '👫' },
    { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { id: 'colleague', name: 'Colleague', emoji: '👔' },
    { id: 'romantic', name: 'Romantic', emoji: '💕' },
    { id: 'stranger', name: 'Stranger', emoji: '🤝' }
  ];

  return (
    <div className="space-y-4">
      {/* Platform Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Platform</h3>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => onPlatformChange(platform.id)}
                className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center space-x-2 ${
                  selectedPlatform === platform.id
                    ? platform.color + ' scale-105 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{platform.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Relationship Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Relationship</h3>
        <div className="grid grid-cols-3 gap-2">
          {relationships.map((rel) => (
            <button
              key={rel.id}
              onClick={() => onRelationshipChange(rel.id)}
              className={`p-2 rounded-xl text-xs font-medium transition-all ${
                relationship === rel.id
                  ? 'bg-blue-100 text-blue-700 scale-105 shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm mb-1">{rel.emoji}</div>
              <div>{rel.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;