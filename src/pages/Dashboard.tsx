import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { storage } from '@/lib/storage';
import type { Patient, Appointment } from '@/types';

const Dashboard = () => {
  const patients = storage.get<Patient[]>('patients') || [];
  const appointments = storage.get<Appointment[]>('appointments') || [];
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(app => app.date === today);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de votre établissement</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          trend={{ value: '+12% ce mois', positive: true }}
        />
        <StatsCard
          title="Rendez-vous du jour"
          value={todayAppointments.length}
          icon={Calendar}
          trend={{ value: '3 en attente', positive: true }}
        />
        <StatsCard
          title="Médecins actifs"
          value={8}
          icon={Activity}
        />
        <StatsCard
          title="Taux d'occupation"
          value="87%"
          icon={TrendingUp}
          trend={{ value: '+5% vs hier', positive: true }}
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
                {todayAppointments.map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div>
                        <p className="font-medium">{patient?.firstName} {patient?.lastName}</p>
                        <p className="text-sm text-muted-foreground">{appointment.motif}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{appointment.time}</p>
                        <p className="text-xs text-muted-foreground capitalize">{appointment.status}</p>
                      </div>
                    </div>
                  );
                })}
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
              {patients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">{patient.firstName[0]}{patient.lastName[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{patient.firstName} {patient.lastName}</p>
                    <p className="text-xs text-muted-foreground">{patient.age} ans · {patient.gender}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
