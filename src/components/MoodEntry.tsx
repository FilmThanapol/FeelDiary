
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">{t('loading')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{t('todayMood')}</span>
          {todayEntry && (
            <span className="text-2xl">{todayEntry.mood_emoji}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">{t('howAreYou')}</h3>
          <div className="flex justify-between space-x-2">
            {moodEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant={selectedMood === index + 1 ? 'default' : 'outline'}
                className={`flex-1 h-16 text-2xl ${
                  selectedMood === index + 1 ? moodColors[index] : ''
                }`}
                onClick={() => setSelectedMood(index + 1)}
              >
                <div className="text-center">
                  <div>{emoji}</div>
                  <div className="text-xs mt-1">{getMoodLabel(index + 1)}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            {t('addNotes')}
          </label>
          <Textarea
            placeholder="What's on your mind?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Button
          onClick={saveMoodEntry}
          disabled={selectedMood === null || !user}
          className="w-full"
        >
          {todayEntry ? t('updateMood') : t('saveMood')}
        </Button>

        {!user && (
          <p className="text-sm text-muted-foreground text-center">
            {t('guestModeNote')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
