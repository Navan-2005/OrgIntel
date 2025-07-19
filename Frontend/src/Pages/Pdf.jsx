import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Trash2 } from 'lucide-react';
import Header from '../components/layout/Header';
import MainLayout from '../components/layout/MainLayout';
import FileUploader from '../components/file-explorer/FileUploader';
import FileList from '../components/file-explorer/FileList';
import DocumentViewerHeader from '../components/document-viewer/DocumentViewerHeader';
import DocumentPreview from '../components/document-viewer/DocumentPreview';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Pdf() {
  const navigate = useNavigate();
  // State management (mostly remains here as it's global to the page)
  const{user}= useSelector((state) => state.user);
  const [files, setFiles] = useState([]); // Files selected for upload
  const [uploadedFiles, setUploadedFiles] = useState([]); // Successfully uploaded files
  const [question, setQuestion] = useState(''); // Current chat input
  const [chatHistory, setChatHistory] = useState([]); // History of chat messages
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [sessionId, setSessionId] = useState(''); // Unique session ID
  const [filesUploaded, setFilesUploaded] = useState(false); // Flag if any files are uploaded
  const [dragActive, setDragActive] = useState(false); // Drag/drop state for file uploader
  const [selectedFile, setSelectedFile] = useState(null); // Currently selected file for preview
  const [previewContent, setPreviewContent] = useState(''); // Simulated preview content
  const send =async()=>{
    try {
      const response = await axios.post('http://localhost:3000/huffman/encode', {
        text:chatHistory,
        userId: user.id,}) // Assuming user ID is needed for context
        console.log('Chat response:', response.data);
        
    } catch (error) {
      console.log('Chat error:', error);
      
    }
  }
  
  const chatEndRef = useRef(null); // Ref for auto-scrolling chat

  // Lifecycle effects
  useEffect(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Utility function (can be moved to a `utils/` file if needed elsewhere)
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Handlers for file upload
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

  // const handleUpload = async () => {
  //   if (files.length === 0) {
  //     alert('Please select PDF files to upload.');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     // Simulate API call - replace with actual axios call
  //     await new Promise(resolve => setTimeout(resolve, 2000));
      
  //     const newUploadedFiles = Array.from(files).map(file => ({
  //       name: file.name,
  //       size: file.size,
  //       uploadTime: new Date(),
  //       id: Date.now() + Math.random(),
  //       pages: Math.floor(Math.random() * 50) + 1, // Simulated page count
  //       rawFile: file // Keep reference to the actual File object for potential future use (e.g., react-pdf)
        
  //     })
  //   );
  //     console.log('New uploaded files: ', files.FileList);
      
  //     const response=await axios.post('http://localhost:3000/pdf/upload', { files: files.fileList,sessionId:123});
  //     console.log('Response after uploading pdf : ',response);
      
  //     setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
  //     setFilesUploaded(true);
  //     setFiles([]); // Clear selected files for next upload
      
  //     const welcomeMessage = {
  //       type: 'bot',
  //       message: `Great! I've processed ${newUploadedFiles.length} PDF file(s). You can now ask me questions about your documents. Try asking something like "What is the main topic of this document?" or "Can you summarize the key points?"`,
  //       timestamp: new Date()
  //     };
  //     setChatHistory(prev => [...prev, welcomeMessage]);
      
  //   } catch (err) {
  //     alert('Error uploading files: ' ,err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handlers for chat functionality
   const handleUpload = async () => {
  if (!files || files.length === 0) {
    alert('Please select PDF files to upload.');
    return;
  }

  const formData = new FormData();

  // Append each file to FormData as 'pdfs' (name should match Multer field)
  Array.from(files).forEach(file => {
    formData.append('pdfs', file);  // <-- Key must match multer.array('pdfs')
  });

  // Add sessionId
  formData.append('sessionId', sessionId);

  try {
    setLoading(true);

    const response = await axios.post('http://localhost:3000/pdf/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload response:', response.data);

    const newUploadedFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      uploadTime: new Date(),
      id: Date.now() + Math.random(),
      pages: Math.floor(Math.random() * 50) + 1,
      rawFile: file,
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
    setFilesUploaded(true);
    setFiles([]);

    const welcomeMessage = {
      type: 'bot',
      message: `Great! I've processed ${newUploadedFiles.length} PDF file(s). You can now ask me questions about your documents.`,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, welcomeMessage]);

  } catch (err) {
    console.error('Upload error:', err);
    alert('Error uploading files: ' + (err.response?.data?.error || err.message));
  } finally {
    setLoading(false);
  }
};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!filesUploaded) {
  //     const errorMessage = {
  //       type: 'bot',
  //       message: 'Please upload PDF files first before asking questions.',
  //       timestamp: new Date()
  //     };
  //     setChatHistory(prev => [...prev, errorMessage]);
  //     return;
  //   }

  //   if (!question.trim()) {
  //     return;
  //   }

  //   const userMessage = { type: 'user', message: question, timestamp: new Date() };
  //   setChatHistory(prev => [...prev, userMessage]);

  //   try {
  //     setLoading(true);
  //     // Simulate API call - replace with actual axios call
  //     await new Promise(resolve => setTimeout(resolve, 1500));
      
  //     const responses = [
  //       `Based on the document "${selectedFile ? selectedFile.name : 'your uploaded files'}", here's what I found: This appears to be related to your query about "${question}". The document contains relevant information that addresses your question.`,
  //       `I've analyzed your documents and found several key points related to "${question}". The main themes include various aspects that directly relate to your inquiry.`,
  //       `From the uploaded PDFs, I can see that your question about "${question}" is addressed in multiple sections. Let me provide you with a comprehensive answer based on the content.`
  //     ];
      
  //     const botMessage = { 
  //       type: 'bot', 
  //       message: responses[Math.floor(Math.random() * responses.length)],
  //       timestamp: new Date() 
  //     };
  //     setChatHistory(prev => [...prev, botMessage]);
  //     setQuestion('');
  //   } catch (err) {
  //     const errorMessage = { 
  //       type: 'error', 
  //       message: 'Sorry, I encountered an error while processing your question. Please try again.',
  //       timestamp: new Date() 
  //     };
  //     setChatHistory(prev => [...prev, errorMessage]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!filesUploaded) {
    const errorMessage = {
      type: 'bot',
      message: 'Please upload PDF files first before asking questions.',
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, errorMessage]);
    return;
  }

  if (!question.trim()) return;

  const userMessage = {
    type: 'user',
    message: question,
    timestamp: new Date(),
  };
  setChatHistory(prev => [...prev, userMessage]);

  try {
    setLoading(true);

    const response = await axios.post('http://localhost:3000/pdf/chat', {
      question,
      sessionId,
    });

    const botMessage = {
      type: 'bot',
      message: response.data.answer || "Sorry, I couldn't find an answer in the document.",
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, botMessage]);
    setQuestion('');
  } catch (err) {
    const errorMessage = {
      type: 'error',
      message:
        'Sorry, I encountered an error while processing your question. Please try again.',
      timestamp: new Date(),
    };
    console.error('Chat error:', err);
    setChatHistory(prev => [...prev, errorMessage]);
  } finally {
    setLoading(false);
  }
};


  const clearChat = () => {
    setChatHistory([]);
  };

  // Handlers for file list actions
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile(null);
      setPreviewContent('');
    }
  };
