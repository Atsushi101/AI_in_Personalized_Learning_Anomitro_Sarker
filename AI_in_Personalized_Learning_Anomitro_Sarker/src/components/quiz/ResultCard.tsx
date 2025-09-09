import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Question, Response } from '@/types/quiz';
import { AdaptiveEngine } from '@/utils/adaptiveEngine';
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw } from 'lucide-react';

interface ResultCardProps {
  question: Question;
  response: Response;
  feedback: string;
  onContinue: () => void;
  learnerState: string;
}

export const ResultCard = ({ 
  question, 
  response, 
  feedback, 
  onContinue, 
  learnerState 
}: ResultCardProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <Card className={`
      w-full max-w-3xl mx-auto shadow-quiz transition-all duration-500
      ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      ${response.correct ? 'border-success/30' : 'border-error/30'}
    `}>
      <CardHeader className="text-center space-y-4">
        <div className={`
          mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
          ${response.correct 
            ? 'bg-success text-success-foreground animate-pulse-success' 
            : 'bg-error text-error-foreground animate-shake'
          }
        `}>
          {response.correct 
            ? <CheckCircle className="h-8 w-8" />
            : <XCircle className="h-8 w-8" />
          }
        </div>
        
        <CardTitle className={`text-2xl ${response.correct ? 'text-success' : 'text-error'}`}>
          {response.correct ? 'Correct!' : 'Not Quite'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            {question.question}
          </p>
          
          <div className="grid gap-3 mb-6">
            {question.choices.map((choice, index) => {
              const isSelected = choice === response.selectedAnswer;
              const isCorrect = choice === question.answer;
              
              return (
                <div
                  key={index}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200
                    ${isCorrect 
                      ? 'border-success bg-success-light text-success-foreground' 
                      : isSelected 
                        ? 'border-error bg-error-light text-error-foreground'
                        : 'border-border bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                      ${isCorrect 
                        ? 'border-success bg-success text-success-foreground' 
                        : isSelected
                          ? 'border-error bg-error text-error-foreground'
                          : 'border-muted-foreground'
                      }
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{choice}</span>
                    {isCorrect && <CheckCircle className="h-5 w-5 text-success" />}
                    {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-error" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-foreground leading-relaxed">{feedback}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{response.responseTime.toFixed(1)}s</span>
            </div>
            <Badge variant="secondary">
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Badge>
          </div>
          
          <Badge 
            className={
              learnerState === 'struggling' ? 'bg-error/10 text-error' :
              learnerState === 'advanced' ? 'bg-success/10 text-success' :
              'bg-primary/10 text-primary'
            }
            variant="secondary"
          >
            {learnerState.charAt(0).toUpperCase() + learnerState.slice(1)} Level
          </Badge>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={onContinue}
            className="bg-gradient-primary hover:opacity-90 px-8 flex items-center gap-2"
          >
            Continue Learning
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};