import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Trash2,
  MoreHorizontal,
  Calendar,
  FileIcon,
  BookOpen,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  title: string;
  fileType: string;
  pages: number;
  uploadedAt: Date;
  tags: string[];
  status: "processed" | "processing" | "error";
}

interface DocumentsPanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const DocumentsPanel = ({ collapsed, onToggle }: DocumentsPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  
  const [documents] = useState<Document[]>([
    {
      id: "1",
      title: "AI Ethics and Bias Detection in Machine Learning Systems",
      fileType: "PDF",
      pages: 42,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ["AI Ethics", "Machine Learning", "Research"],
      status: "processed"
    },
    {
      id: "2",
      title: "Deep Learning Fundamentals - Course Notes",
      fileType: "PDF", 
      pages: 156,
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ["Deep Learning", "Neural Networks", "Course"],
      status: "processed"
    },
    {
      id: "3",
      title: "Product Requirements Document - Mobile App V2.0",
      fileType: "DOCX",
      pages: 28,
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      tags: ["Product", "Requirements", "Mobile"],
      status: "processed"
    },
    {
      id: "4",
      title: "Financial Analysis Q3 2024",
      fileType: "XLSX",
      pages: 45,
      uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      tags: ["Finance", "Analysis", "Q3"],
      status: "processing"
    }
  ]);

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Just uploaded";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf": return <FileText className="h-5 w-5 text-red-500" />;
      case "docx": case "doc": return <FileIcon className="h-5 w-5 text-blue-500" />;
      case "xlsx": case "xls": return <FileIcon className="h-5 w-5 text-green-500" />;
      default: return <FileIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "processed": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    }
  };

  return (
    <aside className={`
      ${collapsed ? 'w-0' : 'w-80'} 
      transition-all duration-300 ease-smooth 
      bg-sidebar border-l border-sidebar-border
      flex flex-col overflow-hidden
    `}>
      {!collapsed && (
        <>
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Documents List */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`
                    group relative rounded-lg p-4 cursor-pointer transition-all duration-200
                    hover:bg-sidebar-hover border border-transparent
                    ${selectedDocument === doc.id 
                      ? 'bg-sidebar-active border-primary/20 shadow-sm' 
                      : 'hover:border-card-border'
                    }
                  `}
                  onClick={() => setSelectedDocument(selectedDocument === doc.id ? null : doc.id)}
                >
                  {/* Document Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 mt-1">
                      {getFileIcon(doc.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm leading-tight line-clamp-2 mb-2">
                        {doc.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.fileType}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {doc.pages} pages
                        </Badge>
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem>
                          <Eye className="h-3 w-3 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-3 w-3 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {doc.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(doc.uploadedAt)}
                    </div>
                  </div>

                  {/* Expanded Actions */}
                  {selectedDocument === doc.id && (
                    <div className="mt-3 pt-3 border-t border-card-border animate-fade-in">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Summarize
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-3 w-3 mr-1" />
                          Q&A
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{filteredDocuments.length} documents</span>
              <Button variant="ghost" size="sm" className="h-auto p-1">
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};