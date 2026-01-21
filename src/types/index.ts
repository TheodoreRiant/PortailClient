// Types pour le Portail Client

// ==========================================
// Types de base
// ==========================================

export interface Client {
  id: string;
  nom: string;
  entreprise: string;
  email: string;
  emailSecondaire?: string;
  telephone?: string;
  adresse?: string;
  siret?: string;
  numeroTVA?: string;
  portailActif: boolean;
  motDePasseHash: string;
  derniereConnexion?: string;
  tokenResetPassword?: string;
  tokenResetExpiry?: string;
}

export interface Projet {
  id: string;
  nom: string;
  clientId: string;
  statut: ProjetStatut;
  dateDebut?: string;
  dateFinEstimee?: string;
  dateFin?: string;
  montantTotal: number;
  joursEstimes?: number;
  tauxJournalier?: number;
  visiblePortail: boolean;
  descriptionPublique: string;
  pourcentageAvancement: number;
  tags?: string[];
  priorite?: Priorite;
}

export type ProjetStatut =
  | "À valider"
  | "En cours"
  | "En pause"
  | "Terminé"
  | "Refusé";

export type Priorite =
  | "Basse"
  | "Normale"
  | "Haute"
  | "Urgente";

export interface Livrable {
  id: string;
  nom: string;
  description: string;
  projetId: string;
  projetNom?: string;
  clientId: string;
  statut: LivrableStatut;
  type: LivrableType;
  lot?: string;
  version: string;
  fichierPrecedentId?: string;
  fichiers: NotionFile[];
  lienExterne?: string;
  dateCreation: string;
  dateLivraison?: string;
  dateValidation?: string;
  validePar?: string;
  commentairesClient?: string;
  visiblePortail: boolean;
  validations?: Validation[];
}

export type LivrableStatut =
  | "En préparation"
  | "À valider"
  | "Validé"
  | "Refusé"
  | "Livré";

export type LivrableType =
  | "Document"
  | "Maquette"
  | "Code"
  | "Rapport"
  | "Autre";

export interface NotionFile {
  name: string;
  url: string;
  type: string;
}

export interface Facture {
  id: string;
  numero: string;
  clientId: string;
  projetId?: string;
  projetNom?: string;
  montantHT: number;
  tauxTVA: number;
  montantTVA: number;
  montantTTC: number;
  dateEmission: string;
  dateEcheance: string;
  datePaiement?: string;
  statut: FactureStatut;
  fichierPDF?: string;
  visiblePortail: boolean;
}

export type FactureStatut =
  | "Brouillon"
  | "Envoyée"
  | "Payée"
  | "En retard"
  | "Annulée";

export interface Validation {
  id: string;
  titre: string;
  livrableId: string;
  projetId: string;
  clientId: string;
  statut: ValidationStatut;
  dateCreation: string;
  dateValidation?: string;
  commentaire?: string;
  noteSatisfaction?: number;
  typeValidation: TypeValidation;
}

export type ValidationStatut =
  | "En attente"
  | "Approuvé"
  | "Refusé"
  | "À modifier";

export type TypeValidation =
  | "Maquette"
  | "Contenu"
  | "Fonctionnalité"
  | "Livrable final";

// ==========================================
// Types pour les réponses API
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==========================================
// Types pour le Dashboard
// ==========================================

export interface DashboardStats {
  projetsActifs: number;
  livrablesAValider: number;
  facturesImpayees: number;
  montantDu: number;
}

export interface ActivityItem {
  id: string;
  type: 'livrable' | 'validation' | 'facture' | 'projet' | 'commentaire';
  titre: string;
  description: string;
  date: string;
  lien?: string;
}

export interface Deadline {
  id: string;
  type: 'facture' | 'projet' | 'livrable';
  titre: string;
  date: string;
  statut: string;
}

// ==========================================
// Types pour les notifications
// ==========================================

export interface Notification {
  id: string;
  type: NotificationType;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
  lien?: string;
}

export type NotificationType =
  | "nouveau_livrable"
  | "validation"
  | "nouvelle_facture"
  | "rappel_paiement"
  | "projet_termine"
  | "commentaire";

// ==========================================
// Types pour l'authentification
// ==========================================

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  entreprise: string;
}

// ==========================================
// Types pour les formulaires
// ==========================================

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface NewPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ValidationFormData {
  statut: 'Approuvé' | 'Refusé' | 'À modifier';
  commentaire?: string;
  urgence?: 'Mineur' | 'Moyen' | 'Important' | 'Bloquant';
  noteSatisfaction?: number;
}

export interface ProfileFormData {
  nom: string;
  email: string;
  telephone?: string;
  entreprise: string;
  adresse?: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ==========================================
// Types pour les commentaires
// ==========================================

export interface Commentaire {
  id: string;
  livrableId: string;
  auteur: string;
  auteurType: 'client' | 'agence';
  contenu: string;
  dateCreation: string;
}

// ==========================================
// Extension des types NextAuth
// ==========================================

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }

  interface User extends SessionUser {}
}

