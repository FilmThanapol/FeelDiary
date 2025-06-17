
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Heart, Save, Edit3 } from 'lucide-react';

const moodEmojis = ['😢', '😞', '😐', '😊', '😄'];
const moodColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];

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
          description: 'Mood updated successfully!',
        });
      } else {
        const { error } = await supabase
          .from('mood_entries')
          .insert(moodData);

        if (error) throw error;
        
        toast({
          title: t('success'),
          description: 'Mood saved successfully!',
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
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">{t('loading')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-t-4 border-t-primary hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <span className="text-lg sm:text-xl">{t('todayMood')}</span>
            {todayEntry && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Updated
              </Badge>
            )}
          </div>
          {todayEntry && (
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl animate-pulse">{todayEntry.mood_emoji}</span>
              <Badge variant="outline" className="text-xs sm:text-sm">{getMoodLabel(parseInt(todayEntry.mood_scale))}</Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
        <div>
          <h3 className="text-sm font-medium mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <span>{t('howAreYou')}</span>
            {selectedMood > 0 && (
              <Badge variant="outline" className="text-xs w-fit">
                {getMoodDescription(selectedMood)}
              </Badge>
            )}
          </h3>
          <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-3">
            {moodEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant={selectedMood === index + 1 ? 'default' : 'outline'}
                className={`h-14 sm:h-16 md:h-20 text-xl sm:text-2xl md:text-3xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedMood === index + 1
                    ? `${moodColors[index]} text-white shadow-lg scale-105`
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedMood(index + 1)}
              >
                <div className="text-center">
                  <div className="mb-1">{emoji}</div>
                  <div className="text-xs font-medium hidden sm:block">{getMoodLabel(index + 1)}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center space-x-2">
            <Edit3 className="h-4 w-4" />
            <span>{t('addNotes')}</span>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </label>
          <Textarea
            placeholder={t('notesPlaceholder')}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px] sm:min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {notes.length}/500 characters
          </p>
        </div>

        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-3">
          <Button
            onClick={saveMoodEntry}
            disabled={selectedMood === null || !user}
            className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {todayEntry ? t('updateMood') : t('saveMood')}
          </Button>
          {todayEntry && (
            <Button
              variant="outline"
              onClick={() => {
                setSelectedMood(parseInt(todayEntry.mood_scale));
                setNotes(todayEntry.notes || '');
              }}
              className="h-11 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
            >
              Reset
            </Button>
          )}
        </div>

        {!user && (
          <div className="text-center p-3 sm:p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('guestModeNote')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
