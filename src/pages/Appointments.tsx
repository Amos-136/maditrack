import { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NewAppointmentDialog } from '@/components/dialogs/NewAppointmentDialog';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  patient_id: string;
  date: string;
  status: string;
  notes?: string;
  patients?: {
    id: string;
    full_name: string;
  };
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [selectedDate] = useState(new Date());

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, patient_id, date, status, notes, patients(id, full_name)')
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planifie: 'default',
      en_cours: 'secondary',
      termine: 'outline',
      annule: 'destructive',
    };
    return colors[status as keyof typeof colors] || 'default';
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
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground mt-1">Planifiez et gérez vos consultations</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-primary-glow"
          onClick={() => setDialogOpen(true)}
        >
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
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">{appointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Planifiés</span>
                  <Badge variant="default" className="text-xs">
                    {appointments.filter((a) => a.status === 'planifie').length}
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
              {appointments.map((appointment) => {
                const appointmentDate = new Date(appointment.date);
                return (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center p-3 bg-primary/10 rounded-lg min-w-[80px]">
                      <Clock className="h-4 w-4 text-primary mb-1" />
                      <span className="text-sm font-semibold text-primary">
                        {format(appointmentDate, 'HH:mm')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(appointmentDate, 'dd/MM')}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold truncate">
                          {appointment.patients?.full_name || 'Patient inconnu'}
                        </p>
                        <Badge variant={getStatusColor(appointment.status) as any} className="text-xs capitalize">
                          {appointment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {appointment.notes || 'Pas de motif'}
                      </p>
                    </div>

                    <Button variant="ghost" size="sm">
                      Détails
                    </Button>
                  </div>
                );
              })}

              {appointments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">Aucun rendez-vous planifié</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <NewAppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={loadAppointments}
      />
    </div>
  );
};

export default Appointments;
