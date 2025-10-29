import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CreditCard, 
  UserCog, 
  Bot, 
  Settings,
  Activity,
  Package,
  ShoppingCart,
  TrendingUp,
  FileText,
  History,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// Navigation pour hôpitaux et cliniques
const medicalNavigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Rendez-vous', href: '/appointments', icon: Calendar },
  { name: 'Personnel', href: '/staff', icon: UserCog },
  { name: 'Abonnements', href: '/subscriptions', icon: CreditCard },
  { name: 'Assistant IA', href: '/assistant', icon: Bot },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

// Navigation pour pharmacies
const pharmacyNavigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Commandes', href: '/orders', icon: ShoppingCart },
  { name: 'Ventes', href: '/sales', icon: TrendingUp },
  { name: 'Abonnements', href: '/subscriptions', icon: CreditCard },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

// Navigation pour particuliers
const individualNavigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Mes ordonnances', href: '/prescriptions', icon: FileText },
  { name: 'Historique médical', href: '/medical-history', icon: History },
  { name: 'Paiements', href: '/payments', icon: Wallet },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const [navigation, setNavigation] = useState(medicalNavigation);
  const [organizationCategory, setOrganizationCategory] = useState<string>('hopital');

  useEffect(() => {
    const fetchOrganizationCategory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profile?.organization_id) {
        const { data: org } = await supabase
          .from('organizations')
          .select('category')
          .eq('id', profile.organization_id)
          .single();

        if (org?.category) {
          setOrganizationCategory(org.category);
          
          // Définir la navigation selon la catégorie
          if (org.category === 'hopital' || org.category === 'clinique') {
            setNavigation(medicalNavigation);
          } else if (org.category === 'pharmacie') {
            setNavigation(pharmacyNavigation);
          } else if (org.category === 'particulier') {
            setNavigation(individualNavigation);
          }
        }
      }
    };

    fetchOrganizationCategory();
  }, []);
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-card shadow-lg animate-slide-in-right">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6 mb-8 animate-fade-in">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mr-3 shadow-elegant">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MediTrack.ai</h1>
            <p className="text-xs text-muted-foreground">Gestion Médicale</p>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              style={{ animationDelay: `${index * 0.05}s` }}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all animate-fade-in',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-elegant'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110',
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
