import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const plans = [
  {
    name: 'Basic',
    price: '9 900',
    period: '/mois',
    description: 'Idéal pour les petites structures',
    features: [
      'Jusqu\'à 50 patients',
      'Gestion des rendez-vous',
      'Support email',
      '5 utilisateurs',
    ],
  },
  {
    name: 'Pro',
    price: '24 900',
    period: '/mois',
    description: 'Pour les cliniques en croissance',
    features: [
      'Jusqu\'à 500 patients',
      'Gestion avancée',
      'Assistant IA inclus',
      'Support prioritaire',
      '20 utilisateurs',
      'Statistiques avancées',
    ],
    popular: true,
  },
  {
    name: 'Clinic',
    price: '49 900',
    period: '/mois',
    description: 'Solution complète pour grands établissements',
    features: [
      'Patients illimités',
      'Toutes les fonctionnalités',
      'IA avancée',
      'Support dédié 24/7',
      'Utilisateurs illimités',
      'API personnalisée',
      'Formation incluse',
    ],
  },
];

const Subscriptions = () => {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Choisissez votre plan
        </h1>
        <p className="text-lg text-muted-foreground">
          Des solutions adaptées à chaque type d'établissement de santé
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative transition-all hover:shadow-xl ${
              plan.popular ? 'border-primary shadow-lg scale-105' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-primary-glow">
                  Plus populaire
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">FCFA{plan.period}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-secondary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-primary-glow'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Choisir {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="max-w-3xl mx-auto bg-gradient-to-br from-muted/50 to-background">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Établissements publics</h3>
          <p className="text-muted-foreground mb-4">
            Tarifs spéciaux et accès subventionné disponibles pour les hôpitaux publics
          </p>
          <Button variant="secondary">
            Contactez-nous
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscriptions;
