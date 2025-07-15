import React, { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { NextQuestion } from '../types';
import { aiService } from '../services/aiService';

interface NextQuestionsProps {
  conversationHistory: string[];
}

const NextQuestions: React.FC<NextQuestionsProps> = ({ conversationHistory }) => {
  const [questions, setQuestions] = useState<NextQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const nextQuestions = await aiService.predictNextQuestions(conversationHistory);
      setQuestions(nextQuestions);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversationHistory.length > 0) {
      generateQuestions();
    }
  }, [conversationHistory]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>They might ask next</span>
        </div>
        <button
          onClick={generateQuestions}
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
        {loading ? (
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-5 w-20 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          questions.map((question, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors cursor-default"
              title={`Probability: ${Math.round(question.probability * 100)}%`}
            >
              {question.question.length > 25 ? question.question.substring(0, 25) + '...' : question.question}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default NextQuestions;