import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Eye, 
  Clock,
  FileIcon,
  CheckCircle
} from "lucide-react";

interface DocumentPreviewProps {
  data: {
    title: string;
    pages: number;
    fileType: string;
    uploadedAt: Date;
  };
}

export const DocumentPreview = ({ data }: DocumentPreviewProps) => {
  const formatFileSize = (pages: number) => {
    // Estimate file size based on pages (rough calculation)
    const estimatedMB = Math.round((pages * 0.15) * 10) / 10;
    return estimatedMB > 1 ? `${estimatedMB} MB` : `${Math.round(estimatedMB * 1000)} KB`;
  };

  const formatUploadTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just uploaded";
    if (diffMins < 60) return `Uploaded ${diffMins}m ago`;
    return `Uploaded ${Math.floor(diffMins / 60)}h ago`;
  };

  return (
    <div className="interactive-card p-6 my-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center relative">
          <FileText className="h-8 w-8 text-primary" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-tight mb-2">
            {data.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {data.fileType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.pages} pages
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatFileSize(data.pages)}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatUploadTime(data.uploadedAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" className="h-8 px-3">
            <Eye className="h-3 w-3 mr-2" />
            View
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3">
            <Download className="h-3 w-3 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-800 dark:text-green-300">
            Document processed successfully
          </span>
        </div>
        <p className="text-xs text-green-700 dark:text-green-400 mt-1">
          Ready for summarization, Q&A, and flashcard generation
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-card-border">
        <div className="text-xs text-muted-foreground mb-3">Quick actions:</div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Summarize
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Create flashcards
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Extract key terms
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Ask questions
          </Button>
        </div>
      </div>
    </div>
  );
};