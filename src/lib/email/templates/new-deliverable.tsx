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

interface NewDeliverableEmailProps {
  clientName: string;
  deliverableName: string;
  projectName: string;
  deliverableUrl: string;
  deliverableType?: string;
}

export function NewDeliverableEmail({
  clientName,
  deliverableName,
  projectName,
  deliverableUrl,
  deliverableType = "Document",
}: NewDeliverableEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Nouveau livrable disponible : {deliverableName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>📦 Nouveau livrable disponible</Heading>

          <Text style={text}>Bonjour {clientName},</Text>

          <Text style={text}>
            Un nouveau livrable est disponible pour validation sur votre projet{" "}
            <strong>{projectName}</strong>.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>Détails du livrable</Text>
            <Text style={infoText}>
              <strong>Nom :</strong> {deliverableName}
            </Text>
            <Text style={infoText}>
              <strong>Type :</strong> {deliverableType}
            </Text>
            <Text style={infoText}>
              <strong>Projet :</strong> {projectName}
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={deliverableUrl}>
              Consulter et valider
            </Button>
          </Section>

          <Text style={footer}>
            Connectez-vous à votre portail client pour consulter ce livrable et
            donner votre avis.
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
  margin: "0 0 16px",
};

const infoBox = {
  backgroundColor: "#f0f9ff",
  borderRadius: "8px",
  borderLeft: "4px solid #0ea5e9",
  padding: "20px",
  margin: "0 0 24px",
};

const infoTitle = {
  color: "#0369a1",
  fontSize: "14px",
  fontWeight: "bold" as const,
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};

const infoText = {
  color: "#1a1a1a",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
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

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  textAlign: "center" as const,
};

export default NewDeliverableEmail;
