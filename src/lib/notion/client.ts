import { Client } from "@notionhq/client";
import { config } from "@/config";

// Create and export the Notion client
export const notion = new Client({
  auth: config.notion.apiKey || "dummy-key-for-build",
});

// IDs des databases
export const DATABASES = {
  CLIENTS: config.notion.databases.clients,
  PROJECTS: config.notion.databases.projects,
  DELIVERABLES: config.notion.databases.deliverables,
  INVOICES: config.notion.databases.invoices,
  VALIDATIONS: config.notion.databases.validations,
  COMMENTS: config.notion.databases.comments,
} as const;

// Types pour les propriétés Notion
export type NotionPropertyType =
  | "title"
  | "rich_text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "phone_number"
  | "relation"
  | "files"
  | "formula"
  | "rollup"
  | "created_time"
  | "last_edited_time"
  | "status";

// Helper pour extraire les valeurs des propriétés Notion
export function extractNotionProperty(property: any, type: NotionPropertyType): any {
  if (!property) return null;

  switch (type) {
    case "title":
      return property.title?.[0]?.plain_text || "";
    case "rich_text":
      return property.rich_text?.[0]?.plain_text || "";
    case "number":
      return property.number ?? 0;
    case "select":
      return property.select?.name || "";
    case "status":
      return property.status?.name || "";
    case "multi_select":
      return property.multi_select?.map((item: any) => item.name) || [];
    case "date":
      return property.date?.start || null;
    case "checkbox":
      return property.checkbox ?? false;
    case "url":
      return property.url || "";
    case "email":
      return property.email || "";
    case "phone_number":
      return property.phone_number || "";
    case "relation":
      return property.relation?.map((item: any) => item.id) || [];
    case "files":
      return property.files?.map((file: any) => ({
        name: file.name,
        url: file.file?.url || file.external?.url || "",
        type: file.type,
      })) || [];
    case "formula":
      if (property.formula?.type === "number") {
        return property.formula.number ?? 0;
      }
      if (property.formula?.type === "string") {
        return property.formula.string || "";
      }
      if (property.formula?.type === "boolean") {
        return property.formula.boolean ?? false;
      }
      return null;
    case "rollup":
      if (property.rollup?.type === "number") {
        return property.rollup.number ?? 0;
      }
      if (property.rollup?.type === "array") {
        return property.rollup.array || [];
      }
      return null;
    case "created_time":
      return property.created_time || null;
    case "last_edited_time":
      return property.last_edited_time || null;
    default:
      return null;
  }
}

// Helper pour créer des propriétés Notion
export function createNotionProperty(value: any, type: NotionPropertyType): any {
  switch (type) {
    case "title":
      return {
        title: [{ text: { content: value || "" } }],
      };
    case "rich_text":
      return {
        rich_text: [{ text: { content: value || "" } }],
      };
    case "number":
      return {
        number: value ?? null,
      };
    case "select":
      return value ? { select: { name: value } } : { select: null };
    case "status":
      return value ? { status: { name: value } } : { status: null };
    case "multi_select":
      return {
        multi_select: (value || []).map((name: string) => ({ name })),
      };
    case "date":
      return value ? { date: { start: value } } : { date: null };
    case "checkbox":
      return {
        checkbox: Boolean(value),
      };
    case "url":
      return {
        url: value || null,
      };
    case "email":
      return {
        email: value || null,
      };
    case "phone_number":
      return {
        phone_number: value || null,
      };
    case "relation":
      return {
        relation: (value || []).map((id: string) => ({ id })),
      };
    default:
      return null;
  }
}
