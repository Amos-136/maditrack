import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  full_name: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  medecin_id?: string;
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name, age, gender, phone, email, medecin_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
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

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.phone && patient.phone.includes(searchTerm))
  );

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
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground mt-1">Gérez vos patients</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau patient
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => {
          const initials = patient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2);
          return (
            <Card key={patient.id} className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold">{initials}</span>
                  </div>
                  {patient.age && (
                    <Badge variant={patient.gender === 'masculin' ? 'default' : 'secondary'}>
                      {patient.age} ans
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg mb-1">
                  {patient.full_name}
                </h3>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  {patient.phone && (
                    <p className="flex items-center gap-2">
                      📞 {patient.phone}
                    </p>
                  )}
                  {patient.email && (
                    <p className="flex items-center gap-2">
                      ✉️ {patient.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun patient trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Patients;
