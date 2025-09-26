import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Copy, 
  Download,
  Clock,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SummarySection {
  title: string;
  content: string;
}

interface SummaryBlockProps {
  data: {
    title: string;
    tldr: string;
    sections: SummarySection[];
  };
}

export const SummaryBlock = ({ data }: SummaryBlockProps) => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    const fullText = `${data.title}\n\nTL;DR: ${data.tldr}\n\n${data.sections.map(s => `${s.title}\n${s.content}`).join('\n\n')}`;
    navigator.clipboard.writeText(fullText);
    toast({
      description: "Summary copied to clipboard",
    });
  };

  const handleSave = () => {
    setSaved(!saved);
    toast({
      description: saved ? "Removed from saved summaries" : "Summary saved to your notes",
    });
  };

  const handleExport = () => {
    const fullText = `${data.title}\n\nTL;DR: ${data.tldr}\n\n${data.sections.map(s => `${s.title}\n${s.content}`).join('\n\n')}`;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="interactive-card p-6 my-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent-light">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{data.title}</h3>
            <Badge variant="secondary" className="mt-1">
              Summary Generated
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={`h-8 w-8 ${saved ? 'text-primary' : ''}`}
          >
            {saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExport}
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TL;DR Section */}
      <div className="bg-accent-light rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">TL;DR</Badge>
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">30 sec read</span>
        </div>
        <p className="text-sm leading-relaxed">{data.tldr}</p>
      </div>

      {/* Expand/Collapse Button */}
      <Button
        variant="ghost"
        onClick={() => setExpanded(!expanded)}
        className="w-full justify-between mb-4 h-auto py-3"
      >
        <span className="text-sm font-medium">
          {expanded ? 'Hide Detailed Breakdown' : 'Show Detailed Breakdown'}
        </span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {/* Detailed Sections */}
      {expanded && (
        <div className="space-y-4 animate-fade-in">
          <Separator />
          {data.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-base">{section.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
              {index < data.sections.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};