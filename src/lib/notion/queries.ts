import { notion, DATABASES, extractNotionProperty, createNotionProperty } from "./client";
import type {
  Client,
  Projet,
  Livrable,
  Facture,
  Validation,
  Commentaire,
  NotionFile,
} from "@/types";

// ==========================================
// Transformateurs Notion → Types App
// ==========================================

function transformClient(page: any): Client {
  const props = page.properties;
  return {
    id: page.id,
    nom: extractNotionProperty(props.Client || props.Nom || props.nom || props.Name, "title"),
    entreprise: extractNotionProperty(props.Entreprise || props.entreprise, "rich_text"),
    email: extractNotionProperty(props.Email || props.email, "email"),
    emailSecondaire: extractNotionProperty(props.EmailSecondaire || props.emailSecondaire, "email"),
    telephone: extractNotionProperty(props.Telephone || props.telephone, "phone_number"),
    adresse: extractNotionProperty(props.Adresse || props.adresse, "rich_text"),
    siret: extractNotionProperty(props.SIRET || props.siret, "rich_text"),
    numeroTVA: extractNotionProperty(props.NumeroTVA || props.numeroTVA, "rich_text"),
    portailActif: extractNotionProperty(props.PortailActif || props.portailActif, "checkbox"),
    motDePasseHash: extractNotionProperty(props.MotDePasseHash || props.motDePasseHash, "rich_text"),
    derniereConnexion: extractNotionProperty(props.DerniereConnexion || props.derniereConnexion, "date"),
    tokenResetPassword: extractNotionProperty(props.TokenResetPassword || props.tokenResetPassword, "rich_text"),
    tokenResetExpiry: extractNotionProperty(props.TokenResetExpiry || props.tokenResetExpiry, "date"),
  };
}

function transformProjet(page: any): Projet {
  const props = page.properties;
  return {
    id: page.id,
    nom: extractNotionProperty(props.Projet || props.Nom || props.nom || props.Name, "title"),
    clientId: extractNotionProperty(props.Client || props.client, "relation")?.[0] || "",
    statut: extractNotionProperty(props.Statut || props.statut, "status") ||
            extractNotionProperty(props.Statut || props.statut, "select"),
    dateDebut: extractNotionProperty(props.Date || props.DateDebut || props.dateDebut, "date"),
    dateFinEstimee: extractNotionProperty(props.DateFinEstimee || props.dateFinEstimee, "date"),
    dateFin: extractNotionProperty(props.DateFin || props.dateFin, "date"),
    montantTotal: extractNotionProperty(props.MontantTotal || props.montantTotal, "number") ||
                  extractNotionProperty(props.MontantTotal || props.montantTotal, "formula"),
    joursEstimes: extractNotionProperty(props.JoursEstimes || props.joursEstimes, "number"),
    tauxJournalier: extractNotionProperty(props.TauxJournalier || props.tauxJournalier, "number"),
    visiblePortail: extractNotionProperty(props.VisiblePortail || props.visiblePortail, "checkbox"),
    descriptionPublique: extractNotionProperty(props.DescriptionPublique || props.descriptionPublique, "rich_text"),
    pourcentageAvancement: Math.round((extractNotionProperty(props.PourcentageAvancement || props.pourcentageAvancement || props.Avancement, "number") || 0) * 100),
    tags: extractNotionProperty(props.Tags || props.tags, "multi_select"),
    priorite: extractNotionProperty(props.Priorite || props.priorite, "select"),
  };
}

