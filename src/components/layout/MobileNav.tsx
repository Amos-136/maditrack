import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bot, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mobileNavigation = [
  { name: 'Accueil', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Agenda', href: '/appointments', icon: Calendar },
  { name: 'Assistant', href: '/assistant', icon: Bot },
  { name: 'Plus', href: '/settings', icon: Settings },
];

export const MobileNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom shadow-2xl">
      <div className="grid grid-cols-5 h-16">
        {mobileNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 transition-all duration-300',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground active:scale-95'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'transition-all duration-300',
                  isActive && 'scale-110 drop-shadow-lg'
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  'text-xs font-medium transition-all',
                  isActive && 'font-semibold'
                )}>{item.name}</span>
                {isActive && (
                  <div className="absolute bottom-0 h-1 w-8 bg-gradient-to-r from-primary to-primary-glow rounded-t-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
