import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Brain, TrendingUp, Calendar, Target, Lightbulb, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MoodInsightsProps {
  moodData: any[];
}

export const MoodInsights = ({ moodData }: MoodInsightsProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [insights, setInsights] = useState({
    bestDay: '',
    worstDay: '',
    mostCommonMood: 0,
    longestStreak: 0,
    weeklyAverage: 0,
    monthlyTrend: 'stable',
    recommendations: [] as string[],
  });

  useEffect(() => {
    if (moodData.length > 0) {
      calculateInsights();
    }
  }, [moodData]);

  const calculateInsights = () => {
    // Find best and worst days
    const sortedByMood = [...moodData].sort((a, b) => Number(b.mood_scale) - Number(a.mood_scale));
    const bestDay = sortedByMood[0]?.date || '';
    const worstDay = sortedByMood[sortedByMood.length - 1]?.date || '';

    // Most common mood
    const moodCounts = moodData.reduce((acc, entry) => {
      const mood = Number(entry.mood_scale);
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '3';

    // Calculate weekly average
    const last7Days = moodData.slice(-7);
    const weeklyAverage = last7Days.length > 0 
      ? last7Days.reduce((sum, entry) => sum + Number(entry.mood_scale), 0) / last7Days.length
      : 0;

    // Generate recommendations
    const recommendations = generateRecommendations(weeklyAverage, moodData);

    setInsights({
      bestDay,
      worstDay,
      mostCommonMood: Number(mostCommonMood),
      longestStreak: calculateLongestStreak(moodData),
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      monthlyTrend: calculateTrend(moodData),
      recommendations,
    });
  };

  const calculateLongestStreak = (data: any[]) => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (let i = 0; i < data.length; i++) {
      if (Number(data[i].mood_scale) >= 4) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  };

  const calculateTrend = (data: any[]) => {
    if (data.length < 7) return 'stable';
    
    const firstWeek = data.slice(0, 7);
    const lastWeek = data.slice(-7);
    
    const firstAvg = firstWeek.reduce((sum, entry) => sum + Number(entry.mood_scale), 0) / firstWeek.length;
    const lastAvg = lastWeek.reduce((sum, entry) => sum + Number(entry.mood_scale), 0) / lastWeek.length;
    
    const diff = lastAvg - firstAvg;
    if (diff > 0.5) return 'improving';
    if (diff < -0.5) return 'declining';
    return 'stable';
  };

  const generateRecommendations = (weeklyAvg: number, data: any[]) => {
    const recommendations = [];
    
    if (weeklyAvg < 3) {
      recommendations.push('Consider talking to a friend or counselor about how you\'re feeling');
      recommendations.push('Try incorporating more physical activity into your routine');
      recommendations.push('Practice mindfulness or meditation for 10 minutes daily');
    } else if (weeklyAvg < 4) {
      recommendations.push('Keep up the good work! Try adding one small positive activity to your day');
      recommendations.push('Consider journaling to identify patterns in your mood');
    } else {
      recommendations.push('You\'re doing great! Keep maintaining your positive habits');
      recommendations.push('Consider helping others - it can boost your own mood too');
    }
    
    // Check for consistency
    if (data.length < 5) {
      recommendations.push('Try to log your mood daily for better insights');
    }
    
    return recommendations.slice(0, 3);
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😞', '😐', '😊', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (!user || moodData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Log more mood entries to see personalized insights and recommendations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Best Streak</p>
                <p className="text-xl font-bold">{insights.longestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getMoodEmoji(insights.mostCommonMood)}</span>
              <div>
                <p className="text-sm text-muted-foreground">Most Common</p>
                <p className="text-xl font-bold">Mood {insights.mostCommonMood}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Weekly Avg</p>
                <p className="text-xl font-bold">{insights.weeklyAverage}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getTrendIcon(insights.monthlyTrend)}</span>
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <p className={`text-xl font-bold ${getTrendColor(insights.monthlyTrend)}`}>
                  {insights.monthlyTrend}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                <span className="text-lg">💡</span>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
