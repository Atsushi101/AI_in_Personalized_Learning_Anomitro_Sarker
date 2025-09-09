import { Response, LearnerProfile } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Clock, Lightbulb } from 'lucide-react';

interface PerformanceInsightsProps {
  responses: Response[];
  profile: LearnerProfile;
}

export const PerformanceInsights = ({ responses, profile }: PerformanceInsightsProps) => {
  if (responses.length === 0) return null;

  const recentResponses = responses.slice(-5);
  const recentAccuracy = recentResponses.filter(r => r.correct).length / recentResponses.length * 100;
  const overallAccuracy = profile.accuracy * 100;
  const improvementTrend = recentAccuracy - overallAccuracy;

  const difficultyBreakdown = {
    easy: responses.filter(r => r.difficulty === 'easy'),
    medium: responses.filter(r => r.difficulty === 'medium'),
    hard: responses.filter(r => r.difficulty === 'hard')
  };

  const avgTimeByDifficulty = {
    easy: difficultyBreakdown.easy.length > 0 
      ? difficultyBreakdown.easy.reduce((sum, r) => sum + r.responseTime, 0) / difficultyBreakdown.easy.length 
      : 0,
    medium: difficultyBreakdown.medium.length > 0 
      ? difficultyBreakdown.medium.reduce((sum, r) => sum + r.responseTime, 0) / difficultyBreakdown.medium.length 
      : 0,
    hard: difficultyBreakdown.hard.length > 0 
      ? difficultyBreakdown.hard.reduce((sum, r) => sum + r.responseTime, 0) / difficultyBreakdown.hard.length 
      : 0
  };

  const getStateColor = (state: LearnerProfile['learnerState']) => {
    switch (state) {
      case 'advanced': return 'bg-success text-success-foreground';
      case 'struggling': return 'bg-error text-error-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const getInsights = () => {
    const insights = [];
    
    if (profile.currentStreak >= 5) {
      insights.push("🔥 You're on fire! Amazing streak going.");
    }
    
    if (profile.averageResponseTime < 8) {
      insights.push("⚡ Lightning fast! Your speed is impressive.");
    }
    
    if (recentAccuracy > 80) {
      insights.push("🎯 Recent performance is excellent!");
    }
    
    if (improvementTrend > 10) {
      insights.push("📈 You're improving rapidly!");
    }
    
    const hintUsage = responses.filter(r => r.hintUsed).length / responses.length;
    if (hintUsage < 0.3) {
      insights.push("🧠 Strong independent problem solving!");
    }
    
    return insights.length > 0 ? insights : ["Keep practicing to unlock insights!"];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning State */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Current Level:</span>
          <Badge className={getStateColor(profile.learnerState)} variant="secondary">
            {profile.learnerState.charAt(0).toUpperCase() + profile.learnerState.slice(1)}
          </Badge>
        </div>

        {/* Recent vs Overall Performance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Recent Performance (Last 5)</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{recentAccuracy.toFixed(0)}%</span>
              {improvementTrend > 5 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : improvementTrend < -5 ? (
                <TrendingDown className="h-4 w-4 text-error" />
              ) : null}
            </div>
          </div>
          <Progress value={recentAccuracy} className="h-2" />
        </div>

        {/* Difficulty Performance */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Performance by Difficulty</h4>
          {Object.entries(difficultyBreakdown).map(([difficulty, responses]) => {
            const accuracy = responses.length > 0 
              ? (responses.filter(r => r.correct).length / responses.length) * 100 
              : 0;
            const avgTime = avgTimeByDifficulty[difficulty as keyof typeof avgTimeByDifficulty];
            
            return (
              <div key={difficulty} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{difficulty}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {avgTime > 0 ? `${avgTime.toFixed(1)}s` : 'N/A'}
                    </span>
                    <span className="font-medium">{accuracy.toFixed(0)}%</span>
                  </div>
                </div>
                <Progress value={accuracy} className="h-1.5" />
              </div>
            );
          })}
        </div>

        {/* Key Insights */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            Key Insights
          </h4>
          <div className="space-y-1">
            {getInsights().map((insight, index) => (
              <p key={index} className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                {insight}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};