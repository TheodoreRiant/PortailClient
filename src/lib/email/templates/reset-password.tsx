import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  nom: string;
  resetUrl: string;
}

export function ResetPasswordEmail({ nom, resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisation de votre mot de passe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Réinitialisation du mot de passe</Heading>

          <Text style={text}>Bonjour {nom},</Text>

          <Text style={text}>
            Vous avez demandé la réinitialisation de votre mot de passe pour
            accéder au portail client. Cliquez sur le bouton ci-dessous pour
            créer un nouveau mot de passe.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Réinitialiser mon mot de passe
            </Button>
          </Section>

          <Text style={warningText}>
            ⚠️ Ce lien expire dans 1 heure. Si vous n&apos;avez pas demandé
            cette réinitialisation, ignorez cet email.
          </Text>

          <Text style={footer}>
            Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre
            navigateur :
          </Text>
          <Text style={linkText}>{resetUrl}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "28px",
  fontWeight: "bold" as const,
  margin: "0 0 24px",
  padding: "0",
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#0ea5e9",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
};

const warningText = {
  color: "#856404",
  backgroundColor: "#fff3cd",
  borderRadius: "8px",
  padding: "12px 16px",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "24px 0 8px",
};

const linkText = {
  color: "#0ea5e9",
  fontSize: "12px",
  lineHeight: "20px",
  wordBreak: "break-all" as const,
};

export default ResetPasswordEmail;
