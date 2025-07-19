// src/components/chat/ChatInput.jsx
import React from 'react';
import { Send } from 'lucide-react';

function ChatInput({ question, setQuestion, handleSubmit, loading }) {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex space-x-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your documents..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          onClick={(e)=>(handleSubmit(e))}
          disabled={loading || !question.trim()}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}

export default ChatInput;