import { MoonIcon, SunIcon } from 'lucide-react';
import { useThemeStore } from '../stores/themeStore';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="bg-transparent text-foreground hover:bg-muted hover:text-foreground"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
    </Button>
  );
}