function transformLivrable(page: any): Livrable {
  const props = page.properties;
  return {
    id: page.id,
    nom: extractNotionProperty(props.Nom || props.nom || props.Name, "title"),
    description: extractNotionProperty(props.Description || props.description, "rich_text"),
    projetId: extractNotionProperty(props.Projet || props.projet, "relation")?.[0] || "",
    projetNom: "", // Will be populated separately if needed
    clientId: extractNotionProperty(props.Client || props.client, "relation")?.[0] || "",
    statut: extractNotionProperty(props.Statut || props.statut, "select") ||
            extractNotionProperty(props.Statut || props.statut, "status"),
    type: extractNotionProperty(props.Type || props.type, "select"),
    lot: extractNotionProperty(props.Lot || props.lot, "select") || extractNotionProperty(props.Lot || props.lot, "rich_text"),
    version: extractNotionProperty(props.Version || props.version, "rich_text") || "1.0",
    fichierPrecedentId: extractNotionProperty(props.FichierPrecedent || props.fichierPrecedent, "relation")?.[0],
    fichiers: extractNotionProperty(props.Fichiers || props.fichiers, "files") as NotionFile[],
    lienExterne: extractNotionProperty(props.LienExterne || props.lienExterne, "url"),
    dateCreation: page.created_time,
    dateLivraison: extractNotionProperty(props.DateLivraison || props.dateLivraison, "date"),
    dateValidation: extractNotionProperty(props.DateValidation || props.dateValidation, "date"),
    validePar: extractNotionProperty(props.ValidePar || props.validePar, "rich_text"),
    commentairesClient: extractNotionProperty(props.CommentairesClient || props.commentairesClient, "rich_text"),
    visiblePortail: extractNotionProperty(props.VisiblePortail || props.visiblePortail, "checkbox"),
  };
}

function transformFacture(page: any): Facture {
  const props = page.properties;
  const montantHT = extractNotionProperty(props.MontantHT || props.montantHT || props.Montant, "number") || 0;
  const tauxTVA = extractNotionProperty(props.TauxTVA || props.tauxTVA, "number") || 20;
  return {
    id: page.id,
    numero: extractNotionProperty(props.Facture || props.Numero || props.numero || props.Nom || props.Name, "title") ||
            extractNotionProperty(props["Numéro"], "rich_text"),
    clientId: extractNotionProperty(props.Client || props.client, "relation")?.[0] || "",
    projetId: extractNotionProperty(props["📁 Projets"] || props.Projet || props.projet, "relation")[0],
    projetNom: "", // Will be populated separately if needed
    montantHT,
    tauxTVA,
    montantTVA: extractNotionProperty(props.MontantTVA || props.montantTVA, "formula") ||
                (montantHT * tauxTVA / 100),
    montantTTC: extractNotionProperty(props.MontantTTC || props.montantTTC, "formula") ||
                (montantHT * (1 + tauxTVA / 100)),
    dateEmission: extractNotionProperty(props["Date d'émission"] || props.DateEmission || props.dateEmission, "date"),
    dateEcheance: extractNotionProperty(props["Date d'échéance"] || props.DateEcheance || props.dateEcheance, "date"),
    datePaiement: extractNotionProperty(props.DatePaiement || props.datePaiement, "date"),
    statut: extractNotionProperty(props.Statut || props.statut, "select") ||
            extractNotionProperty(props.Statut || props.statut, "status"),
    fichierPDF: extractNotionProperty(props.PDF || props.FichierPDF || props.fichierPDF, "files")[0]?.url,
    visiblePortail: extractNotionProperty(props.VisiblePortail || props.visiblePortail, "checkbox"),
  };
}

function transformValidation(page: any): Validation {
  const props = page.properties;
  return {
    id: page.id,
    titre: extractNotionProperty(props.Titre || props.titre || props.Nom || props.Name, "title"),
    livrableId: extractNotionProperty(props.Livrable || props.livrable, "relation")[0] || "",
    projetId: extractNotionProperty(props.Projet || props.projet, "relation")?.[0] || "",
    clientId: extractNotionProperty(props.Client || props.client, "relation")?.[0] || "",
    statut: extractNotionProperty(props.Statut || props.statut, "select"),
    dateCreation: page.created_time,
    dateValidation: extractNotionProperty(props.DateValidation || props.dateValidation, "date"),
    commentaire: extractNotionProperty(props.Commentaire || props.commentaire, "rich_text"),
    noteSatisfaction: extractNotionProperty(props.NoteSatisfaction || props.noteSatisfaction, "number"),
    typeValidation: extractNotionProperty(props.TypeValidation || props.typeValidation, "select"),
  };
}

function transformCommentaire(page: any): Commentaire {
  const props = page.properties;
  return {
    id: page.id,
    livrableId: extractNotionProperty(props.Livrable || props.livrable, "relation")[0] || "",
    auteur: extractNotionProperty(props.Auteur || props.auteur, "rich_text"),
    auteurType: extractNotionProperty(props.AuteurType || props.auteurType, "select") || "client",
    contenu: extractNotionProperty(props.Contenu || props.contenu, "rich_text"),
    dateCreation: page.created_time,
  };
}

