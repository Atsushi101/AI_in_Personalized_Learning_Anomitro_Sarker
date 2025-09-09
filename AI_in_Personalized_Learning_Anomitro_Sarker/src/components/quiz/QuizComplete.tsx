import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LearnerProfile, Response } from '@/types/quiz';
import { 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  RotateCcw,
  Share
} from 'lucide-react';

interface QuizCompleteProps {
  profile: LearnerProfile;
  responses: Response[];
  onRestart: () => void;
}

export const QuizComplete = ({ profile, responses, onRestart }: QuizCompleteProps) => {
  const totalTime = responses.reduce((sum, r) => sum + r.responseTime, 0);
  const correctByDifficulty = {
    easy: responses.filter(r => r.difficulty === 'easy' && r.correct).length,
    medium: responses.filter(r => r.difficulty === 'medium' && r.correct).length,
    hard: responses.filter(r => r.difficulty === 'hard' && r.correct).length,
  };
  
  const totalByDifficulty = {
    easy: responses.filter(r => r.difficulty === 'easy').length,
    medium: responses.filter(r => r.difficulty === 'medium').length,
    hard: responses.filter(r => r.difficulty === 'hard').length,
  };

  const getPerformanceMessage = () => {
    const accuracy = profile.accuracy * 100;
    if (accuracy >= 90) return "Outstanding! You've mastered this topic!";
    if (accuracy >= 75) return "Great job! You're showing strong understanding!";
    if (accuracy >= 60) return "Good progress! Keep practicing to improve!";
    return "Nice effort! Review the concepts and try again!";
  };

  const getGrade = () => {
    const accuracy = profile.accuracy * 100;
    if (accuracy >= 90) return { grade: 'A+', color: 'text-success' };
    if (accuracy >= 80) return { grade: 'A', color: 'text-success' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-primary' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-warning' };
    return { grade: 'D', color: 'text-error' };
  };

  const { grade, color } = getGrade();

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-quiz">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center">
          <Trophy className="h-10 w-10 text-primary-foreground" />
        </div>
        
        <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
        <p className="text-xl text-muted-foreground">{getPerformanceMessage()}</p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Overall Grade */}
        <div className="text-center">
          <div className={`text-6xl font-bold ${color} mb-2`}>{grade}</div>
          <div className="text-lg text-muted-foreground">
            {Math.round(profile.accuracy * 100)}% Accuracy
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-success-light rounded-lg">
            <div className="text-2xl font-bold text-success">{profile.correctAnswers}</div>
            <div className="text-sm text-success-foreground/80">Correct</div>
          </div>
          
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{profile.currentStreak}</div>
            <div className="text-sm text-primary/80">Best Streak</div>
          </div>
          
          <div className="text-center p-4 bg-warning-light rounded-lg">
            <div className="text-2xl font-bold text-warning">{totalTime.toFixed(1)}s</div>
            <div className="text-sm text-warning-foreground/80">Total Time</div>
          </div>
          
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-accent-foreground">{profile.averageResponseTime.toFixed(1)}s</div>
            <div className="text-sm text-accent-foreground/80">Avg Time</div>
          </div>
        </div>

        {/* Performance by Difficulty */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Performance by Difficulty</h3>
          
          {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
            const correct = correctByDifficulty[difficulty];
            const total = totalByDifficulty[difficulty];
            const percentage = total > 0 ? (correct / total) * 100 : 0;
            
            return (
              <div key={difficulty} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={
                        difficulty === 'easy' ? 'bg-success text-success-foreground' :
                        difficulty === 'medium' ? 'bg-warning text-warning-foreground' :
                        'bg-error text-error-foreground'
                      }
                      variant="secondary"
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {correct}/{total} correct
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(percentage)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Learner State Insight */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Learning Insights</h4>
              <p className="text-sm text-muted-foreground">
                Based on your performance, you're currently at the <strong>{profile.learnerState}</strong> level. 
                {profile.learnerState === 'struggling' && " Focus on the fundamentals and don't hesitate to use hints!"}
                {profile.learnerState === 'normal' && " You're making steady progress. Keep practicing!"}
                {profile.learnerState === 'advanced' && " Excellent work! You're ready for more challenging problems!"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRestart}
            className="bg-gradient-primary hover:opacity-90 px-8 flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Take Quiz Again
          </Button>
          
          <Button variant="outline" className="px-8 flex items-center gap-2">
            <Share className="h-4 w-4" />
            Share Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};