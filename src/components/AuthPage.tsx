
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface AuthPageProps {
  onGuestMode: () => void;
}

export const AuthPage = ({ onGuestMode }: AuthPageProps) => {
  const { signInWithGoogle } = useAuth();
  const { t } = useTranslation();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
      // For now, if Google OAuth fails, automatically switch to guest mode
      alert('Google sign-in is not configured yet. Switching to Guest mode!');
      onGuestMode();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">🌅</div>
          <CardTitle className="text-2xl">{t('welcome')}</CardTitle>
          <p className="text-muted-foreground">{t('trackYourMood')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Guest Mode Button - Make it more prominent */}
          <Button
            onClick={onGuestMode}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            🚀 Try the App Now (Guest Mode)
          </Button>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Guest mode lets you explore all features without signing up!
            </p>
            <p className="text-xs text-blue-600">
              ✨ Full access to mood tracking, analytics, and wellness tools
            </p>
          </div>

          {/* Info about Google OAuth */}
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Google sign-in requires additional setup in Supabase dashboard.
              For now, use Guest mode to explore all features!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
