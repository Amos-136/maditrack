import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Prescription {
  id: string;
  prescription_number: string;
  doctor_name: string;
  date: string;
  status: string;
  medications: string[];
}

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      // TODO: Créer la table prescriptions dans Supabase
      setPrescriptions([]);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos ordonnances",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      'active': 'default',
      'expiree': 'secondary',
      'utilisee': 'destructive',
    };
    return variants[status] || 'default';
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
        <h1 className="text-3xl font-bold text-foreground">Mes Ordonnances</h1>
        <p className="text-muted-foreground mt-1">Consultez et gérez vos ordonnances médicales</p>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune ordonnance</h3>
          <p className="text-muted-foreground">Vos ordonnances médicales apparaîtront ici</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="p-6 hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Ordonnance #{prescription.prescription_number}</h3>
                    <Badge variant={getStatusBadge(prescription.status)}>
                      {prescription.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prescrite par: Dr. {prescription.doctor_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(prescription.date).toLocaleDateString('fr-FR')}
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Médicaments:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {prescription.medications.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                  <Button variant="outline" size="sm">Détails</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
