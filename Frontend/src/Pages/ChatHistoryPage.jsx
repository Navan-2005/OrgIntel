import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

function ChatHistoryPage() {
  const { user } = useSelector(state => state.user);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  // Fetch chat history from backend
  const getChatHistory = async () => {
    try {
      const response = await axios.post('http://localhost:3000/huffman/getallrecord', {
        userId: user._id
      });
      setChatHistory(response.data);
    } catch (error) {
      console.log('Error getting chat history:', error);
    }
  };

  // Decode selected chat
  const showChat = async (recordId) => {
    try {
      const response = await axios.post('http://localhost:3000/huffman/decode', { recordId });
      const { decoded, original } = response.data;
      setSelectedChat({ decoded, original });
    } catch (error) {
      console.log('Error decoding chat:', error);
    }
  };

  useEffect(() => {
    getChatHistory();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 flex items-center justify-between">
        <h1 className="text-xl font-bold">Chat History</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate('/')}
        >
          Back to PDF Page
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left column: Chat list */}
        <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Project Chats</h2>
          <ul>
            {chatHistory.map(chat => (
              <li
                key={chat._id}
                className="cursor-pointer p-3 rounded mb-3 text-base font-semibold transition-all duration-150 shadow-sm border hover:bg-blue-100 text-gray-900 border-gray-200"
                onClick={() => showChat(chat._id)}
              >
                <span className="block truncate">{chat.originalText}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column: Selected chat details */}
        <div className="w-2/3 p-8 overflow-y-auto bg-white flex flex-col justify-center items-center">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Details</h2>
          {selectedChat ? (
            <div className="w-full max-w-2xl bg-blue-50 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Chat</h3>
              <p className="text-gray-800 mb-4 whitespace-pre-wrap">{selectedChat.original}</p>

              {/* <h3 className="text-lg font-semibold text-blue-800 mb-2">Decoded Result</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedChat.decoded}</p> */}
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