// ==========================================
// Requêtes Clients
// ==========================================

export async function getClientByEmail(email: string): Promise<Client | null> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.CLIENTS,
      filter: {
        property: "Email",
        email: {
          equals: email,
        },
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    return transformClient(response.results[0]);
  } catch (error) {
    console.error("Error fetching client by email:", error);
    return null;
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: id });
    return transformClient(response);
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    return null;
  }
}

export async function updateClientLastLogin(clientId: string): Promise<void> {
  try {
    await notion.pages.update({
      page_id: clientId,
      properties: {
        DerniereConnexion: createNotionProperty(new Date().toISOString(), "date"),
      },
    });
  } catch (error) {
    console.error("Error updating last login:", error);
  }
}

export async function updateClientPassword(clientId: string, hashedPassword: string): Promise<void> {
  try {
    await notion.pages.update({
      page_id: clientId,
      properties: {
        MotDePasseHash: createNotionProperty(hashedPassword, "rich_text"),
        TokenResetPassword: createNotionProperty("", "rich_text"),
        TokenResetExpiry: createNotionProperty(null, "date"),
      },
    });
  } catch (error) {
    console.error("Error updating client password:", error);
    throw error;
  }
}

export async function setResetToken(clientId: string, token: string, expiry: Date): Promise<void> {
  try {
    await notion.pages.update({
      page_id: clientId,
      properties: {
        TokenResetPassword: createNotionProperty(token, "rich_text"),
        TokenResetExpiry: createNotionProperty(expiry.toISOString(), "date"),
      },
    });
  } catch (error) {
    console.error("Error setting reset token:", error);
    throw error;
  }
}

export async function getClientByResetToken(token: string): Promise<Client | null> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.CLIENTS,
      filter: {
        property: "TokenResetPassword",
        rich_text: {
          equals: token,
        },
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    return transformClient(response.results[0]);
  } catch (error) {
    console.error("Error fetching client by reset token:", error);
    return null;
  }
}

export async function updateClientProfile(
  clientId: string,
  data: { nom?: string; telephone?: string; adresse?: string }
): Promise<void> {
  try {
    const properties: Record<string, any> = {};
    if (data.nom) properties.Nom = createNotionProperty(data.nom, "title");
    if (data.telephone) properties.Telephone = createNotionProperty(data.telephone, "phone_number");
    if (data.adresse) properties.Adresse = createNotionProperty(data.adresse, "rich_text");

    await notion.pages.update({
      page_id: clientId,
      properties,
    });
  } catch (error) {
    console.error("Error updating client profile:", error);
    throw error;
  }
}

// ==========================================
// Requêtes Projets
// ==========================================

export async function getClientProjects(clientId: string): Promise<Projet[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.PROJECTS,
      filter: {
        and: [
          {
            property: "Client",
            relation: {
              contains: clientId,
            },
          },
          {
            property: "VisiblePortail",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.map(transformProjet);
  } catch (error) {
    console.error("Error fetching client projects:", error);
    return [];
  }
}

export async function getProjectById(projectId: string, clientId: string): Promise<Projet | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: projectId });
    const project = transformProjet(response);

    // Vérifier que le projet appartient au client et est visible
    if (project.clientId !== clientId || !project.visiblePortail) {
      return null;
    }

    return project;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
}

export async function getActiveProjectsCount(clientId: string): Promise<number> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.PROJECTS,
      filter: {
        and: [
          {
            property: "Client",
            relation: {
              contains: clientId,
            },
          },
          {
            property: "VisiblePortail",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Statut",
            status: {
              equals: "En cours",
            },
          },
        ],
      },
    });

    return response.results.length;
  } catch (error) {
    console.error("Error counting active projects:", error);
    return 0;
  }
}

// ==========================================
// Requêtes Livrables
// ==========================================

