import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const staffSchema = z.object({
  full_name: z.string().min(2, 'Le nom complet est requis').max(100),
  email: z.string().email('Email invalide'),
  service: z.string().min(1, 'Le service est requis'),
  role: z.enum(['admin', 'medecin', 'infirmier', 'secretaire', 'pharmacien', 'user']),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface NewStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewStaffDialog({ open, onOpenChange, onSuccess }: NewStaffDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      full_name: '',
      email: '',
      service: '',
      role: 'user',
      password: '',
    },
  });

  const onSubmit = async (values: StaffFormValues) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Erreur lors de la récupération de votre profil: ' + profileError.message);
      }

      if (!profile?.organization_id) {
        throw new Error('⚠️ Vous n\'êtes rattaché à aucune organisation. Veuillez contacter votre administrateur ou créer une nouvelle organisation.');
      }

      // Créer le compte utilisateur
      const { data: newUser, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            organization_id: profile.organization_id,
            service: values.service,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (newUser.user) {
        // Attendre que le profil soit créé par le trigger
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Assigner le rôle
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: newUser.user.id,
            role: values.role as 'admin' | 'moderator' | 'user',
            assigned_by: user.id,
          }]);

        if (roleError) throw roleError;
      }

      toast({
        title: 'Succès',
        description: 'Membre du personnel ajouté avec succès',
      });

      form.reset();
      onOpenChange(false);
      onSuccess();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un membre du personnel</DialogTitle>
          <DialogDescription>
            Créer un nouveau compte pour un membre de votre organisation
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe temporaire *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service *</FormLabel>
                    <FormControl>
                      <Input placeholder="Cardiologie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="medecin">Médecin</SelectItem>
                        <SelectItem value="infirmier">Infirmier</SelectItem>
                        <SelectItem value="secretaire">Secrétaire</SelectItem>
                        <SelectItem value="pharmacien">Pharmacien</SelectItem>
                        <SelectItem value="user">Utilisateur</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer le compte'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
