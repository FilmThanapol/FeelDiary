import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { 
  Heart, Brain, Zap, Target, Play, Pause, RotateCcw, 
  Lightbulb, BookOpen, Phone, MessageCircle, Smile,
  Moon, Sun, Coffee, Activity, Users, Music
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WellnessHubProps {
  currentMoodAverage?: number;
}

export const WellnessHub = ({ currentMoodAverage = 3 }: WellnessHubProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [breathingTimer, setBreathingTimer] = useState<NodeJS.Timeout | null>(null);

  const getWellnessTips = () => [
    {
      category: t('mindfulness'),
      icon: '🧘‍♀️',
      tips: [
        'Take 5 deep breaths when feeling overwhelmed',
        'Practice gratitude by listing 3 things you\'re thankful for',
        'Try a 10-minute meditation using a guided app',
        'Focus on the present moment without judgment'
      ]
    },
    {
      category: t('physicalHealth'),
      icon: '🏃‍♂️',
      tips: [
        'Take a 10-minute walk outside for fresh air',
        'Do some light stretching or yoga',
        'Stay hydrated - drink a glass of water',
        'Get 7-9 hours of quality sleep'
      ]
    },
    {
      category: t('socialConnection'),
      icon: '👥',
      tips: [
        'Reach out to a friend or family member',
        'Join a community group or hobby club',
        'Practice active listening in conversations',
        'Express appreciation to someone you care about'
      ]
    },
    {
      category: t('selfCare'),
      icon: '💆‍♀️',
      tips: [
        'Take a warm bath or shower',
        'Listen to your favorite music',
        'Read a book or watch something uplifting',
        'Practice saying "no" to protect your energy'
      ]
    }
  ];

  const getMoodGoals = () => [
    { id: 1, title: t('dailyCheckIn'), description: 'Log your mood every day', progress: 85, target: 100 },
    { id: 2, title: t('positiveStreakGoal'), description: 'Maintain good mood for 7 days', progress: 60, target: 100 },
    { id: 3, title: t('mindfulnessPractice'), description: 'Complete 5 breathing exercises', progress: 40, target: 100 },
    { id: 4, title: t('socialConnection'), description: 'Connect with friends 3 times this week', progress: 75, target: 100 },
  ];

  const emergencyResources = [
    {
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      description: '24/7 crisis support via text',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      name: 'National Suicide Prevention Lifeline',
      contact: '988',
      description: '24/7 free and confidential support',
      icon: <Phone className="h-5 w-5" />
    },
    {
      name: 'SAMHSA National Helpline',
      contact: '1-800-662-4357',
      description: 'Treatment referral and information service',
      icon: <Phone className="h-5 w-5" />
    }
  ];

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
    
    const cycle = () => {
      setBreathingPhase('inhale');
      setTimeout(() => setBreathingPhase('hold'), 4000);
      setTimeout(() => setBreathingPhase('exhale'), 7000);
      setTimeout(() => {
        setBreathingCount(prev => prev + 1);
        if (breathingCount < 5) {
          cycle();
        } else {
          setBreathingActive(false);
        }
      }, 11000);
    };
    
    cycle();
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    if (breathingTimer) {
      clearTimeout(breathingTimer);
    }
  };

  const getPersonalizedTips = () => {
    if (currentMoodAverage < 2.5) {
      return [
        'Consider reaching out to a mental health professional',
        'Try gentle activities like listening to calming music',
        'Focus on basic self-care: eating, sleeping, hygiene',
        'Connect with a trusted friend or family member'
      ];
    } else if (currentMoodAverage < 3.5) {
      return [
        'Practice deep breathing exercises',
        'Take a short walk in nature',
        'Write down your thoughts in a journal',
        'Try a guided meditation'
      ];
    } else {
      return [
        'Keep up your positive habits!',
        'Try something new that brings you joy',
        'Share your positive energy with others',
        'Set a new personal goal or challenge'
      ];
    }
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale': return t('breatheIn');
      case 'hold': return t('hold');
      case 'exhale': return t('breatheOut');
      default: return 'Ready to begin';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>{t('wellnessHub')}</span>
            <Badge variant="secondary">{t('mentalHealthSupport')}</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="goals">{t('moodGoals')}</TabsTrigger>
          <TabsTrigger value="exercises">{t('breathingExercise')}</TabsTrigger>
          <TabsTrigger value="tips">{t('wellnessTips')}</TabsTrigger>
          <TabsTrigger value="resources">{t('emergencyResources')}</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getMoodGoals().map((goal) => (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{goal.title}</h3>
                      <Badge variant={goal.progress >= 100 ? 'default' : 'secondary'}>
                        {goal.progress}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{goal.progress}/{goal.target}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Personalized Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Personalized for You</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getPersonalizedTips().map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-lg">💡</span>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          {/* Breathing Exercise */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <span>4-7-8 Breathing Exercise</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className={`w-32 h-32 mx-auto rounded-full border-4 border-blue-500 flex items-center justify-center transition-all duration-1000 ${
                    breathingActive ? 
                      breathingPhase === 'inhale' ? 'scale-125 bg-blue-100' :
                      breathingPhase === 'hold' ? 'scale-125 bg-yellow-100' :
                      'scale-75 bg-green-100'
                    : 'bg-gray-100'
                  }`}>
                    <div className="text-center">
                      <p className="text-lg font-semibold">{getBreathingInstruction()}</p>
                      {breathingActive && (
                        <p className="text-sm text-muted-foreground">Cycle {breathingCount + 1}/6</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('breathingInstructions')}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    {!breathingActive ? (
                      <Button onClick={startBreathingExercise} className="flex items-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>{t('startExercise')}</span>
                      </Button>
                    ) : (
                      <Button onClick={stopBreathingExercise} variant="outline" className="flex items-center space-x-2">
                        <Pause className="h-4 w-4" />
                        <span>{t('stopExercise')}</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Exercises */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Music className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold mb-2">5-Minute Meditation</h3>
                <p className="text-sm text-muted-foreground">Guided mindfulness practice</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 mx-auto mb-3 text-green-500" />
                <h3 className="font-semibold mb-2">Body Scan</h3>
                <p className="text-sm text-muted-foreground">Progressive muscle relaxation</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-2">Gratitude Practice</h3>
                <p className="text-sm text-muted-foreground">Focus on positive thoughts</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getWellnessTips().map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span>{category.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-green-500 mt-1">•</span>
                        <p className="text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          {/* Emergency Resources */}
          <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                <Phone className="h-5 w-5" />
                <span>Emergency Mental Health Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyResources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <div className="text-red-500">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">{resource.contact}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>If you're in immediate danger, call 911 or go to your nearest emergency room.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Additional Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Mental Health Apps</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Headspace - Meditation and mindfulness</li>
                    <li>• Calm - Sleep stories and relaxation</li>
                    <li>• Insight Timer - Free meditation library</li>
                    <li>• Sanvello - Anxiety and mood tracking</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Professional Help</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Psychology Today - Find therapists</li>
                    <li>• BetterHelp - Online therapy</li>
                    <li>• NAMI - Mental health support groups</li>
                    <li>• Your healthcare provider</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
