// src/components/chat/ChatWindow.jsx
import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';

function ChatWindow({ chatHistory, loading, chatEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {chatHistory.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">Ready to help!</p>
          <p className="text-xs text-gray-500 mb-4">
            Upload documents and start asking questions
          </p>
          <div className="text-left space-y-2">
            <p className="text-xs text-gray-500 font-medium">Try asking:</p>
            <div className="space-y-1">
              <div className="text-xs text-gray-400">• "What is this document about?"</div>
              <div className="text-xs text-gray-400">• "Summarize the key points"</div>
              <div className="text-xs text-gray-400">• "Find information about..."</div>
            </div>
          </div>
        </div>
      ) : (
        chatHistory.map((chat, index) => (
          <ChatMessage key={index} message={chat} />
        ))
      )}
      {loading && (
        <div className="flex justify-start">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs">Thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}

export default ChatWindow;