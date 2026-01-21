# Portail Client Professionnel

Un portail client moderne et sécurisé pour les agences, construit avec Next.js 15, Notion comme backend et une interface utilisateur élégante.

## Fonctionnalités

### Pour les clients
- **Dashboard** : Vue d'ensemble des projets, livrables et factures
- **Projets** : Suivi de l'avancement des projets avec timeline
- **Livrables** : Consultation et validation des livrables avec système de feedback
- **Factures** : Consultation et téléchargement des factures
- **Profil** : Gestion des informations personnelles et mot de passe

### Pour l'agence
- **Notion comme backend** : Gestion centralisée via l'interface Notion
- **Notifications email** : Alertes automatiques aux clients
- **API Admin** : Création de clients via API
- **Webhooks** : Notifications automatiques lors des mises à jour

## Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Backend** : Notion API
- **Auth** : NextAuth.js v5 (Auth.js)
- **Email** : Resend + React Email
- **Validation** : Zod + React Hook Form

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn ou pnpm
- Compte Notion avec intégration API
- Compte Resend pour les emails

### Configuration Notion

1. Créez une intégration Notion sur https://www.notion.so/my-integrations
2. Créez les bases de données suivantes avec les propriétés requises :

#### Base Clients
- Nom (Title)
- Email (Email)
- Entreprise (Text)
- Telephone (Phone)
- Adresse (Text)
- SIRET (Text)
- NumeroTVA (Text)
- PortailActif (Checkbox)
- MotDePasseHash (Text)
- DerniereConnexion (Date)
- TokenResetPassword (Text)
- TokenResetExpiry (Date)

#### Base Projets
- Projet (Title)
- Client (Relation → Clients)
- Statut (Status: À valider, En cours, En pause, Terminé)
- DateDebut (Date)
- DateFinEstimee (Date)
- DateFin (Date)
- MontantTotal (Number)
- VisiblePortail (Checkbox)
- DescriptionPublique (Text)
- PourcentageAvancement (Number)
- Priorite (Select)
- Tags (Multi-select)

#### Base Livrables
- Nom (Title)
- Description (Text)
- Projet (Relation → Projets)
- Client (Relation → Clients)
- Statut (Select: En préparation, À valider, Validé, Refusé, Livré)
- Type (Select: Document, Maquette, Code, Rapport, Autre)
- Version (Text)
- Fichiers (Files)
- LienExterne (URL)
- DateLivraison (Date)
- DateValidation (Date)
- ValidePar (Text)
- CommentairesClient (Text)
- VisiblePortail (Checkbox)

#### Base Factures
- Numero (Title)
- Client (Relation → Clients)
- Projet (Relation → Projets)
- MontantHT (Number)
- TauxTVA (Number, défaut: 20)
- MontantTVA (Formula)
- MontantTTC (Formula)
- DateEmission (Date)
- DateEcheance (Date)
- DatePaiement (Date)
- Statut (Select: Brouillon, Envoyée, Payée, En retard, Annulée)
- FichierPDF (Files)
- VisiblePortail (Checkbox)

#### Base Validations
- Titre (Title)
- Livrable (Relation → Livrables)
- Projet (Relation → Projets)
- Client (Relation → Clients)
- Statut (Select: Approuvé, Refusé, À modifier)
- DateValidation (Date)
- Commentaire (Text)
- NoteSatisfaction (Number)
- TypeValidation (Select)

3. Partagez chaque base de données avec votre intégration Notion

### Installation du projet

```bash
# Cloner le repository
git clone [url-du-repo]
cd portail-client

# Installer les dépendances
pnpm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Configurer les variables d'environnement dans .env.local

# Lancer en développement
pnpm dev
```

## Variables d'environnement

```env
# Application
NEXT_PUBLIC_APP_NAME="Portail Client"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Notion
NOTION_API_KEY="secret_xxx"
NOTION_CLIENTS_DB_ID="xxx"
NOTION_PROJECTS_DB_ID="xxx"
NOTION_DELIVERABLES_DB_ID="xxx"
NOTION_INVOICES_DB_ID="xxx"
NOTION_VALIDATIONS_DB_ID="xxx"
NOTION_COMMENTS_DB_ID="xxx"

# Auth
NEXTAUTH_SECRET="xxx"
NEXTAUTH_URL="http://localhost:3000"

# Email
RESEND_API_KEY="re_xxx"
EMAIL_FROM="Portail Client <noreply@domain.com>"
NOTIFICATION_EMAIL="team@domain.com"

# Admin
ADMIN_API_KEY="xxx"
```

## API Admin

### Créer un client

```bash
curl -X POST https://votre-domaine.com/api/admin/clients \
  -H "Content-Type: application/json" \
  -H "x-api-key: votre-api-key" \
  -d '{
    "email": "client@example.com",
    "nom": "Jean Dupont",
    "entreprise": "Entreprise SARL",
    "sendWelcomeEmail": true
  }'
```

### Webhook pour nouvelles notifications

```bash
# Nouveau livrable
curl -X POST https://votre-domaine.com/api/webhooks/notion \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: votre-api-key" \
  -d '{
    "type": "new_deliverable",
    "deliverableId": "xxx",
    "clientId": "xxx",
    "projectId": "xxx"
  }'

# Nouvelle facture
curl -X POST https://votre-domaine.com/api/webhooks/notion \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: votre-api-key" \
  -d '{
    "type": "new_invoice",
    "invoiceId": "xxx",
    "clientId": "xxx",
    "invoiceNumber": "FAC-2024-001",
    "amount": 1200.00,
    "dueDate": "2024-02-15"
  }'
```

## Déploiement

### Vercel (Recommandé)

1. Connectez votre repository à Vercel
2. Configurez les variables d'environnement
3. Déployez

```bash
# Via CLI
npm i -g vercel
vercel
```

### Variables d'environnement Vercel

Configurez toutes les variables du fichier `.env.example` dans les paramètres du projet Vercel.

## Sécurité

- **Row-Level Security** : Chaque requête Notion filtre les données par clientId
- **Sessions JWT** : Tokens sécurisés avec expiration
- **Mots de passe** : Hashés avec bcrypt (12 rounds)
- **API Keys** : Protection des endpoints admin
- **HTTPS** : Obligatoire en production

## Structure du projet

```
src/
├── app/
│   ├── (auth)/           # Pages d'authentification
│   ├── (dashboard)/      # Pages du portail client
│   └── api/              # API Routes
├── components/
│   ├── dashboard/        # Composants dashboard
│   ├── factures/         # Composants factures
│   ├── livrables/        # Composants livrables
│   ├── profil/           # Composants profil
│   ├── projets/          # Composants projets
│   ├── shared/           # Composants partagés
│   └── ui/               # Composants shadcn/ui
├── lib/
│   ├── auth/             # Configuration NextAuth
│   ├── email/            # Templates et envoi d'emails
│   └── notion/           # Client et requêtes Notion
├── config/               # Configuration globale
└── types/                # Types TypeScript
```

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.

## Licence

MIT
