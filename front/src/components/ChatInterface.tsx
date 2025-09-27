import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Bot,
  MessageCircle,
  Upload,
  Trash2,
  FileText,
  User,
  Settings,
  CheckCircle,
  MessageSquare,
  Zap,
  X,
  Eye,
  File,
  Users,
  Wifi,
  WifiOff,
  Hash,
  Copy,
  Link,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
  removeListener,
  disconnectSocket,
  isConnected,
} from '../config/socket';
import axios from 'axios';

// Types
interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system' | 'error';
  message: string;
  timestamp: Date;
  sender?: {
    _id: string;
    email: string;
  };
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  pages: number;
  uploadTime: Date;
  rawFile: File;
  previewUrl?: string;
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

const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onFileUpload, onFileRemove }) => {
  const { user } = useSelector((state: any) => state.user);
  const userRole = user?.role;
  const userEmail = user?.email || `User-${Date.now()}`;

  // Room state
  const [roomId, setRoomId] = useState<string>('');
  const [joinRoomInput, setJoinRoomInput] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mode state
  const [mode, setMode] = useState<'chat' | 'mcp'>('chat');

  // Socket state
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [aiLoading, setAiLoading] = useState(false);

  // Chat state
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);

  // File upload state
  const [dragActive, setDragActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileNamesRef = useRef<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize session
  useEffect(() => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
  }, []);

  // Load chat history from localStorage (per mode + room)
  useEffect(() => {
    const key = roomId ? `chatHistory_${mode}_${roomId}` : `chatHistory_${mode}_default`;
    const savedHistory = localStorage.getItem(key);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const historyWithDates = parsedHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setChatHistory(historyWithDates);
      } catch (e) {
        console.error('Failed to parse chat history', e);
        setChatHistory([]);
      }
    } else {
      setChatHistory([]);
    }
  }, [mode, roomId]);

  // Save chat history to localStorage
  useEffect(() => {
    if (chatHistory.length > 0) {
      const key = roomId ? `chatHistory_${mode}_${roomId}` : `chatHistory_${mode}_default`;
      try {
        const serializableHistory = chatHistory.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }));
        localStorage.setItem(key, JSON.stringify(serializableHistory));
      } catch (e) {
        console.error('Failed to save chat history', e);
      }
    }
  }, [chatHistory, mode, roomId]);

  // Socket setup — ONLY for 'chat' mode
  useEffect(() => {
    if (mode !== 'chat' || !roomId) return;

    const socket = initializeSocket(userEmail, roomId);
    setIsSocketConnected(isConnected());

    const connectHandler = () => {
      setIsSocketConnected(true);
      console.log('Connected to room:', roomId);
      sendMessage('join-room', { roomId, userEmail });
    };

    const disconnectHandler = () => {
      setIsSocketConnected(false);
    };

    const chatMessageHandler = (messageData: ChatMessage) => {
      const messageWithDate = {
        ...messageData,
        timestamp: new Date(messageData.timestamp),
      };
      setChatHistory((prev) => [...prev, messageWithDate]);
    };

    const userJoinedHandler = ({ user, totalUsers }: { user: any; totalUsers: number }) => {
      setUserCount(totalUsers);
      const systemMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        type: 'system',
        message: `🟢 ${user.email} joined the room`,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, systemMsg]);
    };

    const userLeftHandler = ({ user, totalUsers }: { user: any; totalUsers: number }) => {
      setUserCount(totalUsers);
      const systemMsg: ChatMessage = {
        id: `system-${Date.now()}`,
        type: 'system',
        message: `🔴 ${user.email} left the room`,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, systemMsg]);
    };

    const userCountHandler = (count: number) => {
      setUserCount(count);
    };

    const userTypingHandler = ({ user, isTyping }: { user: any; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(user.email);
        } else {
          newSet.delete(user.email);
        }
        return newSet;
      });
    };

    const chatErrorHandler = (error: { message: string }) => {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        message: `❌ ${error.message}`,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    };

    receiveMessage('connect', connectHandler);
    receiveMessage('disconnect', disconnectHandler);
    receiveMessage('chat-message', chatMessageHandler);
    receiveMessage('user-joined', userJoinedHandler);
    receiveMessage('user-left', userLeftHandler);
    receiveMessage('user-count', userCountHandler);
    receiveMessage('user-typing', userTypingHandler);
    receiveMessage('chat-error', chatErrorHandler);

    return () => {
      removeListener('connect', connectHandler);
      removeListener('disconnect', disconnectHandler);
      removeListener('chat-message', chatMessageHandler);
      removeListener('user-joined', userJoinedHandler);
      removeListener('user-left', userLeftHandler);
      removeListener('user-count', userCountHandler);
      removeListener('user-typing', userTypingHandler);
      removeListener('chat-error', chatErrorHandler);
      disconnectSocket();
    };
  }, [userEmail, mode, roomId]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [uploadedFiles]);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Room actions
  const createRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setIsCreatingRoom(false);
    setCopied(false);
  };

  const joinRoom = () => {
    if (joinRoomInput.trim()) {
      setRoomId(joinRoomInput.trim().toUpperCase());
      setJoinRoomInput('');
      setCopied(false);
    }
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // File handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (userRole === 'junior') return;
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

    if (userRole === 'junior') {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        message: '❌ You do not have permission to upload documents. Contact a senior user.',
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type === 'application/pdf');
    if (droppedFiles.length > 0) {
      handleFilesSelected(droppedFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const pdfFiles = Array.from(e.target.files).filter((file) => file.type === 'application/pdf');
      handleFilesSelected(pdfFiles);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (userRole === 'junior') {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        message: '❌ You do not have permission to upload documents. Contact a senior user.',
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
      return;
    }

    const newFiles = files.filter((file) => !uploadedFileNamesRef.current.has(file.name));
    if (newFiles.length === 0) return;

    const newMessages = newFiles.map((file) => ({
      id: `system-${Date.now()}-${file.name}`,
      type: 'system' as const,
      message: `Uploading ${file.name}...`,
      timestamp: new Date(),
    }));
    setChatHistory((prev) => [...prev, ...newMessages]);

    newFiles.forEach((file) => {
      uploadedFileNamesRef.current.add(file.name);
      handleUpload(file);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    setUploadingFiles((prev) => ({ ...prev, [fileId]: true }));

    const previewUrl = URL.createObjectURL(file);

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
        previewUrl,
      };

      setUploadedFiles((prev) => [...prev, newUploadedFile]);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.message === `Uploading ${file.name}...`
            ? { ...msg, type: 'system', message: `✅ ${file.name} uploaded successfully!` }
            : msg
        )
      );

      onFileUpload([newUploadedFile]);
      setFilesUploaded(true);
    } catch (err: any) {
      console.error('Upload error:', err);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.message === `Uploading ${file.name}...`
            ? { ...msg, type: 'error', message: `❌ Failed to upload ${file.name}` }
            : msg
        )
      );
      URL.revokeObjectURL(previewUrl);
    } finally {
      setUploadingFiles((prev) => {
        const newUploading = { ...prev };
        delete newUploading[fileId];
        return newUploading;
      });
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove && fileToRemove.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== fileId);
    });

    uploadedFileNamesRef.current.delete(uploadedFiles.find((f) => f.id === fileId)?.name || '');

    onFileRemove(fileId);

    if (uploadedFiles.length === 1) {
      setFilesUploaded(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const trimmedMessage = message.trim();

    if (mode === 'mcp') {
      // MCP Mode: Direct HTTP
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        message: trimmedMessage,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, userMessage]);
      setMessage('');
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:3000/mcp/chat', {
          message: trimmedMessage,
          userId: user?._id || 'anonymous',
        });

        const botMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: 'ai',
          message: response.data.response || response.data.answer || "Sorry, I couldn't generate a response.",
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, botMessage]);
      } catch (err: any) {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          type: 'error',
          message: 'MCP server error. Please try again.',
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
      }
    } else {
      // Chat Mode
      if (trimmedMessage.startsWith('@ai')) {
        if (!filesUploaded) {
          const errorMessage: ChatMessage = {
            id: `error-${Date.now()}`,
            type: 'error',
            message: 'Please upload PDF files first before asking AI questions.',
            timestamp: new Date(),
          };
          setChatHistory((prev) => [...prev, errorMessage]);
          setMessage('');
          return;
        }

        // ✅ Use HTTP for AI (like old code) — reliable!
        const userAiMessage: ChatMessage = {
          id: `user-${Date.now()}`,
          type: 'user',
          message: trimmedMessage,
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, userAiMessage]);
        setMessage('');
        setAiLoading(true);

        try {
          const response = await axios.post('http://localhost:3000/pdf/chat', {
            question: trimmedMessage.substring(3).trim(),
            sessionId,
            model: selectedModel,
          });

          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            type: 'ai',
            message: response.data.answer || response.data.response || "Sorry, I couldn't generate a response.",
            timestamp: new Date(),
          };
          setChatHistory((prev) => [...prev, aiMessage]);
        } catch (err: any) {
          const errorMsg: ChatMessage = {
            id: `error-${Date.now()}`,
            type: 'error',
            message: 'AI server error. Please try again.',
            timestamp: new Date(),
          };
          setChatHistory((prev) => [...prev, errorMsg]);
        } finally {
          setAiLoading(false);
        }
      } else {
        // Collaborative message (only if in a room)
        if (!roomId) {
          const errorMsg: ChatMessage = {
            id: `error-${Date.now()}`,
            type: 'error',
            message: 'Please create or join a room to send collaborative messages.',
            timestamp: new Date(),
          };
          setChatHistory((prev) => [...prev, errorMsg]);
          return;
        }

        sendMessage('chat-message', {
          message: trimmedMessage,
          roomId,
        });
        setMessage('');
      }
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (mode !== 'chat' || !roomId) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendMessage('typing', { isTyping, roomId });

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        sendMessage('typing', { isTyping: false, roomId });
      }, 2000);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    const key = roomId ? `chatHistory_${mode}_${roomId}` : `chatHistory_${mode}_default`;
    localStorage.removeItem(key);
    uploadedFileNamesRef.current.clear();
    setFilesUploaded(false);
    setUploadedFiles([]);
  };

  const handleModeChange = (newMode: 'chat' | 'mcp') => {
    if (newMode !== mode) {
      setMode(newMode);
    }
  };

  const isOwnMessage = (msg: ChatMessage) => {
    return msg.type === 'user';
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-xl border border-border overflow-hidden relative transition-all duration-300">
      {/* Room Controls */}
      <div className="p-3 border-b border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Room</span>
          </div>

          {!roomId ? (
            <div className="flex space-x-2">
              <button
                onClick={createRoom}
                disabled={isCreatingRoom}
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              >
                {isCreatingRoom ? 'Creating...' : 'Create Room'}
              </button>
              <div className="flex">
                <input
                  type="text"
                  value={joinRoomInput}
                  onChange={(e) => setJoinRoomInput(e.target.value.toUpperCase())}
                  placeholder="Enter room ID"
                  className="border border-input rounded-l-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={joinRoom}
                  disabled={!joinRoomInput.trim()}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-3 py-1.5 rounded-r-lg text-sm font-medium disabled:opacity-50"
                >
                  Join
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-muted/30 px-3 py-1.5 rounded-lg text-sm font-mono">
                {roomId}
              </div>
              <button
                onClick={copyRoomId}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50"
                title="Copy room ID"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setRoomId('')}
                className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-accent/50"
                title="Leave room"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              mode === 'mcp'
                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-purple-500 to-blue-500'
            }`}
          >
            {mode === 'mcp' ? <Zap className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{mode === 'mcp' ? 'MCP Assistant' : 'AI Assistant'}</h3>
            {mode === 'chat' && roomId && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5">
                {isSocketConnected ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" /> <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-red-500" /> <span>Disconnected</span>
                  </>
                )}
                <span>•</span>
                <Users className="w-3 h-3" />
                <span>{userCount} in room</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearChat}
            className="flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-4 h-4 mr-1.5" /> Clear
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
              ? roomId
                ? 'Collaborate in real-time. Use @ai for AI.'
                : 'Create or join a room to collaborate.'
              : 'Send any request to MCP server (no document needed).'}
          </span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <div className="text-center py-12">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                mode === 'mcp'
                  ? 'bg-gradient-to-r from-orange-100 to-red-100'
                  : 'bg-gradient-to-r from-purple-100 to-blue-100'
              }`}
            >
              {mode === 'mcp' ? <Zap className="w-8 h-8 text-orange-600" /> : <MessageCircle className="w-8 h-8 text-primary" />}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {mode === 'chat' ? 'Ready to help!' : 'MCP Server Ready!'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              {mode === 'chat'
                ? roomId
                  ? 'Upload PDFs and ask questions with @ai prefix.'
                  : 'Create or join a room to start collaborating.'
                : 'Send any request to the MCP server.'}
            </p>
            {mode === 'chat' && roomId && (!user || userRole !== 'junior') && (
              <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Upload className="w-3 h-3" />
                <span>Drag & drop PDFs or click upload</span>
              </div>
            )}
            {mode === 'chat' && roomId && userRole === 'junior' && (
              <div className="mt-2 text-xs text-muted-foreground">Contact a senior user to upload documents.</div>
            )}
          </div>
        ) : (
          chatHistory.map((chat, index) => {
            const isOwn = isOwnMessage(chat);
            return (
              <div
                key={`${chat.id}-${index}`}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[85%] ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      chat.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : chat.type === 'error'
                        ? 'bg-destructive/10'
                        : chat.type === 'system'
                        ? 'bg-muted/30'
                        : mode === 'mcp'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}
                  >
                    {chat.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : chat.type === 'error' ? (
                      <X className="w-4 h-4 text-destructive" />
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
                        ? 'bg-primary text-primary-foreground'
                        : chat.type === 'error'
                        ? 'bg-destructive/10 text-destructive border border-destructive/20'
                        : chat.type === 'system'
                        ? 'bg-muted/30 text-foreground border border-muted/50'
                        : 'bg-muted/10 text-foreground border border-muted/20'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{chat.message}</div>
                    <div className="text-xs mt-2 opacity-70">
                      {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* MCP Loading */}
        {loading && mode === 'mcp' && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted/10 text-foreground px-4 py-3 rounded-xl border border-muted/20">
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
                  <span className="text-sm font-medium">Processing with MCP...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat AI Loading */}
        {aiLoading && mode === 'chat' && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted/10 text-foreground px-4 py-3 rounded-xl border border-muted/20">
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
                  <span className="text-sm font-medium">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {mode === 'chat' && roomId && typingUsers.size > 0 && !aiLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/30">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="bg-muted/30 text-foreground px-4 py-3 rounded-xl border border-muted/50">
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
                    {typingUsers.size === 1
                      ? `${Array.from(typingUsers)[0]} is typing...`
                      : `${typingUsers.size} users are typing...`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* File Attachments Bar */}
      {mode === 'chat' && roomId && uploadedFiles.length > 0 && (
        <div className="p-3 border-t border-border bg-surface/50">
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center bg-muted/30 hover:bg-muted/50 rounded-lg px-2.5 py-1.5 text-xs transition-colors group"
              >
                <File className="w-3.5 h-3.5 text-muted-foreground mr-1.5 flex-shrink-0" />
                <span className="max-w-[120px] truncate text-foreground mr-1.5">{file.name}</span>
                <button
                  onClick={() => setPreviewFile(file)}
                  className="text-muted-foreground hover:text-foreground p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Preview"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-muted-foreground hover:text-destructive p-0.5 rounded ml-1"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-border bg-surface">
        {/* Model Selector */}
        {showModelSelector && mode === 'chat' && roomId && (
          <div className="mb-3 p-3 bg-background/80 backdrop-blur-sm rounded-xl border border-input shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-2">Select AI Model</label>
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
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (mode === 'chat' && roomId) handleTyping(e.target.value.length > 0);
              }}
              onBlur={() => mode === 'chat' && roomId && handleTyping(false)}
              placeholder={
                mode === 'chat'
                  ? roomId
                    ? 'Type @ai for AI answers, or chat normally...'
                    : 'Join a room to chat'
                  : 'Send request to MCP server...'
              }
              className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background/90 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-20 placeholder:text-muted-foreground/70 transition-all duration-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading || aiLoading || (mode === 'chat' && !roomId)}
            />
            <div className="absolute right-3 bottom-3 flex space-x-2">
              {mode === 'chat' && roomId && userRole !== 'junior' && (
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50 transition-all duration-200"
                  title="Attach files"
                >
                  <Upload className="w-4 h-4" />
                </button>
              )}
              {mode === 'chat' && roomId && (
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
            disabled={loading || aiLoading || !message.trim() || (mode === 'chat' && !roomId)}
            className="bg-primary hover:bg-primary-hover text-primary-foreground p-3 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-3 text-xs text-muted-foreground text-center">
          {mode === 'chat'
            ? roomId
              ? 'Press Enter to send • Shift+Enter for new line • Use @ai for AI'
              : 'Create or join a room to start chatting'
            : 'Press Enter to send to MCP server'}
        </div>
      </div>

      {/* Drag and Drop Overlay */}
      {mode === 'chat' && roomId && dragActive && userRole !== 'junior' && (
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

      {/* PDF Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-medium text-foreground truncate">{previewFile.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(previewFile.size)} • {previewFile.pages} pages
                </span>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1.5 rounded-full hover:bg-accent"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewFile.previewUrl}
                className="w-full h-full"
                title={`Preview of ${previewFile.name}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;