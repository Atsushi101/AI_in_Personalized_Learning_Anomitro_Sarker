import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LearnerProfile as LearnerProfileType } from '@/types/quiz';
import { 
  User, 
  Target, 
  Clock, 
  TrendingUp, 
  Award,
  Brain
} from 'lucide-react';

interface LearnerProfileProps {
  profile: LearnerProfileType;
}

export const LearnerProfile = ({ profile }: LearnerProfileProps) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'struggling': return 'bg-error text-error-foreground';
      case 'normal': return 'bg-primary text-primary-foreground';
      case 'advanced': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'struggling': return Brain;
      case 'normal': return Target;
      case 'advanced': return Award;
      default: return User;
    }
  };

  const StateIcon = getStateIcon(profile.learnerState);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            {profile.name}
          </CardTitle>
          <Badge className={getStateColor(profile.learnerState)} variant="secondary">
            <StateIcon className="h-3 w-3 mr-1" />
            {profile.learnerState.charAt(0).toUpperCase() + profile.learnerState.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-success-light rounded-lg">
            <div className="text-2xl font-bold text-success">
              {Math.round(profile.accuracy * 100)}%
            </div>
            <div className="text-sm text-success-foreground/80">Accuracy</div>
          </div>
          
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {profile.currentStreak}
            </div>
            <div className="text-sm text-primary/80">Current Streak</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Target className="h-4 w-4" />
              Progress
            </span>
            <span className="text-sm text-muted-foreground">
              {profile.correctAnswers}/{profile.totalQuestions}
            </span>
          </div>
          <Progress 
            value={profile.accuracy * 100} 
            className="h-2"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Avg Time: {profile.averageResponseTime.toFixed(1)}s</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span>{profile.totalQuestions} questions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};