export async function getClientDeliverables(clientId: string): Promise<Livrable[]> {
  try {
    // First get all client projects
    const projects = await getClientProjects(clientId);
    const projectIds = projects.map(p => p.id);

    if (projectIds.length === 0) {
      return [];
    }

    // Then get deliverables for those projects
    const response = await notion.databases.query({
      database_id: DATABASES.DELIVERABLES,
      filter: {
        and: [
          {
            or: projectIds.map(id => ({
              property: "Projet",
              relation: {
                contains: id,
              },
            })),
          },
          {
            property: "VisiblePortail",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    const deliverables = response.results.map(transformLivrable);

    // Add project names
    const projectMap = new Map(projects.map(p => [p.id, p.nom]));
    return deliverables.map(d => ({
      ...d,
      projetNom: projectMap.get(d.projetId) || "",
    }));
  } catch (error) {
    console.error("Error fetching client deliverables:", error);
    return [];
  }
}

export async function getProjectDeliverables(projectId: string, clientId: string): Promise<Livrable[]> {
  try {
    // Vérifier que le projet appartient au client
    const project = await getProjectById(projectId, clientId);
    if (!project) {
      throw new Error("Unauthorized access to project");
    }

    const response = await notion.databases.query({
      database_id: DATABASES.DELIVERABLES,
      filter: {
        and: [
          {
            property: "Projet",
            relation: {
              contains: projectId,
            },
          },
          {
            property: "VisiblePortail",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    return response.results.map(d => ({
      ...transformLivrable(d),
      projetNom: project.nom,
    }));
  } catch (error) {
    console.error("Error fetching project deliverables:", error);
    return [];
  }
}

export async function getDeliverableById(deliverableId: string, clientId: string): Promise<Livrable | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: deliverableId });
    const deliverable = transformLivrable(response);

    // Vérifier que le livrable appartient au client via le projet
    const project = await getProjectById(deliverable.projetId, clientId);
    if (!project || !deliverable.visiblePortail) {
      return null;
    }

    // Fetch validations for this deliverable
    const validations = await getDeliverableValidations(deliverableId);

    return {
      ...deliverable,
      projetNom: project.nom,
      validations,
    };
  } catch (error) {
    console.error("Error fetching deliverable by ID:", error);
    return null;
  }
}

export async function getPendingDeliverables(clientId: string): Promise<Livrable[]> {
  try {
    const deliverables = await getClientDeliverables(clientId);
    return deliverables.filter(d => d.statut === "À valider");
  } catch (error) {
    console.error("Error fetching pending deliverables:", error);
    return [];
  }
}

export async function getPendingDeliverablesCount(clientId: string): Promise<number> {
  const deliverables = await getPendingDeliverables(clientId);
  return deliverables.length;
}

// ==========================================
// Requêtes Factures
// ==========================================

export async function getClientInvoices(clientId: string): Promise<Facture[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.INVOICES,
      filter: {
        and: [
          {
            property: "Client",
            relation: {
              contains: clientId,
            },
          },
          {
            property: "VisiblePortail",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Date d'émission",
          direction: "descending",
        },
      ],
    });

    return response.results.map(transformFacture);
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    return [];
  }
}

export async function getInvoiceById(invoiceId: string, clientId: string): Promise<Facture | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: invoiceId });
    const invoice = transformFacture(response);

    // Vérifier que la facture appartient au client
    if (invoice.clientId !== clientId || !invoice.visiblePortail) {
      return null;
    }

    return invoice;
  } catch (error) {
    console.error("Error fetching invoice by ID:", error);
    return null;
  }
}

export async function getUnpaidInvoices(clientId: string): Promise<Facture[]> {
  try {
    const invoices = await getClientInvoices(clientId);
    return invoices.filter(f => f.statut === "Envoyée" || f.statut === "En retard");
  } catch (error) {
    console.error("Error fetching unpaid invoices:", error);
    return [];
  }
}

export async function getUnpaidInvoicesCount(clientId: string): Promise<number> {
  const invoices = await getUnpaidInvoices(clientId);
  return invoices.length;
}

export async function getTotalUnpaidAmount(clientId: string): Promise<number> {
  const invoices = await getUnpaidInvoices(clientId);
  return invoices.reduce((total, f) => total + f.montantTTC, 0);
}

// ==========================================
// Requêtes Validations
// ==========================================

