import { useEffect, useState } from 'react';
import { Users, Calendar, Activity, TrendingUp, UserPlus, CalendarPlus, UserCog } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  full_name: string;
  age?: number;
  gender?: string;
  phone?: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  date: string;
  status: string;
  notes?: string;
  patients?: Patient;
}

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [patientsResult, appointmentsResult] = await Promise.all([
        supabase.from('patients').select('id, full_name, age, gender, phone'),
        supabase.from('appointments').select('id, patient_id, date, status, notes, patients(id, full_name)')
      ]);

      if (patientsResult.error) throw patientsResult.error;
      if (appointmentsResult.error) throw appointmentsResult.error;

      setPatients(patientsResult.data || []);
      setAppointments(appointmentsResult.data || []);
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

  const todayAppointments = appointments.filter(app => app.date.startsWith(today));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre établissement</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/patients')} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Nouveau patient
          </Button>
          <Button onClick={() => navigate('/appointments')} className="gap-2">
            <CalendarPlus className="h-4 w-4" />
            Nouveau rendez-vous
          </Button>
          <Button onClick={() => navigate('/staff')} className="gap-2">
            <UserCog className="h-4 w-4" />
            Ajouter un membre
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          trend={{ value: '+12% ce mois', positive: true }}
          href="/patients"
        />
        <StatsCard
          title="Rendez-vous du jour"
          value={todayAppointments.length}
          icon={Calendar}
          trend={{ value: '3 en attente', positive: true }}
          href="/appointments"
        />
        <StatsCard
          title="Médecins actifs"
          value={8}
          icon={Activity}
          href="/staff"
        />
        <StatsCard
          title="Taux d'occupation"
          value="87%"
          icon={TrendingUp}
          trend={{ value: '+5% vs hier', positive: true }}
          href="/dashboard"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rendez-vous du jour</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun rendez-vous aujourd'hui
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium">{appointment.patients?.full_name || 'Patient inconnu'}</p>
                      <p className="text-sm text-muted-foreground">{appointment.notes || 'Pas de notes'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground capitalize">{appointment.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Patients récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.slice(0, 5).map((patient) => {
                const initials = patient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2);
                return (
                  <div key={patient.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{initials}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{patient.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age ? `${patient.age} ans` : 'Âge non renseigné'}
                        {patient.gender && ` · ${patient.gender}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
