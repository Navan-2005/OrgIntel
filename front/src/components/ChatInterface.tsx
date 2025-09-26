import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  FileText,
  BookOpen,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { SummaryBlock } from "@/components/blocks/SummaryBlock";
import { FlashcardsBlock } from "@/components/blocks/FlashcardsBlock";
import { DocumentPreview } from "@/components/blocks/DocumentPreview";

interface Message {
  id: string;
  type: "user" | "assistant" | "block";
  content: string;
  timestamp: Date;
  blockType?: "summary" | "flashcards" | "document";
  blockData?: any;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "user",
      content: "I've uploaded my research paper on AI ethics. Can you help me understand it?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: "2",
      type: "block",
      content: "",
      timestamp: new Date(Date.now() - 9 * 60 * 1000),
      blockType: "document",
      blockData: {
        title: "AI Ethics and Bias Detection in Machine Learning Systems",
        pages: 42,
        fileType: "PDF",
        uploadedAt: new Date(Date.now() - 9 * 60 * 1000)
      }
    },
    {
      id: "3",
      type: "assistant", 
      content: "I've processed your research paper! It's a comprehensive 42-page study on AI ethics and bias detection. I can help you in several ways:",
      timestamp: new Date(Date.now() - 9 * 60 * 1000)
    },
    {
      id: "4",
      type: "user",
      content: "Please create a summary of the key findings",
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: "5",
      type: "block",
      content: "",
      timestamp: new Date(Date.now() - 7 * 60 * 1000),
      blockType: "summary",
      blockData: {
        title: "AI Ethics Research - Key Findings",
        tldr: "The paper identifies three major sources of bias in ML systems: data bias, algorithmic bias, and deployment bias. It proposes a framework for detecting and mitigating these biases throughout the ML lifecycle.",
        sections: [
          {
            title: "Introduction & Problem Statement",
            content: "AI systems increasingly impact critical decisions in healthcare, finance, and criminal justice. However, these systems often perpetuate or amplify existing societal biases, leading to unfair outcomes for marginalized groups."
          },
          {
            title: "Types of Bias Identified", 
            content: "1. Data Bias: Underrepresentation in training data\n2. Algorithmic Bias: Inherent model assumptions\n3. Deployment Bias: Context-specific implementation issues"
          },
          {
            title: "Proposed Detection Framework",
            content: "A three-stage approach: pre-processing bias detection, in-training monitoring, and post-deployment auditing. Includes statistical tests and fairness metrics."
          },
          {
            title: "Case Studies",
            content: "Analysis of bias in hiring algorithms, medical diagnosis systems, and loan approval processes. Shows 15-30% improvement in fairness metrics when framework is applied."
          }
        ]
      }
    },
    {
      id: "6",
      type: "user",
      content: "This is great! Can you also create flashcards to help me study these concepts?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: "7",
      type: "block",
      content: "",
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      blockType: "flashcards",
      blockData: {
        title: "AI Ethics & Bias Detection - Study Cards",
        totalCount: 8,
        flashcards: [
          {
            id: "1",
            question: "What are the three main types of bias identified in ML systems?",
            answer: "Data bias (underrepresentation in training data), Algorithmic bias (inherent model assumptions), and Deployment bias (context-specific implementation issues).",
            category: "Bias Types"
          },
          {
            id: "2", 
            question: "What is the three-stage bias detection framework proposed in the paper?",
            answer: "Pre-processing bias detection, in-training monitoring, and post-deployment auditing with statistical tests and fairness metrics.",
            category: "Detection Framework"
          },
          {
            id: "3",
            question: "Which domains showed the most bias issues in the case studies?",
            answer: "Hiring algorithms, medical diagnosis systems, and loan approval processes were the primary domains analyzed.",
            category: "Case Studies"
          },
          {
            id: "4",
            question: "What improvement in fairness metrics was observed when applying the framework?",
            answer: "15-30% improvement in fairness metrics across different applications and use cases.",
            category: "Results"
          },
          {
            id: "5",
            question: "Why do AI systems perpetuate societal biases?",
            answer: "They often amplify existing biases present in training data or inherit assumptions from algorithmic design, leading to unfair outcomes for marginalized groups.",
            category: "Core Problems"
          }
        ]
      }
    }
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant", 
        content: "I'd be happy to help you with that! Let me analyze your request and provide a detailed response.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const renderMessage = (message: Message) => {
    if (message.type === "block") {
      switch (message.blockType) {
        case "document":
          return <DocumentPreview key={message.id} data={message.blockData} />;
        case "summary":
          return <SummaryBlock key={message.id} data={message.blockData} />;
        case "flashcards":
          return <FlashcardsBlock key={message.id} data={message.blockData} />;
        default:
          return null;
      }
    }

    const isUser = message.type === "user";
    
    return (
      <div 
        key={message.id}
        className={`flex gap-3 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
        )}
        
        <div className={`
          max-w-[80%] rounded-lg px-4 py-3 
          ${isUser 
            ? 'chat-bubble-user text-white' 
            : 'chat-bubble-assistant'
          }
        `}>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-muted-foreground'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-chat-background">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(renderMessage)}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-card-border bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about your documents..."
                className="pr-12"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              Tip: Upload PDFs by clicking the paperclip or dragging files here
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};