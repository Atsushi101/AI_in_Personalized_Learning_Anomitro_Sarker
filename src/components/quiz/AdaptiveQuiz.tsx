import { useState, useEffect } from 'react';
import { Question, Response, LearnerProfile, QuizState } from '@/types/quiz';
import { questions } from '@/data/questions';
import { AdaptiveEngineApi } from '@/utils/adaptiveEngineApi';
import { QuizWelcome } from './QuizWelcome';
import { QuizCard } from './QuizCard';
import { ResultCard } from './ResultCard';
import { QuizComplete } from './QuizComplete';
import { LearnerProfile as LearnerProfileComponent } from './LearnerProfile';
import { PerformanceInsights } from './PerformanceInsights';
import { useToast } from '@/hooks/use-toast';

type QuizPhase = 'welcome' | 'question' | 'result' | 'complete';

export const AdaptiveQuiz = () => {
  const { toast } = useToast();
  const [phase, setPhase] = useState<QuizPhase>('welcome');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    questions: [],
    responses: [],
    learnerProfile: {
      name: '',
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      averageResponseTime: 0,
      currentStreak: 0,
      learnerState: 'new',
      topicProgress: {}
    },
    showHint: false,
    quizCompleted: false,
    startTime: null
  });
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [lastResponse, setLastResponse] = useState<Response | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    // Load saved state from localStorage if available
    const savedState = localStorage.getItem('adaptiveQuizState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.learnerProfile.name) {
          setQuizState(parsed);
          if (parsed.responses.length > 0 && !parsed.quizCompleted) {
            setPhase('question');
            selectNextQuestion(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load saved quiz state:', error);
      }
    }
  }, []);

  const saveState = (newState: QuizState) => {
    localStorage.setItem('adaptiveQuizState', JSON.stringify(newState));
  };

  const startQuiz = (learnerName: string) => {
    const initialProfile: LearnerProfile = {
      name: learnerName,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      averageResponseTime: 0,
      currentStreak: 0,
      learnerState: 'new',
      topicProgress: {}
    };

    const newState: QuizState = {
      currentQuestionIndex: 0,
      questions: [...questions],
      responses: [],
      learnerProfile: initialProfile,
      showHint: false,
      quizCompleted: false,
      startTime: Date.now()
    };

    setQuizState(newState);
    saveState(newState);
    setPhase('question');
    selectNextQuestion(newState);

    toast({
      title: `Welcome, ${learnerName}!`,
      description: "Your adaptive learning journey begins now.",
    });
  };

  const selectNextQuestion = async (state: QuizState) => {
    const nextQuestion = await AdaptiveEngineApi.selectNextQuestion(
      state.questions,
      state.responses,
      state.learnerProfile.learnerState
    );

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setQuizState(prev => ({ ...prev, showHint: false }));
    } else {
      // Quiz completed
      setPhase('complete');
      setQuizState(prev => ({ ...prev, quizCompleted: true }));
    }
  };

  const handleAnswer = async (selectedAnswer: string, responseTime: number) => {
    if (!currentQuestion) return;

    const response: Response = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      questionId: currentQuestion.id,
      selectedAnswer,
      correct: selectedAnswer === currentQuestion.answer,
      responseTime,
      difficulty: currentQuestion.difficulty,
      hintUsed: quizState.showHint
    };

    const newResponses = [...quizState.responses, response];
    const updatedProfile = await AdaptiveEngineApi.updateLearnerProfile(
      quizState.learnerProfile,
      response
    );

    const feedback = await AdaptiveEngineApi.generateFeedback(
      response.correct,
      responseTime,
      currentQuestion,
      updatedProfile.learnerState
    );

    const newState = {
      ...quizState,
      responses: newResponses,
      learnerProfile: updatedProfile
    };

    setQuizState(newState);
    setLastResponse(response);
    setFeedback(feedback);
    saveState(newState);
    setPhase('result');

    // Show success/error toast
    toast({
      title: response.correct ? "Correct!" : "Not quite right",
      description: response.correct 
        ? "Great job! Keep up the excellent work." 
        : "Don't worry, learning takes practice.",
      variant: response.correct ? "default" : "destructive",
    });
  };

  const handleContinue = async () => {
    setPhase('question');
    await selectNextQuestion(quizState);
  };

  const toggleHint = () => {
    setQuizState(prev => ({ ...prev, showHint: !prev.showHint }));
  };

  const restartQuiz = () => {
    localStorage.removeItem('adaptiveQuizState');
    setPhase('welcome');
    setQuizState({
      currentQuestionIndex: 0,
      questions: [],
      responses: [],
      learnerProfile: {
        name: '',
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageResponseTime: 0,
        currentStreak: 0,
        learnerState: 'new',
        topicProgress: {}
      },
      showHint: false,
      quizCompleted: false,
      startTime: null
    });
    setCurrentQuestion(null);
    setLastResponse(null);
    setFeedback('');
  };

  if (phase === 'welcome') {
    return <QuizWelcome onStart={startQuiz} />;
  }

  if (phase === 'complete') {
    return (
      <div className="space-y-6">
        <QuizComplete
          profile={quizState.learnerProfile}
          responses={quizState.responses}
          onRestart={restartQuiz}
        />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Quiz Content */}
      <div className="lg:col-span-2 space-y-6">
        {phase === 'question' && currentQuestion && (
          <QuizCard
            question={currentQuestion}
            questionNumber={quizState.responses.length + 1}
            totalQuestions={questions.length}
            showHint={quizState.showHint}
            onAnswer={handleAnswer}
            onToggleHint={toggleHint}
          />
        )}

        {phase === 'result' && currentQuestion && lastResponse && (
          <ResultCard
            question={currentQuestion}
            response={lastResponse}
            feedback={feedback}
            onContinue={handleContinue}
            learnerState={quizState.learnerProfile.learnerState}
          />
        )}
      </div>

      {/* Sidebar with Profile and Insights */}
      {quizState.learnerProfile.name && (
        <div className="lg:col-span-1 space-y-6">
          <LearnerProfileComponent profile={quizState.learnerProfile} />
          {quizState.responses.length > 0 && (
            <PerformanceInsights 
              responses={quizState.responses} 
              profile={quizState.learnerProfile} 
            />
          )}
        </div>
      )}
    </div>
  );
};