
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MoodEntry } from './MoodEntry';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [moodData, setMoodData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageMood: 0,
    streak: 0,
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
        
        setStats({
          totalEntries,
          averageMood: Math.round(averageMood * 10) / 10,
          streak: calculateStreak(data),
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('totalEntries')}</p>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t('averageMood')}</p>
                <p className="text-2xl font-bold">{stats.averageMood}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">{stats.streak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{t('moodTrends')}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={timeRange === '7' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('7')}
                >
                  {t('last7Days')}
                </Button>
                <Button
                  variant={timeRange === '30' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange('30')}
                >
                  {t('last30Days')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('moodDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={preparePieData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {preparePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle>{t('exportData')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>{t('exportCSV')}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
