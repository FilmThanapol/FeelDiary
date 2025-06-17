
import { Button } from '@/components/ui/button';
import { Calendar, BarChart3, User, LogOut, Sun, Moon, Languages } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const navItems = [
    { key: 'dashboard', icon: BarChart3, label: t('dashboard') },
    { key: 'calendar', icon: Calendar, label: t('calendar') },
    { key: 'profile', icon: User, label: t('profile') },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'th' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-primary">Mood Tracker</h1>
            
            {user && (
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => (
                  <Button
                    key={item.key}
                    variant={activeTab === item.key ? 'default' : 'ghost'}
                    className="flex items-center space-x-2"
                    onClick={() => setActiveTab(item.key)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Languages className="h-4 w-4" />
            </Button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <img
                      src={user.user_metadata?.avatar_url || '/placeholder.svg'}
                      alt="Avatar"
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="hidden md:inline">{user.user_metadata?.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {user && (
          <div className="md:hidden flex space-x-2 pb-3">
            {navItems.map((item) => (
              <Button
                key={item.key}
                variant={activeTab === item.key ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => setActiveTab(item.key)}
              >
                <item.icon className="h-3 w-3" />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
