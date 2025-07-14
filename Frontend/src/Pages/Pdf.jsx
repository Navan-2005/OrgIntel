import React, { useState, useEffect, useRef } from 'react';
import { Upload, Send, Trash2, FileText, MessageCircle, Bot, User, X, Download, Search, Settings, History, Eye, ChevronRight } from 'lucide-react';

function Pdf() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Generate session ID on component mount
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    // Scroll to bottom when chat history updates
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (droppedFiles.length > 0) {
      const dt = new DataTransfer();
      droppedFiles.forEach(file => dt.items.add(file));
      setFiles(dt.files);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select PDF files to upload.');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call - replace with actual axios call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add uploaded files to the list
      const newUploadedFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        uploadTime: new Date(),
        id: Date.now() + Math.random(),
        pages: Math.floor(Math.random() * 50) + 1 // Simulated page count
      }));
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      setFilesUploaded(true);
      setFiles([]);
      
      // Auto-add a welcome message to chat
      const welcomeMessage = {
        type: 'bot',
        message: `Great! I've processed ${newUploadedFiles.length} PDF file(s). You can now ask me questions about your documents. Try asking something like "What is the main topic of this document?" or "Can you summarize the key points?"`,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, welcomeMessage]);
      
    } catch (err) {
      alert('Error uploading files: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!filesUploaded) {
      const errorMessage = {
        type: 'bot',
        message: 'Please upload PDF files first before asking questions.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
      return;
    }

    if (!question.trim()) {
      return;
    }

    const userMessage = { type: 'user', message: question, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      setLoading(true);
      // Simulate API call - replace with actual axios call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        `Based on the document "${selectedFile ? selectedFile.name : 'your uploaded files'}", here's what I found: This appears to be related to your query about "${question}". The document contains relevant information that addresses your question.`,
        `I've analyzed your documents and found several key points related to "${question}". The main themes include various aspects that directly relate to your inquiry.`,
        `From the uploaded PDFs, I can see that your question about "${question}" is addressed in multiple sections. Let me provide you with a comprehensive answer based on the content.`
      ];
      
      const botMessage = { 
        type: 'bot', 
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, botMessage]);
      setQuestion('');
    } catch (err) {
      const errorMessage = { 
        type: 'error', 
        message: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date() 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile(null);
      setPreviewContent('');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    // Simulate document content preview
    setPreviewContent(`Preview of ${file.name}

This is a simulated preview of the PDF content. In a real implementation, you would:
1. Extract text content from the PDF
2. Display the first few pages or a summary
3. Allow users to scroll through the document
4. Highlight relevant sections based on search queries

Document Information:
- File: ${file.name}
- Size: ${formatFileSize(file.size)}
- Pages: ${file.pages}
- Uploaded: ${file.uploadTime.toLocaleString()}

Sample Content:
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

[This would be replaced with actual PDF content extraction in a real implementation]`);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 shadow-sm">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">PDF Document Analyzer</h1>
                <p className="text-sm text-gray-500">Upload and analyze PDF documents with AI assistance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {uploadedFiles.length} documents
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Session: {sessionId.slice(-6)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Explorer */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Upload Section */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Documents</h3>
              <span className="text-xs text-gray-500">{uploadedFiles.length} files</span>
            </div>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drop PDFs here or click to browse</p>
            </div>

            {files.length > 0 && (
              <div className="mt-3 space-y-1">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs text-gray-600 bg-white p-2 rounded border">
                    <FileText className="w-3 h-3 text-blue-600" />
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-gray-400">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || files.length === 0}
              className="w-full mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? 'Processing...' : 'Upload & Process'}
            </button>
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto">
            {uploadedFiles.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No documents uploaded yet</p>
                <p className="text-xs text-gray-400 mt-1">Upload PDFs to start analyzing</p>
              </div>
            ) : (
              <div className="p-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedFile && selectedFile.id === file.id
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{file.pages} pages</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {file.uploadTime.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileSelect(file);
                          }}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Preview document"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove document"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle Panel - Document Preview */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedFile ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h2 className="font-medium text-gray-900">{selectedFile.name}</h2>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedFile.size)} • {selectedFile.pages} pages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 p-1 rounded">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                      {previewContent}
                    </pre>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a document to preview</h3>
                <p className="text-sm text-gray-500">
                  Choose a PDF from the sidebar to view its contents and start asking questions
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - AI Chat (Copilot Style) */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500">Ask questions about your documents</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
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
                <div
                  key={index}
                  className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs ${chat.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      chat.type === 'user' 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}>
                      {chat.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        chat.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : chat.type === 'error'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{chat.message}</div>
                      <div className={`text-xs mt-1 ${
                        chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {chat.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
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

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your documents..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
}

export default Pdf;