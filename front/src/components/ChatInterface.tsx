// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Send, 
//   Paperclip, 
//   Bot, 
//   User, 
//   FileText,
//   BookOpen,
//   RotateCcw,
//   ChevronDown,
//   ChevronUp
// } from "lucide-react";
// import { SummaryBlock } from "@/components/blocks/SummaryBlock";
// import { FlashcardsBlock } from "@/components/blocks/FlashcardsBlock";
// import { DocumentPreview } from "@/components/blocks/DocumentPreview";

// interface Message {
//   id: string;
//   type: "user" | "assistant" | "block";
//   content: string;
//   timestamp: Date;
//   blockType?: "summary" | "flashcards" | "document";
//   blockData?: any;
// }

// export const ChatInterface = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       type: "user",
//       content: "I've uploaded my research paper on AI ethics. Can you help me understand it?",
//       timestamp: new Date(Date.now() - 10 * 60 * 1000)
//     },
//     {
//       id: "2",
//       type: "block",
//       content: "",
//       timestamp: new Date(Date.now() - 9 * 60 * 1000),
//       blockType: "document",
//       blockData: {
//         title: "AI Ethics and Bias Detection in Machine Learning Systems",
//         pages: 42,
//         fileType: "PDF",
//         uploadedAt: new Date(Date.now() - 9 * 60 * 1000)
//       }
//     },
//     {
//       id: "3",
//       type: "assistant", 
//       content: "I've processed your research paper! It's a comprehensive 42-page study on AI ethics and bias detection. I can help you in several ways:",
//       timestamp: new Date(Date.now() - 9 * 60 * 1000)
//     },
//     {
//       id: "4",
//       type: "user",
//       content: "Please create a summary of the key findings",
//       timestamp: new Date(Date.now() - 8 * 60 * 1000)
//     },
//     {
//       id: "5",
//       type: "block",
//       content: "",
//       timestamp: new Date(Date.now() - 7 * 60 * 1000),
//       blockType: "summary",
//       blockData: {
//         title: "AI Ethics Research - Key Findings",
//         tldr: "The paper identifies three major sources of bias in ML systems: data bias, algorithmic bias, and deployment bias. It proposes a framework for detecting and mitigating these biases throughout the ML lifecycle.",
//         sections: [
//           {
//             title: "Introduction & Problem Statement",
//             content: "AI systems increasingly impact critical decisions in healthcare, finance, and criminal justice. However, these systems often perpetuate or amplify existing societal biases, leading to unfair outcomes for marginalized groups."
//           },
//           {
//             title: "Types of Bias Identified", 
//             content: "1. Data Bias: Underrepresentation in training data\n2. Algorithmic Bias: Inherent model assumptions\n3. Deployment Bias: Context-specific implementation issues"
//           },
//           {
//             title: "Proposed Detection Framework",
//             content: "A three-stage approach: pre-processing bias detection, in-training monitoring, and post-deployment auditing. Includes statistical tests and fairness metrics."
//           },
//           {
//             title: "Case Studies",
//             content: "Analysis of bias in hiring algorithms, medical diagnosis systems, and loan approval processes. Shows 15-30% improvement in fairness metrics when framework is applied."
//           }
//         ]
//       }
//     },
//     {
//       id: "6",
//       type: "user",
//       content: "This is great! Can you also create flashcards to help me study these concepts?",
//       timestamp: new Date(Date.now() - 5 * 60 * 1000)
//     },
//     {
//       id: "7",
//       type: "block",
//       content: "",
//       timestamp: new Date(Date.now() - 4 * 60 * 1000),
//       blockType: "flashcards",
//       blockData: {
//         title: "AI Ethics & Bias Detection - Study Cards",
//         totalCount: 8,
//         flashcards: [
//           {
//             id: "1",
//             question: "What are the three main types of bias identified in ML systems?",
//             answer: "Data bias (underrepresentation in training data), Algorithmic bias (inherent model assumptions), and Deployment bias (context-specific implementation issues).",
//             category: "Bias Types"
//           },
//           {
//             id: "2", 
//             question: "What is the three-stage bias detection framework proposed in the paper?",
//             answer: "Pre-processing bias detection, in-training monitoring, and post-deployment auditing with statistical tests and fairness metrics.",
//             category: "Detection Framework"
//           },
//           {
//             id: "3",
//             question: "Which domains showed the most bias issues in the case studies?",
//             answer: "Hiring algorithms, medical diagnosis systems, and loan approval processes were the primary domains analyzed.",
//             category: "Case Studies"
//           },
//           {
//             id: "4",
//             question: "What improvement in fairness metrics was observed when applying the framework?",
//             answer: "15-30% improvement in fairness metrics across different applications and use cases.",
//             category: "Results"
//           },
//           {
//             id: "5",
//             question: "Why do AI systems perpetuate societal biases?",
//             answer: "They often amplify existing biases present in training data or inherit assumptions from algorithmic design, leading to unfair outcomes for marginalized groups.",
//             category: "Core Problems"
//           }
//         ]
//       }
//     }
//   ]);

