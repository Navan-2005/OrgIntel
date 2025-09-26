import React, { useState } from 'react';
import { FileText, RefreshCw, Eye, EyeOff, Loader2 } from 'lucide-react';

function FlashcardsPanel({ flashcards, onGenerate, loading, hasFiles }) {
  const [showAnswers, setShowAnswers] = useState({});

  const toggleAnswer = (index) => {
    setShowAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="h-full flex flex-col">
      {!hasFiles ? (
        <div className="text-center text-gray-500 py-10">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Upload PDFs to generate flashcards</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <button
              onClick={onGenerate}
              disabled={loading}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{loading ? 'Generating...' : 'Generate Flashcards'}</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4">
            {flashcards.length > 0 ? (
              flashcards.map((card, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-medium text-gray-900 mb-2 flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs mr-2">Q</div>
                    <span>{card.question}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-start">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs mr-2">A</div>
                    <div className="flex-1">
                      {showAnswers[index] ? (
                        <div className="text-gray-700">{card.answer}</div>
                      ) : (
                        <div className="text-gray-400 italic">Click eye icon to reveal answer</div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleAnswer(index)}
                      className="text-gray-500 hover:text-gray-700 ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      {showAnswers[index] ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                Click "Generate Flashcards" to create study cards from your documents.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default FlashcardsPanel;