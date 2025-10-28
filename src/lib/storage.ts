// Local storage utilities for demo mode
const STORAGE_PREFIX = 'meditrack_';

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(STORAGE_PREFIX + key);
  },
  
  clear: (): void => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};

// Initialize demo data if not exists
export const initDemoData = () => {
  if (!storage.get('initialized')) {
    // Demo organization
    storage.set('organization', {
      id: 'org_1',
      name: 'Centre Hospitalier Demo',
      type: 'hopital_public',
      address: '123 Avenue de la Santé, Paris',
      phone: '+33 1 23 45 67 89'
    });
    
    // Demo user
    storage.set('currentUser', {
      id: 'user_1',
      email: 'admin@meditrack.ai',
      firstName: 'Dr. Marie',
      lastName: 'Dubois',
      role: 'admin',
      organizationId: 'org_1',
      service: 'Direction'
    });
    
    // Demo patients
    storage.set('patients', [
      {
        id: 'pat_1',
        firstName: 'Jean',
        lastName: 'Martin',
        age: 45,
        gender: 'M',
        phone: '+33 6 12 34 56 78',
        email: 'jean.martin@email.com',
        antecedents: 'Hypertension, Diabète type 2',
        medecinReferent: 'Dr. Dubois',
        dateInscription: new Date().toISOString(),
        organizationId: 'org_1'
      },
      {
        id: 'pat_2',
        firstName: 'Sophie',
        lastName: 'Bernard',
        age: 32,
        gender: 'F',
        phone: '+33 6 98 76 54 32',
        email: 'sophie.bernard@email.com',
        antecedents: 'Asthme',
        medecinReferent: 'Dr. Dubois',
        dateInscription: new Date().toISOString(),
        organizationId: 'org_1'
      }
    ]);
    
    // Demo appointments
    const today = new Date();
    storage.set('appointments', [
      {
        id: 'app_1',
        patientId: 'pat_1',
        medecinId: 'user_1',
        date: today.toISOString().split('T')[0],
        time: '09:00',
        duration: 30,
        motif: 'Consultation de suivi',
        status: 'planifie',
        organizationId: 'org_1'
      },
      {
        id: 'app_2',
        patientId: 'pat_2',
        medecinId: 'user_1',
        date: today.toISOString().split('T')[0],
        time: '14:30',
        duration: 30,
        motif: 'Contrôle respiratoire',
        status: 'planifie',
        organizationId: 'org_1'
      }
    ]);
    
    storage.set('initialized', true);
  }
};
