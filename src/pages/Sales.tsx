import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Sale {
  id: string;
  sale_number: string;
  customer_name: string;
  date: string;
  total: number;
  payment_method: string;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      // TODO: Créer la table sales dans Supabase
      setSales([]);
    } catch (error) {
      console.error('Error loading sales:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les ventes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const todaySales = sales.filter(s => 
    new Date(s.date).toDateString() === new Date().toDateString()
  ).length;

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
        <h1 className="text-3xl font-bold text-foreground">Ventes</h1>
        <p className="text-muted-foreground mt-1">Suivez vos ventes et revenus</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventes totales</p>
              <h3 className="text-2xl font-bold mt-1">{sales.length}</h3>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventes aujourd'hui</p>
              <h3 className="text-2xl font-bold mt-1">{todaySales}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chiffre d'affaires</p>
              <h3 className="text-2xl font-bold mt-1">{totalRevenue} FCFA</h3>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {sales.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune vente enregistrée</h3>
          <p className="text-muted-foreground">Les ventes apparaîtront ici</p>
        </Card>
      ) : (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Dernières ventes</h2>
          <div className="space-y-3">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Vente #{sale.sale_number}</p>
                  <p className="text-sm text-muted-foreground">{sale.customer_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sale.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{sale.total} FCFA</p>
                  <p className="text-sm text-muted-foreground">{sale.payment_method}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Sales;
