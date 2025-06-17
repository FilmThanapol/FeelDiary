
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Download, Calendar, TrendingUp, Target, Zap, Heart, Brain, Smile } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MoodEntry } from './MoodEntry';
import { MoodAnalytics } from './MoodAnalytics';
import { MoodHeatmap } from './MoodHeatmap';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
const MOOD_COLORS = {
  1: '#ef4444', // Red
  2: '#f97316', // Orange
  3: '#eab308', // Yellow
  4: '#22c55e', // Green
  5: '#3b82f6'  // Blue
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [moodData, setMoodData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageMood: 0,
    streak: 0,
    weeklyGoal: 7,
    weeklyProgress: 0,
    moodTrend: 'stable',
    bestMood: 0,
    improvementRate: 0,
  });
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');

  useEffect(() => {
    if (user) {
      fetchMoodData();
    }
  }, [user, timeRange]);

  const fetchMoodData = async () => {
    if (!user) return;

    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', daysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      setMoodData(data || []);
      
      // Calculate stats
      if (data && data.length > 0) {
        const totalEntries = data.length;
        const averageMood = data.reduce((sum, entry) => sum + parseInt(entry.mood_scale), 0) / totalEntries;
        const streak = calculateStreak(data);

        // Calculate weekly progress (last 7 days)
        const last7Days = data.filter(entry => {
          const entryDate = new Date(entry.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate >= weekAgo;
        });

        // Calculate mood trend
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));
        const firstAvg = firstHalf.reduce((sum, entry) => sum + parseInt(entry.mood_scale), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, entry) => sum + parseInt(entry.mood_scale), 0) / secondHalf.length;

        let moodTrend = 'stable';
        const trendDiff = secondAvg - firstAvg;
        if (trendDiff > 0.3) moodTrend = 'improving';
        else if (trendDiff < -0.3) moodTrend = 'declining';

        const bestMood = Math.max(...data.map(entry => parseInt(entry.mood_scale)));
        const improvementRate = data.length > 1 ? ((secondAvg - firstAvg) / firstAvg * 100) : 0;

        setStats({
          totalEntries,
          averageMood: Math.round(averageMood * 10) / 10,
          streak,
          weeklyGoal: 7,
          weeklyProgress: last7Days.length,
          moodTrend,
          bestMood,
          improvementRate: Math.round(improvementRate * 10) / 10,
        });
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
    }
  };

  const calculateStreak = (data: any[]) => {
    // Simple streak calculation - consecutive days with entries
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const hasEntry = data.some(entry => entry.date === dateStr);
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const prepareChartData = () => {
    return moodData.map(entry => ({
      date: new Date(entry.date).toLocaleDateString(),
      mood: parseInt(entry.mood_scale),
      emoji: entry.mood_emoji,
    }));
  };

  const preparePieData = () => {
    const moodCounts = [0, 0, 0, 0, 0];
    moodData.forEach(entry => {
      moodCounts[parseInt(entry.mood_scale) - 1]++;
    });

    return moodCounts.map((count, index) => ({
      name: t(['terrible', 'bad', 'okay', 'good', 'excellent'][index]),
      value: count,
      emoji: ['😢', '😞', '😐', '😊', '😄'][index],
    })).filter(item => item.value > 0);
  };

  const exportToCSV = () => {
    if (moodData.length === 0) return;

    const csvContent = [
      ['Date', 'Mood Scale', 'Mood Emoji', 'Notes'],
      ...moodData.map(entry => [
        entry.date,
        entry.mood_scale,
        entry.mood_emoji,
        entry.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-data-${timeRange}-days.csv`;
    a.click();
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <MoodEntry />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{t('guestModeNote')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MoodEntry />

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('totalEntries')}</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalEntries}</p>
                <p className="text-xs text-muted-foreground mt-1">Mood entries logged</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('averageMood')}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-green-600">{stats.averageMood}</p>
                  <span className="text-lg text-muted-foreground">/5</span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Badge variant={stats.moodTrend === 'improving' ? 'default' : stats.moodTrend === 'declining' ? 'destructive' : 'secondary'} className="text-xs">
                    {stats.moodTrend === 'improving' ? '↗️ Improving' : stats.moodTrend === 'declining' ? '↘️ Declining' : '→ Stable'}
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('currentStreak')}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-orange-600">{stats.streak}</p>
                  <span className="text-lg text-muted-foreground">{t('days')}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Keep it going! 🔥</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('weeklyGoal')}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-3xl font-bold text-purple-600">{stats.weeklyProgress}</p>
                  <span className="text-lg text-muted-foreground">/{stats.weeklyGoal}</span>
                </div>
                <div className="mt-2">
                  <Progress value={(stats.weeklyProgress / stats.weeklyGoal) * 100} className="h-2" />
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>{t('moodTrends')}</span>
              </CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant={timeRange === '7' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('7')}
                  className="text-xs sm:text-sm"
                >
                  {t('last7Days')}
                </Button>
                <Button
                  variant={timeRange === '30' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('30')}
                  className="text-xs sm:text-sm"
                >
                  {t('last30Days')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prepareChartData()}>
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis
                    domain={[1, 5]}
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#moodGradient)"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="h-5 w-5" />
              <span>{t('moodDistribution')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preparePieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {preparePieData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Mood Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Best Mood</h4>
                <p className="text-2xl font-bold text-blue-600">{stats.bestMood}/5</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">Your highest recorded mood</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200">Improvement Rate</h4>
                <p className="text-2xl font-bold text-green-600">
                  {stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">Compared to earlier period</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200">Weekly Summary</h4>
              <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                You've logged {stats.weeklyProgress} out of {stats.weeklyGoal} days this week.
                {stats.weeklyProgress >= stats.weeklyGoal ? ' Amazing consistency! 🎉' :
                 stats.weeklyProgress >= stats.weeklyGoal * 0.7 ? ' You\'re doing great! Keep it up! 💪' :
                 ' Try to log your mood more regularly for better insights. 📝'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>{t('exportData')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={exportToCSV} className="w-full flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>{t('exportCSV')}</span>
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Export your mood data for external analysis or backup
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <MoodAnalytics moodData={moodData} />

      {/* Mood Heatmap */}
      <MoodHeatmap moodData={moodData} />
    </div>
  );
};
