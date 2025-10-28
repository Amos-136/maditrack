import { Building2, User, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import type { User as UserType, Organization } from '@/types';

const Settings = () => {
  const user = storage.get<UserType>('currentUser');
  const organization = storage.get<Organization>('organization');

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez votre profil et votre établissement</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil utilisateur
            </CardTitle>
            <CardDescription>
              Vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" defaultValue={user?.firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" defaultValue={user?.lastName} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Input id="role" defaultValue={user?.role} disabled className="capitalize" />
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary-glow">
              Enregistrer les modifications
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Établissement
            </CardTitle>
            <CardDescription>
              Informations de votre structure médicale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Nom de l'établissement</Label>
              <Input id="orgName" defaultValue={organization?.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgType">Type</Label>
              <Input
                id="orgType"
                defaultValue={organization?.type}
                disabled
                className="capitalize"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgAddress">Adresse</Label>
              <Input id="orgAddress" defaultValue={organization?.address} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orgPhone">Téléphone</Label>
              <Input id="orgPhone" defaultValue={organization?.phone} />
            </div>
            <Button className="bg-gradient-to-r from-primary to-primary-glow">
              Enregistrer les modifications
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Clés API
            </CardTitle>
            <CardDescription>
              Gérez vos intégrations (disponible avec Lovable Cloud)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Les intégrations API seront disponibles après activation de Lovable Cloud</p>
              <p className="text-sm mt-2">OpenAI · Paystack · SMS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
