import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  UserCog, 
  Bot, 
  Settings,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Rendez-vous', href: '/appointments', icon: Calendar },
  { name: 'Abonnements', href: '/subscriptions', icon: CreditCard },
  { name: 'Personnel', href: '/staff', icon: UserCog },
  { name: 'Assistant IA', href: '/assistant', icon: Bot },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8">
          <Activity className="h-8 w-8 text-primary mr-3" />
          <div>
            <h1 className="text-xl font-bold text-foreground">MediTrack.ai</h1>
            <p className="text-xs text-muted-foreground">Gestion Médicale</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110',
                      isActive && 'text-primary-foreground'
                    )}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
