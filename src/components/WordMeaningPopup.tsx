import React from 'react';
import { X, Volume2, BookOpen, Globe } from 'lucide-react';
import { WordMeaning } from '../types';

interface WordMeaningPopupProps {
  word: WordMeaning;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

const WordMeaningPopup: React.FC<WordMeaningPopupProps> = ({ word, onClose, onSpeak }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-800">{word.word}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Part of Speech */}
          {word.partOfSpeech && (
            <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {word.partOfSpeech}
            </div>
          )}

          {/* Meaning */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Meaning:</p>
            <p className="text-gray-800 leading-relaxed">{word.meaning}</p>
          </div>

          {/* Example */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Example:</p>
            <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg">
              "{word.example}"
            </p>
          </div>

          {/* Pronunciation */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Pronunciation:</p>
            <div className="flex items-center space-x-2">
              <p className="text-gray-800 font-mono bg-gray-50 px-2 py-1 rounded">
                {word.pronunciation}
              </p>
              <button
                onClick={() => onSpeak(word.word)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Listen to pronunciation"
              >
                <Volume2 className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Hindi Translation */}
          {word.hindi && (
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Globe className="h-4 w-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-600">Hindi:</p>
              </div>
              <p className="text-gray-800 bg-orange-50 p-2 rounded-lg">
                {word.hindi}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-6">
          <button
            onClick={() => onSpeak(word.word)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Volume2 className="h-4 w-4" />
            <span>Pronounce</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordMeaningPopup;