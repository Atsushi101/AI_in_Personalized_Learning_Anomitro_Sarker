import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Target, 
  Clock, 
  Brain,
  ArrowRight,
  Code 
} from 'lucide-react';

interface QuizWelcomeProps {
  onStart: (learnerName: string) => void;
}

export const QuizWelcome = ({ onStart }: QuizWelcomeProps) => {
  const [learnerName, setLearnerName] = useState('');

  const handleStart = () => {
    if (learnerName.trim()) {
      onStart(learnerName.trim());
    }
  };

  const features = [
    {
      icon: Code,
      title: 'Python Programming',
      description: 'Learn Python concepts from basics to advanced topics'
    },
    {
      icon: Target,
      title: 'Personalized Feedback',
      description: 'Get targeted hints and explanations for each concept'
    },
    {
      icon: Clock,
      title: 'Progress Tracking',
      description: 'Monitor your coding skills and improvements'
    },
    {
      icon: Brain,
      title: 'Smart Adaptation',
      description: 'Questions adapt to your programming skill level'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <Card className="text-center shadow-quiz bg-gradient-learning">
        <CardHeader className="space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <CardTitle className="text-4xl text-white">
              Adaptive Python Quiz
            </CardTitle>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Master Python programming with our intelligent tutoring system that adapts to your coding skills and learning pace.
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="shadow-card hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiz Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success-light rounded-lg">
              <div className="text-2xl font-bold text-success mb-1">15</div>
              <div className="text-sm text-success-foreground/80">Questions</div>
            </div>
            <div className="text-center p-4 bg-warning-light rounded-lg">
              <div className="text-2xl font-bold text-warning mb-1">3</div>
              <div className="text-sm text-warning-foreground/80">Difficulty Levels</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">∞</div>
              <div className="text-sm text-primary/80">Adaptive Path</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Topics Covered:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Python Basics</Badge>
              <Badge variant="secondary">Data Types</Badge>
              <Badge variant="secondary">Control Flow</Badge>
              <Badge variant="secondary">Functions & Classes</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Quiz Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Ready to Begin?</CardTitle>
          <p className="text-muted-foreground">
            Enter your name to start your personalized Python learning journey.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="learnerName">Your Name</Label>
            <Input
              id="learnerName"
              placeholder="Enter your name..."
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              className="text-lg p-3"
            />
          </div>
          
          <Button
            onClick={handleStart}
            disabled={!learnerName.trim()}
            className="w-full bg-gradient-primary hover:opacity-90 text-lg py-3 flex items-center justify-center gap-2"
          >
            Start Python Learning Journey
            <ArrowRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};