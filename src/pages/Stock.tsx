import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

const Stock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStock();
  }, []);

  const loadStock = async () => {
    try {
      setLoading(true);
      // TODO: Créer la table stock dans Supabase
      setStock([]);
    } catch (error) {
      console.error('Error loading stock:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le stock",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Stock</h1>
          <p className="text-muted-foreground mt-1">Gérez votre inventaire de médicaments</p>
        </div>
        <Button className="shadow-elegant">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredStock.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun produit en stock</h3>
          <p className="text-muted-foreground">Commencez par ajouter des produits à votre inventaire</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStock.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-elegant transition-all">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Quantité: {item.quantity} {item.unit}</p>
                <p>Prix: {item.price} FCFA</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">Modifier</Button>
                <Button variant="outline" size="sm">Supprimer</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Stock;