//   const [inputValue, setInputValue] = useState("");

//   const handleSendMessage = () => {
//     if (!inputValue.trim()) return;

//     const newMessage: Message = {
//       id: Date.now().toString(),
//       type: "user",
//       content: inputValue,
//       timestamp: new Date()
//     };

//     setMessages([...messages, newMessage]);
//     setInputValue("");

//     // Simulate AI response
//     setTimeout(() => {
//       const aiResponse: Message = {
//         id: (Date.now() + 1).toString(),
//         type: "assistant", 
//         content: "I'd be happy to help you with that! Let me analyze your request and provide a detailed response.",
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, aiResponse]);
//     }, 1000);
//   };

//   const formatTimestamp = (date: Date) => {
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / (1000 * 60));
    
//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
//     return date.toLocaleDateString();
//   };

//   const renderMessage = (message: Message) => {
//     if (message.type === "block") {
//       switch (message.blockType) {
//         case "document":
//           return <DocumentPreview key={message.id} data={message.blockData} />;
//         case "summary":
//           return <SummaryBlock key={message.id} data={message.blockData} />;
//         case "flashcards":
//           return <FlashcardsBlock key={message.id} data={message.blockData} />;
//         default:
//           return null;
//       }
//     }

//     const isUser = message.type === "user";
    
//     return (
//       <div 
//         key={message.id}
//         className={`flex gap-3 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
//       >
//         {!isUser && (
//           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
//             <Bot className="h-4 w-4 text-white" />
//           </div>
//         )}
        
//         <div className={`
//           max-w-[80%] rounded-lg px-4 py-3 
//           ${isUser 
//             ? 'chat-bubble-user text-white' 
//             : 'chat-bubble-assistant'
//           }
//         `}>
//           <p className="text-sm leading-relaxed">{message.content}</p>
//           <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-muted-foreground'}`}>
//             {formatTimestamp(message.timestamp)}
//           </div>
//         </div>

//         {isUser && (
//           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
//             <User className="h-4 w-4 text-muted-foreground" />
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col h-full bg-chat-background">
//       {/* Chat Messages */}
//       <ScrollArea className="flex-1 p-6">
//         <div className="max-w-4xl mx-auto space-y-6">
//           {messages.map(renderMessage)}
//         </div>
//       </ScrollArea>

//       {/* Input Area */}
//       <div className="border-t border-card-border bg-background p-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="flex items-center gap-3">
//             <Button variant="outline" size="icon">
//               <Paperclip className="h-4 w-4" />
//             </Button>
            
//             <div className="flex-1 relative">
//               <Input
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 placeholder="Ask about your documents..."
//                 className="pr-12"
//               />
//               <Button
//                 onClick={handleSendMessage}
//                 disabled={!inputValue.trim()}
//                 size="icon"
//                 className="absolute right-1 top-1 h-8 w-8"
//               >
//                 <Send className="h-3 w-3" />
//               </Button>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2 mt-3">
//             <Badge variant="outline" className="text-xs">
//               Tip: Upload PDFs by clicking the paperclip or dragging files here
//             </Badge>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, MessageCircle, Upload, Trash2, FileText, User, Settings, CheckCircle, ListChecks, MessageSquare, Zap } from 'lucide-react';
import axios from 'axios';

// Types
interface ChatMessage {
  type: 'user' | 'bot' | 'error' | 'system';
  message: string;
  timestamp: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  pages: number;
  uploadTime: Date;
  rawFile: File;
}

const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'llama-3-70b', name: 'Llama 3 70B' },
];

