import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboardIcon, FileTextIcon, LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '../../stores/authStore';
import { ThemeToggle } from '../ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { path: '/admin/tests', label: 'Pruebas', icon: FileTextIcon },
];

export function SidebarNav() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // -------------------------------
  // 🛡 FIX: valores seguros
  // -------------------------------
  const displayName = user
    ? ((user as any).name ?? user.email ?? "Usuario")
    : "Usuario";
  const avatarLetter = displayName ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-20">
      <div className="p-8">
        <h1 className="text-2xl font-alt font-bold text-foreground">TestIA</h1>
        <p className="text-sm text-muted-foreground mt-1">Panel de evaluación</p>
      </div>

      <Separator className="bg-border" />

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-transparent text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-border" />

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {avatarLetter}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ?? ""}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex-1 justify-start gap-3 bg-transparent text-foreground hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOutIcon className="w-5 h-5" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </aside>
  );
}
