// Configuration de l'application

export const config = {
  // Application
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Portail Client",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    description: "Portail client pour la gestion de projets et livrables",
  },

  // Notion Database IDs
  notion: {
    apiKey: process.env.NOTION_API_KEY || "",
    databases: {
      clients: process.env.NOTION_CLIENTS_DB_ID || "",
      projects: process.env.NOTION_PROJECTS_DB_ID || "",
      deliverables: process.env.NOTION_DELIVERABLES_DB_ID || "",
      invoices: process.env.NOTION_INVOICES_DB_ID || "",
      validations: process.env.NOTION_VALIDATIONS_DB_ID || "",
      comments: process.env.NOTION_COMMENTS_DB_ID || "",
    },
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET || "",
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 jours
    resetPasswordExpiry: 60 * 60 * 1000, // 1 heure
  },

  // Email
  email: {
    resendApiKey: process.env.RESEND_API_KEY || "",
    from: process.env.EMAIL_FROM || "Portail Client <noreply@example.com>",
    notificationEmail: process.env.NOTIFICATION_EMAIL || "team@agence.com",
  },

  // Admin
  admin: {
    apiKey: process.env.ADMIN_API_KEY || "",
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Cache
  cache: {
    revalidateTime: 300, // 5 minutes
  },
} as const;

// Couleurs du design system
export const colors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  secondary: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
} as const;

// Statuts et leurs couleurs
export const statutColors = {
  projet: {
    "À valider": "bg-yellow-100 text-yellow-800",
    "En cours": "bg-blue-100 text-blue-800",
    "En pause": "bg-gray-100 text-gray-800",
    "Terminé": "bg-green-100 text-green-800",
    "Refusé": "bg-red-100 text-red-800",
  },
  livrable: {
    "En préparation": "bg-gray-100 text-gray-800",
    "À valider": "bg-yellow-100 text-yellow-800",
    "Validé": "bg-green-100 text-green-800",
    "Refusé": "bg-red-100 text-red-800",
    "Livré": "bg-blue-100 text-blue-800",
  },
  facture: {
    "Brouillon": "bg-gray-100 text-gray-800",
    "Envoyée": "bg-blue-100 text-blue-800",
    "Payée": "bg-green-100 text-green-800",
    "En retard": "bg-red-100 text-red-800",
    "Annulée": "bg-gray-100 text-gray-800",
  },
  validation: {
    "En attente": "bg-yellow-100 text-yellow-800",
    "Approuvé": "bg-green-100 text-green-800",
    "Refusé": "bg-red-100 text-red-800",
    "À modifier": "bg-orange-100 text-orange-800",
  },
} as const;

// Navigation du dashboard
export const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    name: "Projets",
    href: "/projets",
    icon: "FolderKanban",
  },
  {
    name: "Livrables",
    href: "/livrables",
    icon: "Package",
  },
  {
    name: "Factures",
    href: "/factures",
    icon: "FileText",
  },
  {
    name: "Profil",
    href: "/profil",
    icon: "User",
  },
] as const;

// Types de livrables avec icônes
export const livrableTypeIcons = {
  "Document": "FileText",
  "Maquette": "Palette",
  "Code": "Code",
  "Rapport": "ClipboardList",
  "Autre": "File",
} as const;

export default config;