export async function createValidation({
  deliverableId,
  projectId,
  clientId,
  statut,
  commentaire,
  noteSatisfaction,
  typeValidation = "Livrable final",
}: {
  deliverableId: string;
  projectId: string;
  clientId: string;
  statut: "Approuvé" | "Refusé" | "À modifier";
  commentaire?: string;
  noteSatisfaction?: number;
  typeValidation?: string;
}): Promise<Validation> {
  try {
    const client = await getClientById(clientId);
    const titre = `Validation par ${client?.nom || "Client"} - ${new Date().toLocaleDateString("fr-FR")}`;

    const response = await notion.pages.create({
      parent: { database_id: DATABASES.VALIDATIONS },
      properties: {
        Titre: createNotionProperty(titre, "title"),
        Livrable: createNotionProperty([deliverableId], "relation"),
        Projet: createNotionProperty([projectId], "relation"),
        Client: createNotionProperty([clientId], "relation"),
        Statut: createNotionProperty(statut, "select"),
        DateValidation: createNotionProperty(new Date().toISOString(), "date"),
        ...(commentaire && { Commentaire: createNotionProperty(commentaire, "rich_text") }),
        ...(noteSatisfaction && { NoteSatisfaction: createNotionProperty(noteSatisfaction, "number") }),
        TypeValidation: createNotionProperty(typeValidation, "select"),
      },
    });

    // Mettre à jour le statut du livrable
    const newDeliverableStatus = statut === "Approuvé" ? "Validé" : statut === "Refusé" ? "Refusé" : "À valider";
    await notion.pages.update({
      page_id: deliverableId,
      properties: {
        Statut: createNotionProperty(newDeliverableStatus, "select"),
        DateValidation: createNotionProperty(new Date().toISOString(), "date"),
        ValidePar: createNotionProperty(client?.nom || "Client", "rich_text"),
        ...(commentaire && { CommentairesClient: createNotionProperty(commentaire, "rich_text") }),
      },
    });

    return transformValidation(response);
  } catch (error) {
    console.error("Error creating validation:", error);
    throw error;
  }
}

export async function getDeliverableValidations(deliverableId: string): Promise<Validation[]> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASES.VALIDATIONS,
      filter: {
        property: "Livrable",
        relation: {
          contains: deliverableId,
        },
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    return response.results.map(transformValidation);
  } catch (error) {
    console.error("Error fetching deliverable validations:", error);
    return [];
  }
}

// ==========================================
// Requêtes Commentaires
// ==========================================

export async function getDeliverableComments(deliverableId: string): Promise<Commentaire[]> {
  try {
    if (!DATABASES.COMMENTS) {
      return [];
    }

    const response = await notion.databases.query({
      database_id: DATABASES.COMMENTS,
      filter: {
        property: "Livrable",
        relation: {
          contains: deliverableId,
        },
      },
      sorts: [
        {
          timestamp: "created_time",
          direction: "ascending",
        },
      ],
    });

    return response.results.map(transformCommentaire);
  } catch (error) {
    console.error("Error fetching deliverable comments:", error);
    return [];
  }
}

