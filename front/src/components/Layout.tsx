import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/ChatSidebar";
import ChatInterface from '@/components/ChatInterface';
import { DocumentsPanel } from "@/components/DocumentsPanel";
import { Button } from "@/components/ui/button";
import { Menu, PanelRight, PanelLeft } from "lucide-react";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  
  // State to manage uploaded documents
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Handle file upload from ChatInterface
  const handleFileUpload = (uploadedFiles: any[]) => {
    setDocuments(prev => [...prev, ...uploadedFiles]);
  };

  // Handle file removal from ChatInterface or DocumentsPanel
  const handleFileRemove = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    if (selectedDocumentId === id) {
      setSelectedDocumentId(null);
    }
  };

  // Handle document preview
  const handlePreviewDocument = (id: string) => {
    setSelectedDocumentId(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <div className="flex h-screen w-full">
          {/* Header with Sidebar Toggles */}
          <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center bg-background/80 backdrop-blur-sm border-b border-card-border">
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
                className="h-8 w-8"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">History</span>
            </div>
            
            <div className="flex-1 flex justify-center">
              <h1 className="text-lg font-semibold gradient-text">Notebook LLM</h1>
            </div>
            
            <div className="flex items-center gap-2 mr-4">
              <span className="text-xs text-muted-foreground">Documents</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
                className="h-8 w-8"
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            </div>
          </header>

          <div className="flex w-full pt-14">
            {/* Left Sidebar - Chat History */}
            <ChatSidebar collapsed={leftSidebarCollapsed} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
              {children || (
                <ChatInterface 
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleFileRemove}
                />
              )}
            </main>

            {/* Right Sidebar - Documents */}
            <DocumentsPanel 
              collapsed={rightSidebarCollapsed} 
              onToggle={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
              onRemoveDocument={handleFileRemove}
              onPreviewDocument={handlePreviewDocument}
              selectedDocumentId={selectedDocumentId}
            />
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;