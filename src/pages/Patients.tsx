import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import type { Patient } from '@/types';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const patients = storage.get<Patient[]>('patients') || [];

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground mt-1">Gérez vos patients</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-primary-glow">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau patient
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold">{patient.firstName[0]}{patient.lastName[0]}</span>
                </div>
                <Badge variant={patient.gender === 'M' ? 'default' : 'secondary'}>
                  {patient.age} ans
                </Badge>
              </div>
              
              <h3 className="font-semibold text-lg mb-1">
                {patient.firstName} {patient.lastName}
              </h3>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  📞 {patient.phone}
                </p>
                {patient.email && (
                  <p className="flex items-center gap-2">
                    ✉️ {patient.email}
                  </p>
                )}
                {patient.medecinReferent && (
                  <p className="mt-3 pt-3 border-t border-border">
                    👨‍⚕️ {patient.medecinReferent}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun patient trouvé</p>
        </div>
      )}
    </div>
  );
};

export default Patients;
