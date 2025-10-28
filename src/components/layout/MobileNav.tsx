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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {mobileNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('h-5 w-5', isActive && 'scale-110')} />
                <span className="text-xs font-medium">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
