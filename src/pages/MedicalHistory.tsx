import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, FileText, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MedicalRecord {
  id: string;
  date: string;
  type: string;
  doctor_name: string;
  diagnosis: string;
  notes: string;
}

const MedicalHistory = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMedicalHistory();
  }, []);

  const loadMedicalHistory = async () => {
    try {
      setLoading(true);
      // TODO: Créer la table medical_records dans Supabase
      setRecords([]);
    } catch (error) {
      console.error('Error loading medical history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre historique médical",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Historique Médical</h1>
        <p className="text-muted-foreground mt-1">Consultez votre dossier médical complet</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Consultations</p>
              <h3 className="text-2xl font-bold mt-1">{records.filter(r => r.type === 'consultation').length}</h3>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Examens</p>
              <h3 className="text-2xl font-bold mt-1">{records.filter(r => r.type === 'examen').length}</h3>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <h3 className="text-2xl font-bold mt-1">{records.length}</h3>
            </div>
            <History className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {records.length === 0 ? (
        <Card className="p-12 text-center">
          <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
          <p className="text-muted-foreground">Votre historique médical apparaîtra ici</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <Card key={record.id} className="p-6 hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg capitalize">{record.type}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Médecin: Dr. {record.doctor_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Diagnostic:</span> {record.diagnosis}
                  </p>
                  {record.notes && (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Notes:</span> {record.notes}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm">Détails</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
