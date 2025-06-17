
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

const moodEmojis = ['😢', '😞', '😐', '😊', '😄'];
const moodColors = ['bg-red-100 border-red-300', 'bg-orange-100 border-orange-300', 'bg-yellow-100 border-yellow-300', 'bg-green-100 border-green-300', 'bg-blue-100 border-blue-300'];

export const CalendarView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingMood, setEditingMood] = useState<number>(3);

  useEffect(() => {
    if (user) {
      fetchMoodEntries();
    }
  }, [user]);

  const fetchMoodEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    }
  };

  const getMoodForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return moodEntries.find(entry => entry.date === dateStr);
  };

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    const entry = getMoodForDate(date);
    
    if (entry) {
      setSelectedEntry(entry);
      setEditingNotes(entry.notes || '');
      setEditingMood(parseInt(entry.mood_scale));
      setIsDialogOpen(true);
    }
  };

  const updateMoodEntry = async () => {
    if (!selectedEntry || !user) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .update({
          mood_scale: editingMood.toString() as "1" | "2" | "3" | "4" | "5",
          mood_emoji: moodEmojis[editingMood - 1],
          notes: editingNotes.trim() || null,
        })
        .eq('id', selectedEntry.id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: 'Mood entry updated successfully!',
      });

      setIsDialogOpen(false);
      fetchMoodEntries();
    } catch (error) {
      console.error('Error updating mood entry:', error);
      toast({
        title: t('error'),
        description: 'Failed to update mood entry',
        variant: 'destructive',
      });
    }
  };

  const deleteMoodEntry = async () => {
    if (!selectedEntry || !user) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', selectedEntry.id);

      if (error) throw error;

      toast({
        title: t('success'),
        description: 'Mood entry deleted successfully!',
      });

      setIsDialogOpen(false);
      fetchMoodEntries();
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      toast({
        title: t('error'),
        description: 'Failed to delete mood entry',
        variant: 'destructive',
      });
    }
  };

  const getMoodLabel = (mood: number) => {
    const labels = [t('terrible'), t('bad'), t('okay'), t('good'), t('excellent')];
    return labels[mood - 1];
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">{t('guestModeNote')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('calendar')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            className="rounded-md border"
            modifiers={{
              mood: (date) => !!getMoodForDate(date),
            }}
            modifiersClassNames={{
              mood: 'bg-primary text-primary-foreground',
            }}
            components={{
              Day: ({ date, ...props }) => {
                const entry = getMoodForDate(date);
                return (
                  <div className="relative">
                    <button {...props}>
                      {date.getDate()}
                      {entry && (
                        <div className="absolute -top-1 -right-1 text-xs">
                          {entry.mood_emoji}
                        </div>
                      )}
                    </button>
                  </div>
                );
              },
            }}
          />
          
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Recent Entries</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {moodEntries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow ${
                    moodColors[parseInt(entry.mood_scale) - 1]
                  }`}
                  onClick={() => {
                    setSelectedEntry(entry);
                    setEditingNotes(entry.notes || '');
                    setEditingMood(parseInt(entry.mood_scale));
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{entry.mood_emoji}</span>
                      <span className="font-medium">{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {getMoodLabel(parseInt(entry.mood_scale))}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEntry && format(new Date(selectedEntry.date), 'MMMM dd, yyyy')}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mood</label>
                <div className="flex space-x-2">
                  {moodEmojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant={editingMood === index + 1 ? 'default' : 'outline'}
                      className="flex-1 h-12"
                      onClick={() => setEditingMood(index + 1)}
                    >
                      <div className="text-center">
                        <div className="text-lg">{emoji}</div>
                        <div className="text-xs">{getMoodLabel(index + 1)}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add your thoughts..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={updateMoodEntry} className="flex-1">
                  {t('save')}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={deleteMoodEntry}
                  className="flex-1"
                >
                  {t('delete')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
