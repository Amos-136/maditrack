export type OrganizationType = 'hopital_public' | 'clinique_privee' | 'centre_sante';
export type UserRole = 'admin' | 'medecin' | 'infirmier' | 'secretaire';
export type AppointmentStatus = 'planifie' | 'en_cours' | 'termine' | 'annule';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  service?: string;
  avatar?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  logo?: string;
  address?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F' | 'Autre';
  phone: string;
  email?: string;
  address?: string;
  antecedents?: string;
  traitement?: string;
  medecinReferent?: string;
  dateInscription: string;
  organizationId: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  medecinId: string;
  date: string;
  time: string;
  duration: number;
  motif: string;
  status: AppointmentStatus;
  notes?: string;
  organizationId: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  plan: 'basic' | 'pro' | 'clinic';
  status: 'active' | 'inactive' | 'cancelled';
  amount: number;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface Payment {
  id: string;
  organizationId: string;
  subscriptionId: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
}
