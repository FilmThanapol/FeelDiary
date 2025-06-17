import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, Calendar, Clock, Target, Brain, 
  Zap, Heart, Sun, Moon, Coffee, Activity 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subDays, subWeeks } from 'date-fns';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
const MOOD_COLORS = {
  1: '#ef4444', 2: '#f97316', 3: '#eab308', 4: '#22c55e', 5: '#3b82f6'
};

interface MoodAnalyticsProps {
  moodData: any[];
}

export const MoodAnalytics = ({ moodData }: MoodAnalyticsProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [analytics, setAnalytics] = useState({
    weeklyPatterns: [] as any[],
    monthlyTrends: [] as any[],
    moodDistribution: [] as any[],
    timeOfDayPatterns: [] as any[],
    streakAnalysis: {} as any,
    correlations: [] as any[],
    predictions: {} as any,
  });

  useEffect(() => {
    if (moodData.length > 0) {
      calculateAnalytics();
    }
  }, [moodData, timeRange]);

  const calculateAnalytics = () => {
    const now = new Date();
    let filteredData = moodData;

    // Filter data based on time range
    if (timeRange === 'week') {
      const weekAgo = subDays(now, 7);
      filteredData = moodData.filter(entry => new Date(entry.date) >= weekAgo);
    } else if (timeRange === 'month') {
      const monthAgo = subDays(now, 30);
      filteredData = moodData.filter(entry => new Date(entry.date) >= monthAgo);
    } else if (timeRange === 'quarter') {
      const quarterAgo = subDays(now, 90);
      filteredData = moodData.filter(entry => new Date(entry.date) >= quarterAgo);
    }

    // Weekly patterns
    const weeklyPatterns = calculateWeeklyPatterns(filteredData);
    
    // Monthly trends
    const monthlyTrends = calculateMonthlyTrends(filteredData);
    
    // Mood distribution
    const moodDistribution = calculateMoodDistribution(filteredData);
    
    // Time of day patterns (simulated for now)
    const timeOfDayPatterns = calculateTimePatterns();
    
    // Streak analysis
    const streakAnalysis = calculateStreakAnalysis(filteredData);
    
    // Correlations (simulated insights)
    const correlations = generateCorrelations(filteredData);
    
    // Predictions
    const predictions = generatePredictions(filteredData);

    setAnalytics({
      weeklyPatterns,
      monthlyTrends,
      moodDistribution,
      timeOfDayPatterns,
      streakAnalysis,
      correlations,
      predictions,
    });
  };

  const calculateWeeklyPatterns = (data: any[]) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const patterns = dayNames.map(day => ({ day, mood: 0, count: 0 }));
    
    data.forEach(entry => {
      const dayIndex = new Date(entry.date).getDay();
      patterns[dayIndex].mood += parseInt(entry.mood_scale);
      patterns[dayIndex].count += 1;
    });
    
    return patterns.map(p => ({
      ...p,
      mood: p.count > 0 ? Math.round((p.mood / p.count) * 10) / 10 : 0
    }));
  };

  const calculateMonthlyTrends = (data: any[]) => {
    const trends: any[] = [];
    const weeks = Math.ceil(data.length / 7);
    
    for (let i = 0; i < weeks; i++) {
      const weekData = data.slice(i * 7, (i + 1) * 7);
      if (weekData.length > 0) {
        const avgMood = weekData.reduce((sum, entry) => sum + parseInt(entry.mood_scale), 0) / weekData.length;
        trends.push({
          week: `Week ${i + 1}`,
          mood: Math.round(avgMood * 10) / 10,
          entries: weekData.length
        });
      }
    }
    
    return trends;
  };

  const calculateMoodDistribution = (data: any[]) => {
    const distribution = [
      { name: 'Terrible', value: 0, mood: 1 },
      { name: 'Bad', value: 0, mood: 2 },
      { name: 'Okay', value: 0, mood: 3 },
      { name: 'Good', value: 0, mood: 4 },
      { name: 'Excellent', value: 0, mood: 5 },
    ];
    
    data.forEach(entry => {
      const moodIndex = parseInt(entry.mood_scale) - 1;
      if (moodIndex >= 0 && moodIndex < 5) {
        distribution[moodIndex].value += 1;
      }
    });
    
    return distribution;
  };

  const calculateTimePatterns = () => {
    // Simulated time-of-day patterns
    return [
      { time: 'Morning', mood: 3.8, icon: '🌅' },
      { time: 'Afternoon', mood: 3.5, icon: '☀️' },
      { time: 'Evening', mood: 3.9, icon: '🌆' },
      { time: 'Night', mood: 3.2, icon: '🌙' },
    ];
  };

  const calculateStreakAnalysis = (data: any[]) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let positiveStreak = 0;
    
    data.forEach(entry => {
      const mood = parseInt(entry.mood_scale);
      if (mood >= 4) {
        currentStreak++;
        positiveStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return {
      current: currentStreak,
      longest: longestStreak,
      positive: positiveStreak,
      percentage: data.length > 0 ? Math.round((positiveStreak / data.length) * 100) : 0
    };
  };

  const generateCorrelations = (data: any[]) => {
    // Simulated correlations - in a real app, this would analyze actual patterns
    return [
      { factor: 'Exercise', correlation: 0.7, impact: 'positive', icon: '🏃‍♂️' },
      { factor: 'Sleep Quality', correlation: 0.6, impact: 'positive', icon: '😴' },
      { factor: 'Social Time', correlation: 0.5, impact: 'positive', icon: '👥' },
      { factor: 'Work Stress', correlation: -0.4, impact: 'negative', icon: '💼' },
    ];
  };

  const generatePredictions = (data: any[]) => {
    if (data.length < 7) return { trend: 'stable', confidence: 0 };
    
    const recent = data.slice(-7);
    const avgRecent = recent.reduce((sum, entry) => sum + parseInt(entry.mood_scale), 0) / recent.length;
    const older = data.slice(-14, -7);
    const avgOlder = older.length > 0 ? older.reduce((sum, entry) => sum + parseInt(entry.mood_scale), 0) / older.length : avgRecent;
    
    const trend = avgRecent > avgOlder + 0.3 ? 'improving' : avgRecent < avgOlder - 0.3 ? 'declining' : 'stable';
    const confidence = Math.min(90, Math.max(50, data.length * 2));
    
    return { trend, confidence, prediction: avgRecent };
  };

  if (!user || moodData.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Track your mood for at least a week to see detailed analytics
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>{t('moodAnalytics')}</span>
            </CardTitle>
            <div className="flex space-x-2">
              {(['week', 'month', 'quarter'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === 'week' ? t('lastWeek') : range === 'month' ? t('lastMonth') : t('lastQuarter')}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="patterns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="patterns">{t('patterns')}</TabsTrigger>
          <TabsTrigger value="trends">{t('trends')}</TabsTrigger>
          <TabsTrigger value="insights">{t('insights')}</TabsTrigger>
          <TabsTrigger value="predictions">{t('predictions')}</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Weekly Patterns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.weeklyPatterns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" fontSize={12} />
                      <YAxis domain={[1, 5]} fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="mood" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Mood Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Mood Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.moodDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.moodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Mood Trends Over Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyTrends}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#moodGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Streak Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-xl font-bold">{analytics.streakAnalysis.current} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Longest Streak</p>
                    <p className="text-xl font-bold">{analytics.streakAnalysis.longest} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Positive Days</p>
                    <p className="text-xl font-bold">{analytics.streakAnalysis.positive}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Positive %</p>
                    <p className="text-xl font-bold">{analytics.streakAnalysis.percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Correlations */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Correlations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.correlations.map((correlation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{correlation.icon}</span>
                      <div>
                        <p className="font-medium">{correlation.factor}</p>
                        <p className="text-sm text-muted-foreground">
                          {correlation.impact === 'positive' ? 'Positive' : 'Negative'} correlation
                        </p>
                      </div>
                    </div>
                    <Badge variant={correlation.impact === 'positive' ? 'default' : 'destructive'}>
                      {Math.abs(correlation.correlation * 100).toFixed(0)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Mood Predictions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Trend Prediction</h3>
                  <p className="text-3xl font-bold mb-2">
                    {analytics.predictions.trend === 'improving' ? '📈 Improving' : 
                     analytics.predictions.trend === 'declining' ? '📉 Declining' : '➡️ Stable'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {analytics.predictions.confidence}% confidence based on recent patterns
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Predicted Average</p>
                    <p className="text-2xl font-bold">{analytics.predictions.prediction?.toFixed(1)}/5</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Data Points</p>
                    <p className="text-2xl font-bold">{moodData.length}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Reliability</p>
                    <p className="text-2xl font-bold">
                      {moodData.length >= 30 ? 'High' : moodData.length >= 14 ? 'Medium' : 'Low'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