//   const handleFileSelect = (file) => {
//     setSelectedFile(file);
//     // Simulate document content preview - replace with actual PDF content extraction
//     setPreviewContent(`Preview of ${file.name}

// This is a simulated preview of the PDF content. In a real implementation, you would:
// 1. Extract text content from the PDF
// 2. Display the first few pages or a summary
// 3. Allow users to scroll through the document
// 4. Highlight relevant sections based on search queries

// Document Information:
// - File: ${file.name}
// - Size: ${formatFileSize(file.size)}
// - Pages: ${file.pages}
// - Uploaded: ${file.uploadTime.toLocaleString()}

// Sample Content:
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

// Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

// [This would be replaced with actual PDF content extraction in a real implementation]`);
//   };
const [pdfUrl, setPdfUrl] = useState(null);

const handleFileSelect = (file) => {
  setSelectedFile(file);
  const url = URL.createObjectURL(file.rawFile);
  setPdfUrl(url);
};


  return (
    <div className="w-screen bg-gray-100 flex flex-col">
      {/* Header Component */}
      <Header uploadedFilesCount={uploadedFiles.length} sessionId={sessionId} />
      {/* Main Content Area Layout */}
      <MainLayout
        fileExplorer={
          <>
            <FileUploader
              files={files}
              dragActive={dragActive}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              handleFileChange={handleFileChange}
              handleUpload={handleUpload}
              loading={loading}
              formatFileSize={formatFileSize}
            />
            <FileList
              uploadedFiles={uploadedFiles}
              selectedFile={selectedFile}
              handleFileSelect={handleFileSelect}
              removeFile={removeFile}
              formatFileSize={formatFileSize}
            />
          </>
        }
        documentViewer={
          <>
            <DocumentViewerHeader selectedFile={selectedFile} formatFileSize={formatFileSize} />
            <DocumentPreview selectedFile={selectedFile} previewContent={previewContent} />
          </>
        }
        chatPanel={
          <>
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearChat}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={send}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    title="Save chat history"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => navigate('/chat-history')}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    title="Go to Chat History"
                  >
                    Chat History
                  </button>
                </div>
              </div>
            </div>
            <ChatWindow chatHistory={chatHistory} loading={loading} chatEndRef={chatEndRef} />
            <ChatInput
              question={question}
              setQuestion={setQuestion}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </>
        }
      />
    </div>
  );
}

export default Pdf;