export async function createComment({
  deliverableId,
  auteur,
  auteurType,
  contenu,
}: {
  deliverableId: string;
  auteur: string;
  auteurType: "client" | "agence";
  contenu: string;
}): Promise<Commentaire> {
  try {
    if (!DATABASES.COMMENTS) {
      throw new Error("Comments database not configured");
    }

    const response = await notion.pages.create({
      parent: { database_id: DATABASES.COMMENTS },
      properties: {
        Livrable: createNotionProperty([deliverableId], "relation"),
        Auteur: createNotionProperty(auteur, "rich_text"),
        AuteurType: createNotionProperty(auteurType, "select"),
        Contenu: createNotionProperty(contenu, "rich_text"),
      },
    });

    return transformCommentaire(response);
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

// ==========================================
// Requêtes Dashboard
// ==========================================

export async function getDashboardStats(clientId: string) {
  const [projetsActifs, livrablesAValider, facturesImpayees, montantDu] = await Promise.all([
    getActiveProjectsCount(clientId),
    getPendingDeliverablesCount(clientId),
    getUnpaidInvoicesCount(clientId),
    getTotalUnpaidAmount(clientId),
  ]);

  return {
    projetsActifs,
    livrablesAValider,
    facturesImpayees,
    montantDu,
  };
}

export async function getRecentActivity(clientId: string, limit = 10) {
  try {
    const [deliverables, invoices] = await Promise.all([
      getClientDeliverables(clientId),
      getClientInvoices(clientId),
    ]);

    const activities = [
      ...deliverables.slice(0, 5).map(d => ({
        id: d.id,
        type: "livrable" as const,
        titre: d.nom,
        description: `Livrable ${d.statut.toLowerCase()} - ${d.projetNom}`,
        date: d.dateCreation,
        lien: `/livrables/${d.id}`,
      })),
      ...invoices.slice(0, 5).map(f => ({
        id: f.id,
        type: "facture" as const,
        titre: f.numero,
        description: `Facture ${f.statut.toLowerCase()} - ${f.montantTTC.toFixed(2)}€`,
        date: f.dateEmission,
        lien: `/factures/${f.id}`,
      })),
    ];

    // Sort by date and limit
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
}

export async function getUpcomingDeadlines(clientId: string, limit = 5) {
  try {
    const [invoices, projects] = await Promise.all([
      getUnpaidInvoices(clientId),
      getClientProjects(clientId),
    ]);

    const deadlines = [
      ...invoices.map(f => ({
        id: f.id,
        type: "facture" as const,
        titre: `Facture ${f.numero}`,
        date: f.dateEcheance,
        statut: f.statut,
      })),
      ...projects
        .filter(p => p.dateFinEstimee && p.statut === "En cours")
        .map(p => ({
          id: p.id,
          type: "projet" as const,
          titre: p.nom,
          date: p.dateFinEstimee!,
          statut: p.statut,
        })),
    ];

    // Sort by date and limit
    return deadlines
      .filter(d => d.date && new Date(d.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching upcoming deadlines:", error);
    return [];
  }
}

// ==========================================
// Admin Queries
// ==========================================

export async function updateDeliverableStatus(
  deliverableId: string,
  status: string,
  comment?: string
): Promise<void> {
  try {
    const properties: Record<string, any> = {
      Statut: createNotionProperty(status, "select"),
    };

    if (status === "Validé") {
      properties.DateValidation = createNotionProperty(new Date().toISOString(), "date");
    }

    if (comment) {
      properties.CommentairesClient = createNotionProperty(comment, "rich_text");
    }

    await notion.pages.update({
      page_id: deliverableId,
      properties,
    });
  } catch (error) {
    console.error("Error updating deliverable status:", error);
    throw error;
  }
}

export async function createNotionClient({
  email,
  nom,
  entreprise,
  portailActif,
  motDePasseHash,
}: {
  email: string;
  nom: string;
  entreprise: string;
  portailActif: boolean;
  motDePasseHash: string;
}): Promise<Client> {
  try {
    const response = await notion.pages.create({
      parent: { database_id: DATABASES.CLIENTS },
      properties: {
        Client: createNotionProperty(nom, "title"),
        Email: createNotionProperty(email, "email"),
        Entreprise: createNotionProperty(entreprise, "rich_text"),
        PortailActif: createNotionProperty(portailActif, "checkbox"),
        MotDePasseHash: createNotionProperty(motDePasseHash, "rich_text"),
      },
    });

    return transformClient(response);
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

// ==========================================
// Notion Page Content (Blocks)
// ==========================================

export interface RichTextSegment {
  text: string;
  href?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
}

export interface NotionBlock {
  id: string;
  type: string;
  content: string;
  richText?: RichTextSegment[];
  children?: NotionBlock[];
  url?: string;
  caption?: string;
}

function extractRichText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText.map((text: any) => text.plain_text || "").join("");
}

function extractRichTextWithLinks(richText: any[]): RichTextSegment[] {
  if (!richText || !Array.isArray(richText)) return [];
  return richText.map((text: any) => ({
    text: text.plain_text || "",
    href: text.href || undefined,
    annotations: text.annotations ? {
      bold: text.annotations.bold,
      italic: text.annotations.italic,
      strikethrough: text.annotations.strikethrough,
      underline: text.annotations.underline,
      code: text.annotations.code,
    } : undefined,
  }));
}

function transformBlock(block: any): NotionBlock | null {
  const type = block.type;

  switch (type) {
    case "paragraph":
      return {
        id: block.id,
        type: "paragraph",
        content: extractRichText(block.paragraph?.rich_text),
        richText: extractRichTextWithLinks(block.paragraph?.rich_text),
      };
    case "heading_1":
      return {
        id: block.id,
        type: "heading_1",
        content: extractRichText(block.heading_1?.rich_text),
        richText: extractRichTextWithLinks(block.heading_1?.rich_text),
      };
    case "heading_2":
      return {
        id: block.id,
        type: "heading_2",
        content: extractRichText(block.heading_2?.rich_text),
        richText: extractRichTextWithLinks(block.heading_2?.rich_text),
      };
    case "heading_3":
      return {
        id: block.id,
        type: "heading_3",
        content: extractRichText(block.heading_3?.rich_text),
        richText: extractRichTextWithLinks(block.heading_3?.rich_text),
      };
    case "bulleted_list_item":
      return {
        id: block.id,
        type: "bulleted_list_item",
        content: extractRichText(block.bulleted_list_item?.rich_text),
        richText: extractRichTextWithLinks(block.bulleted_list_item?.rich_text),
      };
    case "numbered_list_item":
      return {
        id: block.id,
        type: "numbered_list_item",
        content: extractRichText(block.numbered_list_item?.rich_text),
        richText: extractRichTextWithLinks(block.numbered_list_item?.rich_text),
      };
    case "to_do":
      return {
        id: block.id,
        type: block.to_do?.checked ? "to_do_checked" : "to_do",
        content: extractRichText(block.to_do?.rich_text),
        richText: extractRichTextWithLinks(block.to_do?.rich_text),
      };
    case "toggle":
      return {
        id: block.id,
        type: "toggle",
        content: extractRichText(block.toggle?.rich_text),
        richText: extractRichTextWithLinks(block.toggle?.rich_text),
      };
    case "code":
      return {
        id: block.id,
        type: "code",
        content: extractRichText(block.code?.rich_text),
        caption: block.code?.language || "",
      };
    case "quote":
      return {
        id: block.id,
        type: "quote",
        content: extractRichText(block.quote?.rich_text),
        richText: extractRichTextWithLinks(block.quote?.rich_text),
      };
    case "callout":
      return {
        id: block.id,
        type: "callout",
        content: extractRichText(block.callout?.rich_text),
        richText: extractRichTextWithLinks(block.callout?.rich_text),
      };
    case "table_of_contents":
      return {
        id: block.id,
        type: "table_of_contents",
        content: "",
      };
    case "divider":
      return {
        id: block.id,
        type: "divider",
        content: "",
      };
    case "image":
      const imageUrl = block.image?.file?.url || block.image?.external?.url || "";
      return {
        id: block.id,
        type: "image",
        content: "",
        url: imageUrl,
        caption: extractRichText(block.image?.caption),
      };
    case "video":
      const videoUrl = block.video?.file?.url || block.video?.external?.url || "";
      return {
        id: block.id,
        type: "video",
        content: "",
        url: videoUrl,
        caption: extractRichText(block.video?.caption),
      };
    case "file":
      const fileUrl = block.file?.file?.url || block.file?.external?.url || "";
      return {
        id: block.id,
        type: "file",
        content: block.file?.name || "Fichier",
        url: fileUrl,
        caption: extractRichText(block.file?.caption),
      };
    case "bookmark":
      return {
        id: block.id,
        type: "bookmark",
        content: "",
        url: block.bookmark?.url || "",
        caption: extractRichText(block.bookmark?.caption),
      };
    case "embed":
      return {
        id: block.id,
        type: "embed",
        content: "",
        url: block.embed?.url || "",
        caption: extractRichText(block.embed?.caption),
      };
    default:
      return null;
  }
}

export async function getPageContent(pageId: string): Promise<NotionBlock[]> {
  try {
    const blocks: NotionBlock[] = [];
    let cursor: string | undefined;

    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      for (const block of response.results as any[]) {
        const transformed = transformBlock(block);
        if (transformed) {
          // Recursively fetch children for blocks that have them (toggles, etc.)
          if (block.has_children) {
            transformed.children = await getPageContent(block.id);
          }
          blocks.push(transformed);
        }
      }

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return [];
  }
}
