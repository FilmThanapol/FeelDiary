
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState<any>(null);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('20:00');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setDailyReminder(data.daily_reminder);
        setReminderTime(data.reminder_time || '20:00');
        
        // Set theme and language from profile
        if (data.theme && (data.theme === 'light' || data.theme === 'dark')) {
          setTheme(data.theme);
        }
        if (data.language) i18n.changeLanguage(data.language);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
        });

      if (error) throw error;

      toast({
        title: t('success'),
        description: 'Profile updated successfully!',
      });

      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('error'),
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
    updateProfile({ language: newLang });
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateProfile({ theme: newTheme });
  };

  const updateReminder = (enabled: boolean) => {
    setDailyReminder(enabled);
    updateProfile({ daily_reminder: enabled });
  };

  const updateReminderTime = (time: string) => {
    setReminderTime(time);
    updateProfile({ reminder_time: time });
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
      <Card>
        <CardHeader>
          <CardTitle>{t('profile')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.user_metadata?.avatar_url || '/placeholder.svg'}
              alt="Avatar"
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-medium">{user.user_metadata?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t('theme')}</h4>
              <p className="text-sm text-muted-foreground">
                {theme === 'light' ? t('light') : t('dark')}
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t('language')}</h4>
              <p className="text-sm text-muted-foreground">
                {i18n.language === 'en' ? 'English' : 'ไทย'}
              </p>
            </div>
            <Button variant="outline" onClick={toggleLanguage}>
              {i18n.language === 'en' ? 'ไทย' : 'English'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t('dailyReminder')}</h4>
              <p className="text-sm text-muted-foreground">
                Get reminded to log your mood
              </p>
            </div>
            <Switch
              checked={dailyReminder}
              onCheckedChange={updateReminder}
            />
          </div>

          {dailyReminder && (
            <div>
              <label className="font-medium block mb-2">{t('reminderTime')}</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => updateReminderTime(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
