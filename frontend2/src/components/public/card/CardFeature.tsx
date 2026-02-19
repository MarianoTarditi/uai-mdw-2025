import {
  IconBrandWhatsapp,
  IconPlayerPlay,
  IconBarbell,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
} from "@mantine/core";
import classes from "./CardFeature.module.css";
import { Baner } from "../baner/Baner";
import { Titles } from "../title/Titles";
import { siteConfig } from "../config/siteConfig";

const mockdata = [
  {
    title: "Videos de ejercicios",
    description: "Obtené videos demostrativos via WhatsApp.",
    icon: IconPlayerPlay,
  },
  {
    title: "Corrección de técnica",
    description:
      "Mejorá la técnica de tus ejercicios a partir de un feedback constante.",
    icon: IconBarbell,
  },
  {
    title: "Progresión semanal",
    description:
      "Seguimiento personalizado de cargas, repeticiones y rendimiento.",
    icon: IconTrendingUp,
  },
  {
    title: "Soporte por WhatsApp",
    description: "Consultas directas, dudas y seguimiento constante.",
    icon: IconBrandWhatsapp,
  },
];

const goToWhatsApp = () => {
  const message =
    "Hola Agustin! Quiero solicitar información sobre los planes de entrenamiento.";
  const url = `https://wa.me/${siteConfig.social.whatsapp}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

export function CardFeature() {
  const features = mockdata.map((feature, index) => (
    <Card
      key={index}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
      style={{ animationDelay: `${index * 0.2}s` }}
      tabIndex={0}
      role="article"
      aria-label={feature.title}
    >
      <feature.icon
        size={50}
        stroke={1.5}
        className={classes.icon}
        aria-hidden="true"
      />
      <Text fz="lg" fw={800} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm" style={{ flex: 1 }}>
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <div className={classes.sectionBackground}>
      <div className={classes.overlay} />

      <Container size="xl" className={classes.content}>
        <Group justify="center">
          <Badge variant="filled" size="lg" className={classes.badge}>
            Entrenamiento Personalizado
          </Badge>
        </Group>

        <Titles
          title="Planes"
          description="Plan de entrenamiento de fuerza personalizado. Mejora tu salud, tu rendimiento deportivo o tu estética. Adaptado a objetivos, necesidades y posibilidades."
        />

        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "var(--mantine-color-blue-5)",
            margin: "0 auto 30px auto",
            borderRadius: "2px",
          }}
        />

        <Baner />

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl" mt={50}>
          {features}
        </SimpleGrid>

        <Group justify="center" mt={50}>
          <Button
            variant="filled"
            size="md"
            radius="xl"
            className={classes.button}
            onClick={goToWhatsApp}
          >
            Solicitar plan
          </Button>
        </Group>
      </Container>
    </div>
  );
}
