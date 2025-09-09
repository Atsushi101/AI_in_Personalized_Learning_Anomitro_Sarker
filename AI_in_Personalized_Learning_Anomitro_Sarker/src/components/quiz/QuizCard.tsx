import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/quiz';
import { Clock, Lightbulb, BookOpen } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  showHint: boolean;
  onAnswer: (selectedAnswer: string, responseTime: number) => void;
  onToggleHint: () => void;
}

export const QuizCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  showHint, 
  onAnswer, 
  onToggleHint 
}: QuizCardProps) => {
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [startTime] = useState<number>(Date.now());
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Shuffle choices to randomize correct answer position
  const shuffledChoices = useMemo(() => {
    const choices = [...question.choices];
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    return choices;
  }, [question.id]); // Re-shuffle only when question changes

  const handleSubmit = () => {
    if (!selectedChoice || isSubmitted) return;
    
    const responseTime = (Date.now() - startTime) / 1000;
    setIsSubmitted(true);
    onAnswer(selectedChoice, responseTime);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'hard': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-quiz transition-all duration-300 hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">
              Question {questionNumber} of {totalQuestions}
            </CardTitle>
          </div>
          <Badge className={getDifficultyColor(question.difficulty)} variant="secondary">
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>
        </div>
        
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-lg font-medium leading-relaxed">
          {question.question}
        </div>

        <div className="grid gap-3">
          {shuffledChoices.map((choice, index) => (
            <button
              key={index}
              onClick={() => setSelectedChoice(choice)}
              disabled={isSubmitted}
              className={`
                p-4 text-left rounded-lg border-2 transition-all duration-200
                hover:border-primary hover:bg-primary/5 
                ${selectedChoice === choice 
                  ? 'border-primary bg-primary/10 shadow-sm' 
                  : 'border-border bg-card'
                }
                ${isSubmitted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                  ${selectedChoice === choice 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-muted-foreground'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{choice}</span>
              </div>
            </button>
          ))}
        </div>

        {showHint && (
          <div className="bg-warning-light border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-warning-foreground mb-1">Hint</h4>
                <p className="text-sm text-warning-foreground/80">{question.hint}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={onToggleHint}
            disabled={isSubmitted}
            className="flex items-center gap-2"
          >
            <Lightbulb className="h-4 w-4" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!selectedChoice || isSubmitted}
            className="bg-gradient-primary hover:opacity-90 px-8"
          >
            Submit Answer
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Take your time to think through the problem</span>
        </div>
      </CardContent>
    </Card>
  );
};