
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Heart, Save, Edit3, Sparkles } from 'lucide-react';

const moodEmojis = ['😢', '😞', '😐', '😊', '😄'];
const moodColors = ['mood-1', 'mood-2', 'mood-3', 'mood-4', 'mood-5'];

export const MoodEntry = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      fetchTodayEntry();
    } else {
      setLoading(false);
    }
  }, [user, today]);

  const fetchTodayEntry = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTodayEntry(data);
        setSelectedMood(parseInt(data.mood_scale));
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Error fetching today entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodEntry = async () => {
    if (!user || selectedMood === null) return;

    try {
      const moodData = {
        user_id: user.id,
        date: today,
        mood_scale: selectedMood.toString() as "1" | "2" | "3" | "4" | "5",
        mood_emoji: moodEmojis[selectedMood - 1],
        notes: notes.trim() || null,
      };

      if (todayEntry) {
        const { error } = await supabase
          .from('mood_entries')
          .update(moodData)
          .eq('id', todayEntry.id);

        if (error) throw error;
        
        toast({
          title: t('success'),
          description: 'Mood updated successfully! ✨',
        });
      } else {
        const { error } = await supabase
          .from('mood_entries')
          .insert(moodData);

        if (error) throw error;
        
        toast({
          title: t('success'),
          description: 'Mood saved successfully! 🎉',
        });
      }

      fetchTodayEntry();
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: t('error'),
        description: 'Failed to save mood entry',
        variant: 'destructive',
      });
    }
  };

  const getMoodLabel = (mood: number) => {
    const labels = [t('terrible'), t('bad'), t('okay'), t('good'), t('excellent')];
    return labels[mood - 1];
  };

  const getMoodDescription = (mood: number) => {
    const descriptions = [
      t('havingToughDay'),
      t('feelingDown'),
      t('neutralFeeling'),
      t('feelingPositive'),
      t('amazingDay')
    ];
    return descriptions[mood - 1];
  };

  if (loading) {
    return (
      <Card className="gradient-card shadow-cute rounded-3xl border-0 hover-lift">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse-soft text-lg">{t('loading')} ✨</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card shadow-cute rounded-3xl border-0 hover-lift overflow-hidden relative">
      {/* Cute floating elements */}
      <div className="absolute top-4 right-4 text-2xl animate-float opacity-50">✨</div>
      <div className="absolute top-8 left-4 text-xl animate-bounce-soft opacity-30">💖</div>
      
      <CardHeader className="pb-4 px-6 pt-6 relative">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white animate-pulse-soft">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gradient">{t('todayMood')}</span>
            {todayEntry && (
              <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800 rounded-full px-3 py-1 animate-bounce-soft">
                Updated ✓
              </Badge>
            )}
          </div>
          {todayEntry && (
            <div className="flex items-center space-x-3">
              <span className="text-4xl animate-wiggle">{todayEntry.mood_emoji}</span>
              <Badge variant="outline" className="text-sm bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border-purple-200">
                {getMoodLabel(parseInt(todayEntry.mood_scale))}
              </Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 px-6 pb-6">
        <div>
          <h3 className="text-sm font-semibold mb-4 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className="text-purple-700 dark:text-purple-300">How are you feeling today? 🌟</span>
            {selectedMood > 0 && (
              <Badge variant="outline" className={`text-xs w-fit rounded-full px-3 py-1 ${moodColors[selectedMood - 1]} border-0 text-gray-700 dark:text-gray-200`}>
                {getMoodDescription(selectedMood)}
              </Badge>
            )}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {moodEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant={selectedMood === index + 1 ? 'default' : 'outline'}
                className={`h-16 sm:h-20 text-2xl sm:text-3xl transition-all duration-300 hover-scale rounded-2xl border-2 ${
                  selectedMood === index + 1
                    ? `gradient-button text-white shadow-cute scale-110 border-0`
                    : 'bg-white/70 hover:bg-white/90 backdrop-blur-sm border-purple-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedMood(index + 1)}
              >
                <div className="text-center">
                  <div className="mb-1 filter drop-shadow-sm">{emoji}</div>
                  <div className="text-xs font-medium hidden sm:block opacity-80">
                    {getMoodLabel(index + 1)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center space-x-2 text-purple-700 dark:text-purple-300">
            <Edit3 className="h-4 w-4" />
            <span>Share your thoughts</span>
            <Sparkles className="h-3 w-3 animate-pulse-soft" />
            <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
          </label>
          <Textarea
            placeholder="What made you feel this way? Any special moments or thoughts to remember... ✨"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] resize-none transition-all duration-300 focus:ring-4 focus:ring-purple-200 bg-white/70 backdrop-blur-sm border-purple-200 rounded-2xl text-gray-700 placeholder:text-purple-400"
            maxLength={500}
          />
          <p className="text-xs text-purple-500 flex items-center space-x-1">
            <span>{notes.length}/500 characters</span>
            {notes.length > 400 && <span className="animate-bounce-soft">📝</span>}
          </p>
        </div>

        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4">
          <Button
            onClick={saveMoodEntry}
            disabled={selectedMood === null || !user}
            className="flex-1 h-12 text-base font-semibold transition-all duration-300 hover-scale gradient-button text-white rounded-2xl shadow-cute"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {todayEntry ? t('updateMood') : t('saveMood')}
            <Sparkles className="h-4 w-4 ml-2 animate-pulse-soft" />
          </Button>
          {todayEntry && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedMood(parseInt(todayEntry.mood_scale));
                setNotes(todayEntry.notes || '');
              }}
              className="h-12 px-6 text-base bg-white/70 hover:bg-white/90 backdrop-blur-sm border-purple-200 rounded-2xl hover-scale"
            >
              Reset 🔄
            </Button>
          )}
        </div>

        {!user && (
          <div className="text-center p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl border border-yellow-200">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center justify-center space-x-2">
              <span>🎭</span>
              <span>{t('guestModeNote')}</span>
              <span>✨</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
