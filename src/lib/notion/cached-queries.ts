import { unstable_cache } from "next/cache";
import {
  getClientProjects as _getClientProjects,
  getProjectById as _getProjectById,
  getClientDeliverables as _getClientDeliverables,
  getProjectDeliverables as _getProjectDeliverables,
  getDeliverableById as _getDeliverableById,
  getClientInvoices as _getClientInvoices,
  getInvoiceById as _getInvoiceById,
  getClientById as _getClientById,
  getDashboardStats as _getDashboardStats,
  getRecentActivity as _getRecentActivity,
  getUpcomingDeadlines as _getUpcomingDeadlines,
  getPageContent as _getPageContent,
  getPendingDeliverablesCount as _getPendingDeliverablesCount,
  getUnpaidInvoicesCount as _getUnpaidInvoicesCount,
  getTotalUnpaidAmount as _getTotalUnpaidAmount,
  getActiveProjectsCount as _getActiveProjectsCount,
} from "./queries";

// Cache duration in seconds
const SHORT_CACHE = 30; // 30 seconds for frequently changing data
const MEDIUM_CACHE = 60; // 1 minute for most data
const LONG_CACHE = 300; // 5 minutes for content that rarely changes

// Cached queries with tags for revalidation

export const getClientProjects = unstable_cache(
  async (clientId: string) => _getClientProjects(clientId),
  ["client-projects"],
  { revalidate: MEDIUM_CACHE, tags: ["projects"] }
);

export const getProjectById = unstable_cache(
  async (projectId: string, clientId: string) => _getProjectById(projectId, clientId),
  ["project-by-id"],
  { revalidate: MEDIUM_CACHE, tags: ["projects"] }
);

export const getClientDeliverables = unstable_cache(
  async (clientId: string) => _getClientDeliverables(clientId),
  ["client-deliverables"],
  { revalidate: MEDIUM_CACHE, tags: ["deliverables"] }
);

export const getProjectDeliverables = unstable_cache(
  async (projectId: string, clientId: string) => _getProjectDeliverables(projectId, clientId),
  ["project-deliverables"],
  { revalidate: MEDIUM_CACHE, tags: ["deliverables"] }
);

export const getDeliverableById = unstable_cache(
  async (deliverableId: string, clientId: string) => _getDeliverableById(deliverableId, clientId),
  ["deliverable-by-id"],
  { revalidate: MEDIUM_CACHE, tags: ["deliverables"] }
);

export const getClientInvoices = unstable_cache(
  async (clientId: string) => _getClientInvoices(clientId),
  ["client-invoices"],
  { revalidate: MEDIUM_CACHE, tags: ["invoices"] }
);

export const getDashboardStats = unstable_cache(
  async (clientId: string) => _getDashboardStats(clientId),
  ["dashboard-stats"],
  { revalidate: SHORT_CACHE, tags: ["dashboard"] }
);

export const getRecentActivity = unstable_cache(
  async (clientId: string, limit = 10) => _getRecentActivity(clientId, limit),
  ["recent-activity"],
  { revalidate: SHORT_CACHE, tags: ["activity"] }
);

export const getUpcomingDeadlines = unstable_cache(
  async (clientId: string, limit = 5) => _getUpcomingDeadlines(clientId, limit),
  ["upcoming-deadlines"],
  { revalidate: MEDIUM_CACHE, tags: ["deadlines"] }
);

export const getPageContent = unstable_cache(
  async (pageId: string) => _getPageContent(pageId),
  ["page-content"],
  { revalidate: LONG_CACHE, tags: ["content"] }
);

export const getPendingDeliverablesCount = unstable_cache(
  async (clientId: string) => _getPendingDeliverablesCount(clientId),
  ["pending-deliverables-count"],
  { revalidate: SHORT_CACHE, tags: ["deliverables"] }
);

export const getUnpaidInvoicesCount = unstable_cache(
  async (clientId: string) => _getUnpaidInvoicesCount(clientId),
  ["unpaid-invoices-count"],
  { revalidate: SHORT_CACHE, tags: ["invoices"] }
);

export const getTotalUnpaidAmount = unstable_cache(
  async (clientId: string) => _getTotalUnpaidAmount(clientId),
  ["total-unpaid-amount"],
  { revalidate: SHORT_CACHE, tags: ["invoices"] }
);

export const getActiveProjectsCount = unstable_cache(
  async (clientId: string) => _getActiveProjectsCount(clientId),
  ["active-projects-count"],
  { revalidate: SHORT_CACHE, tags: ["projects"] }
);

export const getInvoiceById = unstable_cache(
  async (invoiceId: string, clientId: string) => _getInvoiceById(invoiceId, clientId),
  ["invoice-by-id"],
  { revalidate: MEDIUM_CACHE, tags: ["invoices"] }
);

export const getClientById = unstable_cache(
  async (clientId: string) => _getClientById(clientId),
  ["client-by-id"],
  { revalidate: LONG_CACHE, tags: ["clients"] }
);
