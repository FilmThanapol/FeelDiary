
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CalendarDays, Edit, Save, Trash2, BarChart3 } from 'lucide-react';
import { MoodInsights } from './MoodInsights';

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
    <div className="space-y-6">
      {/* Calendar and Recent Entries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>{t('calendar')}</span>
              <Badge variant="secondary">{moodEntries.length} {t('entries')}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateClick}
              className="rounded-md border w-full"
              modifiers={{
                mood: (date) => !!getMoodForDate(date),
              }}
              modifiersClassNames={{
                mood: 'bg-primary text-primary-foreground hover:bg-primary/90',
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const entry = getMoodForDate(date);
                  return (
                    <div className="relative">
                      <button
                        {...props}
                        className={entry ? 'font-bold' : ''}
                      >
                        {date.getDate()}
                        {entry && (
                          <div className="absolute -top-1 -right-1 text-lg">
                            {entry.mood_emoji}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Recent Entries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {moodEntries.slice(0, 8).map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 ${
                    moodColors[parseInt(entry.mood_scale) - 1]
                  }`}
                  onClick={() => {
                    setSelectedEntry(entry);
                    setEditingNotes(entry.notes || '');
                    setEditingMood(parseInt(entry.mood_scale));
                    setIsDialogOpen(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{entry.mood_emoji}</span>
                      <span className="font-medium text-sm">{format(new Date(entry.date), 'MMM dd')}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getMoodLabel(parseInt(entry.mood_scale))}
                    </Badge>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {entry.notes}
                    </p>
                  )}
                </div>
              ))}
              {moodEntries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t('noMoodEntries')}</p>
                  <p className="text-xs">{t('startTracking')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Insights */}
      <MoodInsights moodData={moodEntries} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>
                {selectedEntry && format(new Date(selectedEntry.date), 'MMMM dd, yyyy')}
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block flex items-center space-x-2">
                  <span>Mood Rating</span>
                  <Badge variant="outline">{getMoodLabel(editingMood)}</Badge>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {moodEmojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant={editingMood === index + 1 ? 'default' : 'outline'}
                      className={`h-16 transition-all duration-200 ${
                        editingMood === index + 1 ? 'scale-105 shadow-lg' : 'hover:scale-105'
                      }`}
                      onClick={() => setEditingMood(index + 1)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{emoji}</div>
                        <div className="text-xs font-medium">{getMoodLabel(index + 1)}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Notes</span>
                  <span className="text-xs text-muted-foreground">(Optional)</span>
                </label>
                <Textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="What influenced your mood? Any thoughts or reflections..."
                  className="min-h-[120px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {editingNotes.length}/500 characters
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={updateMoodEntry}
                  className="flex-1 h-11"
                  size="lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('save')}
                </Button>
                <Button
                  variant="destructive"
                  onClick={deleteMoodEntry}
                  className="h-11 px-6"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
