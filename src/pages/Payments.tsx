import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  payment_number: string;
  date: string;
  amount: number;
  method: string;
  status: string;
  description: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      // TODO: Créer la table payments dans Supabase
      setPayments([]);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      'paye': 'default',
      'en_attente': 'secondary',
      'echoue': 'destructive',
    };
    return variants[status] || 'default';
  };

  const totalPaid = payments.filter(p => p.status === 'paye').reduce((sum, p) => sum + p.amount, 0);

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
        <h1 className="text-3xl font-bold text-foreground">Paiements</h1>
        <p className="text-muted-foreground mt-1">Gérez vos paiements et factures médicales</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total payé</p>
              <h3 className="text-2xl font-bold mt-1">{totalPaid} FCFA</h3>
            </div>
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Paiements</p>
              <h3 className="text-2xl font-bold mt-1">{payments.length}</h3>
            </div>
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {payments.length === 0 ? (
        <Card className="p-12 text-center">
          <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun paiement</h3>
          <p className="text-muted-foreground">Vos paiements apparaîtront ici</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-6 hover:shadow-elegant transition-all">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Paiement #{payment.payment_number}</h3>
                    <Badge variant={getStatusBadge(payment.status)}>
                      {payment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{payment.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.date).toLocaleDateString('fr-FR')} • {payment.method}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-2xl font-bold">{payment.amount} FCFA</p>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Reçu
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
