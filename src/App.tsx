
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { WellnessHub } from './components/WellnessHub';
import { Profile } from './components/Profile';
import { AuthPage } from './components/AuthPage';
import './lib/i18n';

const queryClient = new QueryClient();

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGuestMode, setIsGuestMode] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuestMode) {
    return <AuthPage onGuestMode={() => setIsGuestMode(true)} />;
  }

  const renderContent = () => {
    try {
      switch (activeTab) {
        case 'calendar':
          return <CalendarView />;
        case 'wellness':
          return <WellnessHub />;
        case 'profile':
          return <Profile />;
        case 'dashboard':
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Component Error</h2>
          <p className="text-gray-600 mb-4">There was an error loading this section: {error.message}</p>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);



export default App;
