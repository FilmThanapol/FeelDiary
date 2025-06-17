
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
// These will be translated dynamically in the component

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
        <CardContent className="p-6">
          <div className="text-center">{t('loading')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-t-4 border-t-primary hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>{t('todayMood')}</span>
            {todayEntry && (
              <Badge variant="secondary" className="ml-2">
                Updated
              </Badge>
            )}
          </div>
          {todayEntry && (
            <div className="flex items-center space-x-2">
              <span className="text-3xl animate-pulse">{todayEntry.mood_emoji}</span>
              <Badge variant="outline">{getMoodLabel(parseInt(todayEntry.mood_scale))}</Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-4 flex items-center space-x-2">
            <span>{t('howAreYou')}</span>
            {selectedMood > 0 && (
              <Badge variant="outline" className="text-xs">
                {getMoodDescription(selectedMood)}
              </Badge>
            )}
          </h3>
          <div className="grid grid-cols-5 gap-3">
            {moodEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant={selectedMood === index + 1 ? 'default' : 'outline'}
                className={`h-20 text-3xl transition-all duration-200 hover:scale-105 ${
                  selectedMood === index + 1
                    ? `${moodColors[index]} text-white shadow-lg scale-105`
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedMood(index + 1)}
              >
                <div className="text-center">
                  <div className="mb-1">{emoji}</div>
                  <div className="text-xs font-medium">{getMoodLabel(index + 1)}</div>
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
            className="min-h-[120px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground">
            {notes.length}/500 characters
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={saveMoodEntry}
            disabled={selectedMood === null || !user}
            className="flex-1 h-12 text-base font-medium transition-all duration-200 hover:scale-105"
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
              className="h-12 px-6"
            >
              Reset
            </Button>
          )}
        </div>

        {!user && (
          <p className="text-sm text-muted-foreground text-center">
            {t('guestModeNote')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
