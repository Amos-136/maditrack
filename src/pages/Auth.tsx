import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2 } from 'lucide-react';
import { z } from 'zod';

// Server-side input validation schema
const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères').regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides'),
  organizationName: z.string().trim().min(2, 'Le nom de l\'organisation doit contenir au moins 2 caractères').max(200, 'Le nom de l\'organisation ne peut pas dépasser 200 caractères').regex(/^[a-zA-ZÀ-ÿ0-9\s.,'&-]+$/, 'Le nom de l\'organisation contient des caractères invalides'),
  email: z.string().trim().email('Email invalide').max(255, 'L\'email ne peut pas dépasser 255 caractères').toLowerCase(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères').max(100, 'Le mot de passe ne peut pas dépasser 100 caractères').regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule').regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule').regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  organizationCategory: z.enum(['hopital', 'clinique', 'pharmacie', 'particulier'], {
    errorMap: () => ({
      message: 'Type d\'organisation invalide'
    })
  })
});
const loginSchema = z.object({
  email: z.string().trim().email('Email invalide').max(255, 'L\'email ne peut pas dépasser 255 caractères').toLowerCase(),
  password: z.string().min(1, 'Le mot de passe est requis')
});
const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [organizationCategory, setOrganizationCategory] = useState('hopital');
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const rawEmail = formData.get('signup-email') as string;
    const rawPassword = formData.get('signup-password') as string;
    const rawFullName = formData.get('full-name') as string;
    const rawOrganizationName = formData.get('organization-name') as string;
    try {
      // Validate inputs with zod before any operations
      const validatedData = signupSchema.parse({
        fullName: rawFullName,
        organizationName: rawOrganizationName,
        email: rawEmail,
        password: rawPassword,
        organizationCategory: organizationCategory
      });

      // Call secure edge function that handles both organization and user creation
      const {
        data,
        error
      } = await supabase.functions.invoke('signup', {
        body: {
          fullName: validatedData.fullName,
          organizationName: validatedData.organizationName,
          email: validatedData.email,
          password: validatedData.password,
          organizationCategory: validatedData.organizationCategory
        }
      });
      if (error) {
        console.error('Signup error:', error);
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }
      if (data?.error) {
        // Handle validation or other errors from edge function
        if (Array.isArray(data.details)) {
          throw new Error(data.details.join(', '));
        }
        throw new Error(data.error);
      }
      toast({
        title: 'Compte créé !',
        description: 'Vous pouvez maintenant vous connecter.'
      });

      // Switch to login tab
      document.querySelector('[value="login"]')?.dispatchEvent(new Event('click', {
        bubbles: true
      }));
    } catch (error: any) {
      // Handle zod validation errors
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Validation échouée',
          description: firstError.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Erreur',
          description: error.message || 'Une erreur est survenue lors de l\'inscription.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const rawEmail = formData.get('login-email') as string;
    const rawPassword = formData.get('login-password') as string;
    try {
      // Validate login inputs
      const validatedData = loginSchema.parse({
        email: rawEmail,
        password: rawPassword
      });
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      });
      if (error) throw error;
      toast({
        title: 'Connexion réussie !',
        description: 'Vous êtes maintenant connecté.'
      });
      navigate('/');
    } catch (error: any) {
      // Handle zod validation errors
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: 'Validation échouée',
          description: firstError.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Erreur',
          description: error.message || 'Email ou mot de passe incorrect.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg rounded-full bg-slate-600">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">MediTrack.ai</CardTitle>
          <CardDescription>Gestion médicale intelligente
probleme technique pour creer de novelle utilisateur</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="login-email" type="email" placeholder="vous@exemple.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <Input id="login-password" name="login-password" type="password" required />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full text-3xl">
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Nom complet</Label>
                  <Input id="full-name" name="full-name" type="text" placeholder="Dr. Jean Dupont" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Nom de l'organisation</Label>
                  <Input id="organization-name" name="organization-name" type="text" placeholder="Clinique Santé Plus" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-category">Type d'entité</Label>
                  <Select value={organizationCategory} onValueChange={setOrganizationCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hopital">Hôpital</SelectItem>
                      <SelectItem value="clinique">Clinique</SelectItem>
                      <SelectItem value="pharmacie">Pharmacie</SelectItem>
                      <SelectItem value="particulier">Particulier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="signup-email" type="email" placeholder="vous@exemple.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input id="signup-password" name="signup-password" type="password" required minLength={8} />
                  <p className="text-xs text-muted-foreground">
                    Minimum 8 caractères avec majuscule, minuscule et chiffre
                  </p>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full text-2xl">
                  {isLoading ? 'Création...' : 'Créer un compte'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default Auth;