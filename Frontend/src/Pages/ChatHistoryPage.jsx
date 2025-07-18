import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyChats = [
  {
    id: 1,
    name: 'PDF Upload & Analysis',
    details: 'Feature: Users can upload PDF documents for analysis.\n\nDiscussion: Implemented drag-and-drop and file selection. Used axios for backend communication.\n\nNext Steps: Improve file validation and error handling.'
  },
  {
    id: 2,
    name: 'AI Chatbot Integration',
    details: 'Feature: Integrated AI assistant for document Q&A.\n\nDiscussion: Utilized ChatWindow and ChatInput components. Backend uses ML/app.py for summarization and flashcard generation.\n\nNext Steps: Enhance response accuracy and add chat history persistence.'
  },
  {
    id: 3,
    name: 'Frontend Layout',
    details: 'Feature: Modern UI with full-screen layout, draggable resizer between PDF viewer and chat.\n\nDiscussion: Used Tailwind CSS and React flexbox.\n\nNext Steps: Polish responsive design and accessibility.'
  },
  {
    id: 4,
    name: 'Flashcard Generator',
    details: 'Feature: Generate flashcards from PDF content.\n\nDiscussion: ML/services/flashcard_genarator.py processes text and returns flashcards.\n\nNext Steps: Improve NLP extraction and UI display.'
  },
  {
    id: 5,
    name: 'Summarization Service',
    details: 'Feature: Summarize uploaded documents.\n\nDiscussion: ML/services/summarizer.py provides summary endpoints.\n\nNext Steps: Add multi-language support and summary export.'
  },
];

function ChatHistoryPage() {
  const [selectedChatId, setSelectedChatId] = useState(dummyChats[0].id);
  const selectedChat = dummyChats.find(chat => chat.id === selectedChatId);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 border-b border-gray-300 flex items-center justify-between">
        <h1 className="text-xl font-bold">Chat History</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate('/')}
        >
          Back to PDF Page
        </button>
      </div>
      <div className="flex flex-1">
        {/* Column 1: Chat Names */}
        <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Project Chats</h2>
          <ul>
            {dummyChats.map(chat => (
              <li
                key={chat.id}
                className={`cursor-pointer p-3 rounded mb-3 text-base font-semibold transition-all duration-150 shadow-sm border ${selectedChatId === chat.id ? 'bg-blue-200 text-blue-900 border-blue-400' : 'hover:bg-blue-100 text-gray-900 border-gray-200'}`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <span className="block truncate">{chat.name}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Column 2: Selected Chat Details */}
        <div className="w-2/3 p-8 overflow-y-auto bg-white flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Details</h2>
          {selectedChat ? (
            <div className="w-full max-w-2xl bg-blue-50 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3 text-blue-800 border-b border-blue-200 pb-2">{selectedChat.name}</h3>
              <pre className="text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedChat.details}</pre>
            </div>
          ) : (
            <p className="text-gray-800">Select a chat to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistoryPage;
