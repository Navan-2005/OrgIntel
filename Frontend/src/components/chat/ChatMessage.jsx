// src/components/chat/ChatMessage.jsx
import React from 'react';
import { Bot, User } from 'lucide-react';

function ChatMessage({ message }) {
  const isUser = message.type === 'user';
  const isError = message.type === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-xs ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-blue-500' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500'
        }`}>
          {isUser ? (
            <User className="w-3 h-3 text-white" />
          ) : (
            <Bot className="w-3 h-3 text-white" />
          )}
        </div>
        <div
          className={`px-3 py-2 rounded-lg text-sm ${
            isUser
              ? 'bg-blue-500 text-black'
              : isError
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.message}</div>
          <div className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;