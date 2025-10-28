import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import type { Appointment, Patient } from '@/types';

const Appointments = () => {
  const appointments = storage.get<Appointment[]>('appointments') || [];
  const patients = storage.get<Patient[]>('patients') || [];
  const [selectedDate] = useState(new Date());

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planifie: 'default',
      en_cours: 'secondary',
      termine: 'outline',
      annule: 'destructive'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground mt-1">Planifiez et gérez vos consultations</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{selectedDate.getDate()}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total aujourd'hui</span>
                  <span className="font-semibold">{appointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planifiés</span>
                  <Badge variant="default" className="text-xs">
                    {appointments.filter(a => a.status === 'planifie').length}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Liste des rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center p-3 bg-primary/10 rounded-lg min-w-[80px]">
                    <Clock className="h-4 w-4 text-primary mb-1" />
                    <span className="text-sm font-semibold text-primary">{appointment.time}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{getPatientName(appointment.patientId)}</p>
                      <Badge variant={getStatusColor(appointment.status) as any} className="text-xs capitalize">
                        {appointment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{appointment.motif}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Durée: {appointment.duration} min
                    </p>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    Détails
                  </Button>
                </div>
              ))}
              
              {sortedAppointments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun rendez-vous planifié
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
