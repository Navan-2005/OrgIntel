import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  Trash2, 
  Edit3,
  FileText,
  BookOpen,
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  type: "chat" | "summary" | "flashcards";
  messageCount: number;
}

interface ChatSidebarProps {
  collapsed: boolean;
}

export const ChatSidebar = ({ collapsed }: ChatSidebarProps) => {
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "AI Ethics Research Paper",
      preview: "Analyzed a 50-page research paper on AI ethics and bias detection...",
      timestamp: "2 hours ago",
      type: "summary",
      messageCount: 8
    },
    {
      id: "2", 
      title: "Machine Learning Flashcards",
      preview: "Created 25 flashcards covering supervised learning algorithms...",
      timestamp: "1 day ago",
      type: "flashcards",
      messageCount: 15
    },
    {
      id: "3",
      title: "Product Requirements Doc",
      preview: "Summary of feature specifications for mobile app redesign...",
      timestamp: "3 days ago", 
      type: "chat",
      messageCount: 12
    }
  ]);

  const [activeConversation, setActiveConversation] = useState("1");

  const getTypeIcon = (type: Conversation["type"]) => {
    switch (type) {
      case "summary": return <FileText className="h-4 w-4" />;
      case "flashcards": return <BookOpen className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Conversation["type"]) => {
    switch (type) {
      case "summary": return "bg-accent-light text-accent-foreground";
      case "flashcards": return "bg-primary/10 text-primary";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <aside className={`
      ${collapsed ? 'w-0' : 'w-80'} 
      transition-all duration-300 ease-smooth 
      bg-sidebar border-r border-sidebar-border
      flex flex-col overflow-hidden
    `}>
      {!collapsed && (
        <>
          {/* New Chat Button */}
          <div className="p-4 border-b border-sidebar-border">
            <Button 
              className="w-full justify-start gap-3 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`
                    group relative rounded-lg p-3 cursor-pointer transition-all duration-200
                    hover:bg-sidebar-hover
                    ${activeConversation === conversation.id 
                      ? 'bg-sidebar-active border border-primary/20' 
                      : 'border border-transparent'
                    }
                  `}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {getTypeIcon(conversation.type)}
                      <h3 className="font-medium text-sm truncate">
                        {conversation.title}
                      </h3>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem>
                          <Edit3 className="h-3 w-3 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Preview */}
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {conversation.preview}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${getTypeColor(conversation.type)}`}>
                      {conversation.type}
                    </Badge>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {conversation.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center">
              {conversations.length} conversations
            </div>
          </div>
        </>
      )}
    </aside>
  );
};