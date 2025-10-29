import { useEffect, useState } from 'react';
import { Plus, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NewStaffDialog } from '@/components/dialogs/NewStaffDialog';

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  service?: string;
  role?: string;
}

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
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, service')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Charger les rôles séparément
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combiner les données
      const staffWithRoles = profiles?.map(profile => ({
        ...profile,
        role: roles?.find(r => r.user_id === profile.id)?.role
      })) || [];

      setStaff(staffWithRoles);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel</h1>
          <p className="text-muted-foreground mt-1">Gérez votre équipe médicale</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-primary-glow"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un membre
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => {
          const role = member.role || 'user';
          return (
            <Card key={member.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                    <UserCog className="h-6 w-6 text-secondary" />
                  </div>
                  <Badge variant={getRoleBadge(role) as any} className="capitalize">
                    {role}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-1">{member.full_name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{member.service || 'Service non renseigné'}</p>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    ✉️ {member.email}
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
          );
        })}
      </div>

      <NewStaffDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadStaff}
      />
    </div>
  );
};

export default Staff;
