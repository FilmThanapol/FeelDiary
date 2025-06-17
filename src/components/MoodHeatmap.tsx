import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, TrendingUp, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format, startOfYear, endOfYear, eachDayOfInterval, subYears, addDays } from 'date-fns';

interface MoodHeatmapProps {
  moodData: any[];
}

export const MoodHeatmap = ({ moodData }: MoodHeatmapProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [hoveredDay, setHoveredDay] = useState<any>(null);

  useEffect(() => {
    generateHeatmapData();
  }, [moodData, selectedYear]);

  const generateHeatmapData = () => {
    // Get last 365 days for a rolling year view
    const today = new Date();
    const startDate = addDays(today, -364); // 365 days including today
    const allDays = eachDayOfInterval({ start: startDate, end: today });

    const heatmap = allDays.map((day, index) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = moodData.find(mood => mood.date === dateStr);

      return {
        date: day,
        dateStr,
        mood: entry ? parseInt(entry.mood_scale) : null,
        emoji: entry ? entry.mood_emoji : null,
        notes: entry ? entry.notes : null,
        index
      };
    });

    setHeatmapData(heatmap);
  };

  const getMoodColor = (mood: number | null) => {
    if (!mood) return 'bg-gray-100 dark:bg-gray-800';

    const colors = {
      1: 'bg-red-500 hover:bg-red-600',
      2: 'bg-orange-500 hover:bg-orange-600',
      3: 'bg-yellow-500 hover:bg-yellow-600',
      4: 'bg-green-500 hover:bg-green-600',
      5: 'bg-blue-500 hover:bg-blue-600'
    };

    return colors[mood as keyof typeof colors] || 'bg-gray-100';
  };

  const getMoodIntensity = (mood: number | null) => {
    if (!mood) return 0;
    return mood / 5;
  };

  const getMonthStats = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthData = heatmapData.filter(day => day.date.getMonth() === i && day.mood);
      const avgMood = monthData.length > 0 
        ? monthData.reduce((sum, day) => sum + day.mood, 0) / monthData.length 
        : 0;
      
      return {
        month: format(new Date(selectedYear, i, 1), 'MMM'),
        avgMood: Math.round(avgMood * 10) / 10,
        entries: monthData.length
      };
    });
    
    return months;
  };

  const getYearStats = () => {
    const entriesWithMood = heatmapData.filter(day => day.mood);
    const totalEntries = entriesWithMood.length;
    const avgMood = totalEntries > 0 
      ? entriesWithMood.reduce((sum, day) => sum + day.mood, 0) / totalEntries 
      : 0;
    
    const moodCounts = entriesWithMood.reduce((acc, day) => {
      acc[day.mood] = (acc[day.mood] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const bestMood = Math.max(...Object.keys(moodCounts).map(Number));
    const worstMood = Math.min(...Object.keys(moodCounts).map(Number));
    
    return {
      totalEntries,
      avgMood: Math.round(avgMood * 10) / 10,
      bestMood: isFinite(bestMood) ? bestMood : 0,
      worstMood: isFinite(worstMood) ? worstMood : 0,
      consistency: Math.round((totalEntries / 365) * 100)
    };
  };

  const yearStats = getYearStats();
  const monthStats = getMonthStats();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('signInToSee')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Year Selector and Stats */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>{t('moodHeatmap')}</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {[selectedYear - 1, selectedYear, selectedYear + 1].map(year => (
                  <Button
                    key={year}
                    variant={year === selectedYear ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                    disabled={year > new Date().getFullYear()}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Year Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{yearStats.totalEntries}</p>
              <p className="text-xs text-muted-foreground">{t('totalEntries')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{yearStats.avgMood}/5</p>
              <p className="text-xs text-muted-foreground">{t('averageMood')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{yearStats.consistency}%</p>
              <p className="text-xs text-muted-foreground">{t('consistency')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{yearStats.bestMood}/5</p>
              <p className="text-xs text-muted-foreground">{t('bestMood')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{yearStats.worstMood}/5</p>
              <p className="text-xs text-muted-foreground">{t('lowestMood')}</p>
            </div>
          </div>

          {/* Heatmap */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t('dailyMoodOverview')}</h3>
              <div className="flex items-center space-x-2 text-xs">
                <span>Less</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm ${getMoodColor(level)}`}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>

            {/* Simple Grid Heatmap */}
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Each square represents a day. Hover to see details.
              </div>

              <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1 max-w-full">
                {heatmapData.map((dayData, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-sm cursor-pointer transition-all duration-200 border flex items-center justify-center text-xs font-bold ${
                      dayData.mood
                        ? `${getMoodColor(dayData.mood)} text-white shadow-sm hover:scale-110`
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'
                    }`}
                    onMouseEnter={() => setHoveredDay(dayData)}
                    onMouseLeave={() => setHoveredDay(null)}
                    title={`${format(dayData.date, 'MMM dd, yyyy')}${dayData.mood ? ` - Mood: ${dayData.mood}/5 ${dayData.emoji}` : ' - No entry'}`}
                  >
                    {dayData.mood ? dayData.mood : ''}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="text-muted-foreground">Mood Scale:</span>
                {[1, 2, 3, 4, 5].map(mood => (
                  <div key={mood} className="flex items-center space-x-1">
                    <div className={`w-4 h-4 rounded-sm ${getMoodColor(mood)}`}></div>
                    <span className="text-xs">{mood}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hovered day info */}
            {hoveredDay && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{format(hoveredDay.date, 'MMMM dd, yyyy')}</span>
                  {hoveredDay.mood && (
                    <>
                      <Badge variant="outline">Mood: {hoveredDay.mood}/5</Badge>
                      <span className="text-lg">{hoveredDay.emoji}</span>
                    </>
                  )}
                </div>
                {hoveredDay.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{hoveredDay.notes}</p>
                )}
                {!hoveredDay.mood && (
                  <p className="text-sm text-muted-foreground">No mood entry for this day</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>{t('monthlyBreakdown')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-4">
            {monthStats.map((month, index) => (
              <div key={index} className="text-center p-3 border rounded-lg">
                <p className="font-semibold text-sm">{month.month}</p>
                <p className="text-lg font-bold text-blue-600">{month.avgMood || 0}/5</p>
                <p className="text-xs text-muted-foreground">{month.entries} entries</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
