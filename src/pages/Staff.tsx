import { Plus, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const staff = [
  {
    id: '1',
    name: 'Dr. Marie Dubois',
    role: 'admin',
    service: 'Direction',
    email: 'marie.dubois@meditrack.ai',
    phone: '+33 6 12 34 56 78',
  },
  {
    id: '2',
    name: 'Dr. Pierre Martin',
    role: 'medecin',
    service: 'Cardiologie',
    email: 'pierre.martin@meditrack.ai',
    phone: '+33 6 23 45 67 89',
  },
  {
    id: '3',
    name: 'Sophie Bernard',
    role: 'infirmier',
    service: 'Urgences',
    email: 'sophie.bernard@meditrack.ai',
    phone: '+33 6 34 56 78 90',
  },
  {
    id: '4',
    name: 'Julie Petit',
    role: 'secretaire',
    service: 'Accueil',
    email: 'julie.petit@meditrack.ai',
    phone: '+33 6 45 67 89 01',
  },
];

const getRoleBadge = (role: string) => {
  const variants = {
    admin: 'default',
    medecin: 'secondary',
    infirmier: 'outline',
    secretaire: 'outline',
  };
  return variants[role as keyof typeof variants] || 'outline';
};

const Staff = () => {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel</h1>
          <p className="text-muted-foreground mt-1">Gérez votre équipe médicale</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un membre
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-secondary" />
                </div>
                <Badge variant={getRoleBadge(member.role) as any} className="capitalize">
                  {member.role}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{member.service}</p>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  ✉️ {member.email}
                </p>
                <p className="flex items-center gap-2">
                  📞 {member.phone}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  Modifier
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Retirer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Staff;
