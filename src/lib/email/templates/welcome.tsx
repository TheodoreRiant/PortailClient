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

interface WelcomeEmailProps {
  nom: string;
  loginUrl: string;
  email: string;
  tempPassword: string;
}

export function WelcomeEmail({
  nom,
  loginUrl,
  email,
  tempPassword,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenue sur votre portail client</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bienvenue {nom} 👋</Heading>

          <Text style={text}>
            Votre accès au portail client est maintenant actif. Vous pouvez
            suivre vos projets, valider vos livrables et consulter vos factures
            en temps réel.
          </Text>

          <Section style={codeBox}>
            <Text style={codeText}>
              <strong>Email :</strong> {email}
            </Text>
            <Text style={codeText}>
              <strong>Mot de passe temporaire :</strong> {tempPassword}
            </Text>
          </Section>

          <Text style={warningText}>
            ⚠️ Par sécurité, vous serez invité à changer ce mot de passe lors de
            votre première connexion.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Se connecter au portail
            </Button>
          </Section>

          <Text style={footer}>
            Si vous avez des questions, n&apos;hésitez pas à nous contacter.
          </Text>
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
  margin: "0 0 24px",
};

const codeBox = {
  backgroundColor: "#f4f7fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px",
};

const codeText = {
  color: "#1a1a1a",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "0 0 8px",
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

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0 0 24px",
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

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  textAlign: "center" as const,
};

export default WelcomeEmail;
