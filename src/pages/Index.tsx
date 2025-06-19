
import { useState } from 'react';
import { MoodEntry } from '@/components/MoodEntry';
import { Dashboard } from '@/components/Dashboard';
import { CalendarView } from '@/components/CalendarView';
import { Profile } from '@/components/Profile';
import { AuthPage } from '@/components/AuthPage';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, BarChart3, User, Heart, Sparkles, Star } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGuestMode, setIsGuestMode] = useState(false);

  if (!user && !isGuestMode) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Cute floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🌟</div>
          <div className="absolute top-32 right-20 text-4xl opacity-20 animate-bounce-soft">💖</div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-wiggle">✨</div>
          <div className="absolute top-1/2 right-10 text-3xl opacity-20 animate-pulse-soft">🦋</div>
          <div className="absolute bottom-32 right-32 text-4xl opacity-20 animate-float">🌈</div>
        </div>
        
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full gradient-card shadow-cute rounded-3xl border-0 hover-lift">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  <Heart className="h-12 w-12 text-pink-500 animate-bounce-soft" />
                  <Sparkles className="h-8 w-8 text-purple-500 animate-pulse-soft mt-2" />
                </div>
                <h1 className="text-4xl font-bold text-gradient">Welcome to FeelDiary</h1>
                <p className="text-xl text-purple-600 dark:text-purple-300">
                  Your personal space for tracking emotions and celebrating every moment ✨
                </p>
                <div className="flex justify-center space-x-3">
                  <span className="text-2xl animate-wiggle">🌟</span>
                  <span className="text-2xl animate-bounce-soft">💝</span>
                  <span className="text-2xl animate-float">🦄</span>
                </div>
              </div>
              <AuthPage onGuestMode={() => setIsGuestMode(true)} />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, emoji: '📊' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, emoji: '📅' },
    { id: 'profile', label: 'Profile', icon: User, emoji: '👤' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cute floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-16 text-4xl opacity-10 animate-float">🌸</div>
        <div className="absolute top-40 right-24 text-3xl opacity-10 animate-bounce-soft">🌟</div>
        <div className="absolute bottom-40 left-32 text-5xl opacity-10 animate-wiggle">💫</div>
        <div className="absolute top-3/4 right-16 text-2xl opacity-10 animate-pulse-soft">🦋</div>
      </div>
      
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Cute tab navigation */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-purple-100 dark:border-purple-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="flex space-x-2 p-2 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-cute backdrop-blur-sm border border-purple-100">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 hover-scale ${
                    activeTab === tab.id
                      ? 'gradient-button text-white shadow-cute scale-105'
                      : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-purple-900/30'
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.emoji}</span>
                  <tab.icon className="h-4 w-4 mr-2" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && <Star className="h-3 w-3 ml-2 animate-pulse-soft" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
