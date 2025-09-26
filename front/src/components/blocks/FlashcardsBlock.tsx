import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Plus,
  Shuffle,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FlashcardsBlockProps {
  data: {
    title: string;
    flashcards: Flashcard[];
    totalCount: number;
  };
}

export const FlashcardsBlock = ({ data }: FlashcardsBlockProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'sequential' | 'random'>('sequential');
  const { toast } = useToast();

  const currentCard = data.flashcards[currentIndex];
  const progress = ((currentIndex + 1) / data.flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < data.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * data.flashcards.length);
    setCurrentIndex(randomIndex);
    setFlipped(false);
    setStudyMode('random');
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setStudyMode('sequential');
  };

  const handleExport = () => {
    const csvContent = data.flashcards.map(card => 
      `"${card.question}","${card.answer}","${card.category || ''}"`
    ).join('\n');
    
    const blob = new Blob([`Question,Answer,Category\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flashcards.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      description: "Flashcards exported as CSV",
    });
  };

  return (
    <div className="interactive-card p-6 my-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{data.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {data.flashcards.length} cards
              </Badge>
              <Badge variant="outline" className="capitalize">
                {studyMode} mode
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShuffle}
            className="h-8 w-8"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
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

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Card {currentIndex + 1} of {data.flashcards.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="mb-6">
        <div 
          className={`flip-card w-full h-64 ${flipped ? 'flipped' : ''}`}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="flip-card-inner">
            {/* Front - Question */}
            <div className="flip-card-front bg-gradient-surface border border-card-border p-6 flex flex-col justify-center">
              <div className="text-center">
                <Badge variant="outline" className="mb-4">Question</Badge>
                <p className="text-lg font-medium leading-relaxed">
                  {currentCard?.question}
                </p>
                <div className="mt-6 text-sm text-muted-foreground">
                  Click to reveal answer
                </div>
              </div>
            </div>

            {/* Back - Answer */}
            <div className="flip-card-back bg-accent-light border border-card-border p-6 flex flex-col justify-center">
              <div className="text-center">
                <Badge variant="outline" className="mb-4">Answer</Badge>
                <p className="text-lg font-medium leading-relaxed">
                  {currentCard?.answer}
                </p>
                {currentCard?.category && (
                  <Badge variant="secondary" className="mt-4">
                    {currentCard.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Add card</span>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === data.flashcards.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Study Tips */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start gap-2">
          <Target className="h-4 w-4 text-accent mt-0.5" />
          <div className="text-sm">
            <span className="font-medium">Study tip:</span>
            <span className="text-muted-foreground ml-1">
              {flipped 
                ? "Take your time to understand the answer before moving on"
                : "Try to answer mentally before flipping the card"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};