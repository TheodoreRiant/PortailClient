import { Resend } from "resend";
import { config } from "@/config";
import { WelcomeEmail } from "./templates/welcome";
import { ResetPasswordEmail } from "./templates/reset-password";
import { NewDeliverableEmail } from "./templates/new-deliverable";

// Lazy initialize Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    if (!config.email.resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resendClient = new Resend(config.email.resendApiKey);
  }
  return resendClient;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ==========================================
// Email de bienvenue
// ==========================================

interface WelcomeEmailParams {
  to: string;
  nom: string;
  email: string;
  tempPassword: string;
}

export async function sendWelcomeEmail({
  to,
  nom,
  email,
  tempPassword,
}: WelcomeEmailParams): Promise<SendEmailResult> {
  try {
    const { data, error } = await getResendClient().emails.send({
      from: config.email.from,
      to,
      subject: "Bienvenue sur votre portail client",
      react: WelcomeEmail({
        nom,
        loginUrl: `${config.app.url}/login`,
        email,
        tempPassword,
      }),
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ==========================================
// Email de réinitialisation de mot de passe
// ==========================================

interface ResetPasswordEmailParams {
  to: string;
  nom: string;
  resetToken: string;
}

export async function sendResetPasswordEmail({
  to,
  nom,
  resetToken,
}: ResetPasswordEmailParams): Promise<SendEmailResult> {
  try {
    const resetUrl = `${config.app.url}/reset-password/${resetToken}`;

    const { data, error } = await getResendClient().emails.send({
      from: config.email.from,
      to,
      subject: "Réinitialisation de votre mot de passe",
      react: ResetPasswordEmail({
        nom,
        resetUrl,
      }),
    });

    if (error) {
      console.error("Error sending reset password email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending reset password email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ==========================================
// Email de nouveau livrable
// ==========================================

interface NewDeliverableEmailParams {
  to: string;
  clientName: string;
  deliverableName: string;
  projectName: string;
  deliverableId: string;
  deliverableType?: string;
}

export async function sendNewDeliverableEmail({
  to,
  clientName,
  deliverableName,
  projectName,
  deliverableId,
  deliverableType,
}: NewDeliverableEmailParams): Promise<SendEmailResult> {
  try {
    const deliverableUrl = `${config.app.url}/livrables/${deliverableId}`;

    const { data, error } = await getResendClient().emails.send({
      from: config.email.from,
      to,
      subject: `📦 Nouveau livrable disponible : ${deliverableName}`,
      react: NewDeliverableEmail({
        clientName,
        deliverableName,
        projectName,
        deliverableUrl,
        deliverableType,
      }),
    });

    if (error) {
      console.error("Error sending new deliverable email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending new deliverable email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ==========================================
// Email de validation reçue
// ==========================================

interface ValidationReceivedEmailParams {
  to: string;
  clientName: string;
  deliverableName: string;
  projectName: string;
  status: "Approuvé" | "Refusé" | "À modifier";
  comment?: string;
}

export async function sendValidationReceivedEmail({
  to,
  clientName,
  deliverableName,
  projectName,
  status,
  comment,
}: ValidationReceivedEmailParams): Promise<SendEmailResult> {
  try {
    const statusEmoji = status === "Approuvé" ? "✅" : status === "Refusé" ? "❌" : "🔄";
    const subject = `${statusEmoji} Validation reçue : ${deliverableName}`;

    // Simple text email for validation confirmation
    const { data, error } = await getResendClient().emails.send({
      from: config.email.from,
      to,
      subject,
      text: `
Bonjour,

Nous avons bien reçu votre validation pour le livrable "${deliverableName}" du projet "${projectName}".

Statut : ${status}
${comment ? `Commentaire : ${comment}` : ""}

Merci pour votre retour !

Cordialement,
L'équipe
      `.trim(),
    });

    if (error) {
      console.error("Error sending validation email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending validation email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ==========================================
// Email de nouvelle facture
// ==========================================

interface NewInvoiceEmailParams {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  invoiceId: string;
}

export async function sendNewInvoiceEmail({
  to,
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  invoiceId,
}: NewInvoiceEmailParams): Promise<SendEmailResult> {
  try {
    const invoiceUrl = `${config.app.url}/factures/${invoiceId}`;

    const { data, error } = await getResendClient().emails.send({
      from: config.email.from,
      to,
      subject: `🧾 Nouvelle facture : ${invoiceNumber}`,
      text: `
Bonjour ${clientName},

Une nouvelle facture est disponible sur votre portail client.

Numéro : ${invoiceNumber}
Montant TTC : ${amount.toFixed(2)} €
Date d'échéance : ${new Date(dueDate).toLocaleDateString("fr-FR")}

Consultez votre facture : ${invoiceUrl}

Cordialement,
L'équipe
      `.trim(),
    });

    if (error) {
      console.error("Error sending invoice email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending invoice email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ==========================================
// Email de rappel de paiement
// ==========================================

interface PaymentReminderEmailParams {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  invoiceId: string;
}

export async function sendPaymentReminderEmail({
  to,
  clientName,
  invoiceNumber,
  amount,
  dueDate,
  daysOverdue,
  invoiceId,
}: PaymentReminderEmailParams): Promise<SendEmailResult> {
  try {
    const invoiceUrl = `${config.app.url}/factures/${invoiceId}`;
    const isOverdue = daysOverdue > 0;

    const { data, error } = await getResendClient().emails.send({
      from: config.email.from,
      to,
      subject: isOverdue
        ? `⚠️ Rappel : Facture ${invoiceNumber} en retard`
        : `📋 Rappel : Facture ${invoiceNumber} à échéance proche`,
      text: `
Bonjour ${clientName},

${
  isOverdue
    ? `Votre facture ${invoiceNumber} est en retard de ${daysOverdue} jour(s).`
    : `Votre facture ${invoiceNumber} arrive à échéance le ${new Date(dueDate).toLocaleDateString("fr-FR")}.`
}

Montant TTC : ${amount.toFixed(2)} €

Consultez votre facture : ${invoiceUrl}

Si vous avez déjà effectué le paiement, merci de ne pas tenir compte de ce message.

Cordialement,
L'équipe
      `.trim(),
    });

    if (error) {
      console.error("Error sending payment reminder email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending payment reminder email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ==========================================
// Email de notification de validation à l'agence
// ==========================================

interface DeliverableValidatedEmailParams {
  deliverableName: string;
  clientName: string;
  status: "Approuvé" | "Refusé" | "À modifier";
  comment?: string;
  rating?: number;
}

export async function sendDeliverableValidatedEmail({
  deliverableName,
  clientName,
  status,
  comment,
  rating,
}: DeliverableValidatedEmailParams): Promise<SendEmailResult> {
  try {
    const statusEmoji = status === "Approuvé" ? "✅" : status === "Refusé" ? "❌" : "🔄";
    const subject = `${statusEmoji} Livrable ${status.toLowerCase()} par ${clientName}`;

    // Email to the agency team
    const agencyEmail = config.email.notificationEmail || "team@agence.com";

    const { data, error } = await getResendClient().emails.send({
      from: config.email.from,
      to: agencyEmail,
      subject,
      text: `
Bonjour,

Le client ${clientName} a donné son retour sur le livrable "${deliverableName}".

Statut : ${status}
${comment ? `\nCommentaire du client :\n${comment}` : ""}
${rating ? `\nNote de satisfaction : ${rating}/5 ⭐` : ""}

Cordialement,
Le Portail Client
      `.trim(),
    });

    if (error) {
      console.error("Error sending deliverable validated email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error sending deliverable validated email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ==========================================
// Utilitaire pour générer un mot de passe sécurisé
// ==========================================

export function generateSecurePassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%&*";

  const all = uppercase + lowercase + numbers + special;

  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 0; i < 8; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