interface ChatInterfaceProps {
  onFileUpload: (files: UploadedFile[]) => void;
  onFileRemove: (id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onFileUpload,
  onFileRemove,
}) => {
  // Chat state
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<'chat' | 'mcp'>('chat');

  // File upload state
  const [dragActive, setDragActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track uploaded file names to prevent duplicates
  const uploadedFileNamesRef = useRef<Set<string>>(new Set());

  // Initialize session
  useEffect(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Load chat history from localStorage when mode changes
  useEffect(() => {
    const loadChatHistory = () => {
      const savedHistory = localStorage.getItem(`chatHistory_${mode}`);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          const historyWithDates = parsedHistory.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setChatHistory(historyWithDates);
        } catch (e) {
          console.error('Failed to parse chat history from localStorage', e);
          setChatHistory([]);
        }
      } else {
        setChatHistory([]);
      }
    };

    loadChatHistory();
  }, [mode]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      try {
        const serializableHistory = chatHistory.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        }));
        localStorage.setItem(`chatHistory_${mode}`, JSON.stringify(serializableHistory));
      } catch (e) {
        console.error('Failed to save chat history to localStorage', e);
      }
    }
  }, [chatHistory, mode]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // File handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    );
    if (droppedFiles.length > 0) {
      handleFilesSelected(droppedFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pdfFiles = Array.from(e.target.files).filter(
        (file) => file.type === 'application/pdf'
      );
      handleFilesSelected(pdfFiles);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    const newFiles = files.filter(file => !uploadedFileNamesRef.current.has(file.name));
    
    if (newFiles.length === 0) return;

    const newMessages = newFiles.map(file => ({
      type: 'system' as const,
      message: `Uploading ${file.name}...`,
      timestamp: new Date(),
    }));
    setChatHistory(prev => [...prev, ...newMessages]);
    
    newFiles.forEach(file => {
      uploadedFileNamesRef.current.add(file.name);
      handleUpload(file);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadingFiles(prev => ({ ...prev, [fileId]: true }));

    const formData = new FormData();
    formData.append('pdfs', file);
    formData.append('sessionId', sessionId);

    try {
      const response = await axios.post('http://localhost:3000/pdf/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newUploadedFile = {
        name: file.name,
        size: file.size,
        uploadTime: new Date(),
        id: fileId,
        pages: response.data?.pages || Math.floor(Math.random() * 50) + 1,
        rawFile: file,
      };

      setChatHistory(prev => 
        prev.map(msg => 
          msg.message === `Uploading ${file.name}...` 
            ? { ...msg, type: 'system', message: `✅ ${file.name} uploaded successfully!` } 
            : msg
        )
      );

      onFileUpload([newUploadedFile]);
      setFilesUploaded(true);
    } catch (err: any) {
      console.error('Upload error:', err);
      setChatHistory(prev => 
        prev.map(msg => 
          msg.message === `Uploading ${file.name}...` 
            ? { ...msg, type: 'error', message: `❌ Failed to upload ${file.name}` } 
            : msg
        )
      );
    } finally {
      setUploadingFiles(prev => {
        const newUploading = { ...prev };
        delete newUploading[fileId];
        return newUploading;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filesUploaded) {
      const errorMessage: ChatMessage = {
        type: 'bot',
        message: 'Please upload PDF files first before asking questions.',
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      return;
    }

    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      message: question,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      let endpoint = '';
      if (mode === 'mcp') {
        endpoint = 'http://localhost:3000/mcp/chat';
      } else {
        endpoint = 'http://localhost:3000/pdf/chat';
      }
      
      const response = await axios.post(endpoint, {
        question: question.trim(),
        sessionId,
        model: selectedModel,
      });

      const botMessage: ChatMessage = {
        type: 'bot',
        message: response.data.answer || response.data.response || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        type: 'error',
        message: mode === 'mcp' 
          ? 'MCP server error. Please try again.' 
          : 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    localStorage.removeItem(`chatHistory_${mode}`);
    uploadedFileNamesRef.current.clear();
    setFilesUploaded(false);
  };

  const handleModeChange = (newMode: 'chat' | 'mcp') => {
    if (newMode !== mode) {
      setMode(newMode);
    }
  };

  const saveChatHistory = async () => {
    try {
      const chatText = chatHistory
        .map((msg) => {
          const time = msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString() : msg.timestamp;
          return `[${msg.type.toUpperCase()} @ ${time}]: ${msg.message}`;
        })
        .join('\n');

      await axios.post('http://localhost:3000/huffman/encode', {
        text: chatText,
        userId: '687aa9b887f6c83551ae3764',
      });
      // Show success toast instead of alert
      const successMsg: ChatMessage = {
        type: 'system',
        message: '✅ Chat history saved successfully!',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, successMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        type: 'error',
        message: '❌ Failed to save chat history.',
        timestamp: new Date(),
      };
      setChatHistory(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-background rounded-xl border border-border overflow-hidden relative transition-all duration-300">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            mode === 'mcp' 
              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
              : 'bg-gradient-to-r from-purple-500 to-blue-500'
          }`}>
            {mode === 'mcp' ? <Zap className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {mode === 'mcp' ? 'MCP Assistant' : 'AI Assistant'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === 'mcp' ? 'Connected to MCP Server' : 'Powered by Advanced AI'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearChat}
            className="flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Clear
          </button>
          <button
            onClick={saveChatHistory}
            className="flex items-center justify-center bg-primary hover:bg-primary-hover text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            <FileText className="w-4 h-4 mr-1.5" /> Save
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="p-3 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-foreground">Mode:</span>
            <div className="flex rounded-lg border border-input overflow-hidden bg-background/50 backdrop-blur-sm">
              <button
                onClick={() => handleModeChange('chat')}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  mode === 'chat'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent text-foreground hover:bg-accent/50'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Chat
              </button>
              <button
                onClick={() => handleModeChange('mcp')}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  mode === 'mcp'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                    : 'bg-transparent text-foreground hover:bg-accent/50'
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                MCP
              </button>
            </div>
          </div>
          <span className="text-sm text-muted-foreground max-w-md text-right">
            {mode === 'chat' 
              ? 'Ask questions about your documents with AI' 
              : 'Connect to MCP server for specialized processing'}
          </span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              mode === 'mcp' 
                ? 'bg-gradient-to-r from-orange-100 to-red-100' 
                : 'bg-gradient-to-r from-purple-100 to-blue-100'
            }`}>
              {mode === 'mcp' ? (
                <Zap className="w-8 h-8 text-orange-600" />
              ) : (
                <MessageCircle className="w-8 h-8 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {mode === 'chat' ? 'Ready to help!' : 'MCP Server Ready!'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {mode === 'chat' 
                ? 'Upload PDF documents and start asking questions about their content.' 
                : 'Upload documents and send requests to the MCP server for specialized processing.'}
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
              <Upload className="w-3 h-3" />
              <span>Drag & drop PDF files or click the upload button</span>
            </div>
          </div>
        ) : (
          chatHistory.map((chat, index) => (
            <div
              key={`${mode}-${index}`}
              className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[85%] ${
                  chat.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    chat.type === 'user'
                      ? 'bg-chat-message-user'
                      : chat.type === 'error'
                      ? 'bg-destructive/10'
                      : chat.type === 'system'
                      ? 'bg-muted/50'
                      : mode === 'mcp'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500'
                  }`}
                >
                  {chat.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : chat.type === 'error' ? (
                    <Trash2 className="w-4 h-4 text-destructive" />
                  ) : chat.type === 'system' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : mode === 'mcp' ? (
                    <Zap className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-xl text-sm leading-relaxed ${
                    chat.type === 'user'
                      ? 'bg-chat-message-user text-foreground'
                      : chat.type === 'error'
                      ? 'bg-destructive/10 text-destructive border border-destructive/20'
                      : chat.type === 'system'
                      ? 'bg-muted/30 text-foreground border border-muted/50'
                      : 'bg-chat-message-assistant text-foreground border border-chat-bubble-border'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{chat.message}</div>
                  <div
                    className={`text-xs mt-2 ${
                      chat.type === 'user'
                        ? 'text-chat-message-user/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {loading && chatHistory.length > 0 && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                mode === 'mcp' 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                  : 'bg-gradient-to-r from-purple-500 to-blue-500'
              }`}>
                {mode === 'mcp' ? <Zap className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className="bg-chat-message-assistant text-foreground px-4 py-3 rounded-xl border border-chat-bubble-border">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {mode === 'chat' ? 'Thinking...' : 'Processing with MCP...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-border bg-surface">
        {/* Model Selector Dropdown */}
        {showModelSelector && mode === 'chat' && (
          <div className="mb-3 p-3 bg-background/80 backdrop-blur-sm rounded-xl border border-input shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-2">
              Select AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full text-sm bg-background/90 border border-input rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              onBlur={() => setShowModelSelector(false)}
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                mode === 'chat' 
                  ? "Ask about your documents..." 
                  : "Send request to MCP server..."
              }
              className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background/90 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 placeholder:text-muted-foreground/70 transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading}
            />
            <div className="absolute right-3 bottom-3 flex space-x-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all duration-200"
                title="Attach files"
              >
                <Upload className="w-4 h-4" />
              </button>
              {mode === 'chat' && (
                <button
                  type="button"
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all duration-200"
                  title="Select model"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-primary hover:bg-primary-hover text-primary-foreground p-3 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-3 text-xs text-muted-foreground text-center">
          {mode === 'chat' 
            ? 'Press Enter to send • Shift+Enter for new line' 
            : 'Press Enter to send to MCP server'}
        </div>
      </div>

      {/* Drag and Drop Overlay */}
      {dragActive && (
        <div
          className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-xl z-10 flex items-center justify-center backdrop-blur-sm"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center p-6 bg-background/90 backdrop-blur-sm rounded-xl border border-primary shadow-lg">
            <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-lg font-medium text-foreground mb-1">Drop PDFs here</p>
            <p className="text-sm text-muted-foreground">Release to upload your documents</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;