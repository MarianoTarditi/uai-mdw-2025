import {
  IconBrandWhatsapp,
  IconPlayerPlay,
  IconBarbell,
  IconTrendingUp,
  IconArrowDown,
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

const mockdata = [
  {
    title: "Videos de ejercicios",
    description: "Obtené videos demostrativos v�a WhatsApp.",
    icon: IconPlayerPlay,
  },
  {
    title: "Corrección de técnica",
    description:
      "Mejor la tcnica de tus ejercicios a partir de un feedback constante.",
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

export function CardFeature() {
  const features = mockdata.map((feature, index) => (
    <Card
      key={feature.title}
      shadow="xl"
      radius="xl"
      className={classes.card}
      padding="xl"
      style={{ animationDelay: `${index * 0.12}s` }}
      tabIndex={0}
      role="article"
      aria-label={feature.title}
    >
      <div className={classes.cardIndex}>{`0${index + 1}`}</div>
      <feature.icon
        size={46}
        stroke={1.5}
        className={classes.icon}
        aria-hidden="true"
      />
      <Text fz="lg" fw={800} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" mt="sm" className={classes.cardDescription}>
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <div className={classes.sectionBackground}>
      <div className={classes.overlay} />
      <div className={classes.glowTop} aria-hidden="true" />
      <div className={classes.glowBottom} aria-hidden="true" />

      <Container size="xl" className={classes.content}>
        <div className={classes.headerShell}>
          <Group justify="center">
            <Badge variant="filled" size="lg" className={classes.badge}>
              Entrenamiento Personalizado
            </Badge>
          </Group>

          <Titles
            title="Planes"
            description="Plan de entrenamiento de fuerza personalizado. Mejora tu salud, tu rendimiento deportivo o tu est�tica. Adaptado a objetivos, necesidades y posibilidades."
          />

          <div className={classes.divider} />

          <Text className={classes.intro}>
            Un acompañamiento pensado para que entrenes con criterio,
            progresión y seguimiento real. Sin improvisación. Sin planes
            genéricos.
          </Text>

          <Baner tone="dark" />
        </div>

        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 4 }}
          spacing={{ base: "md", md: "xl" }}
          mt={{ base: 32, md: 50 }}
          className={classes.grid}
        >
          {features}
        </SimpleGrid>

        <Group justify="center" mt={{ base: 32, md: 50 }}>
          <Button
            variant="filled"
            size="md"
            radius="xl"
            rightSection={<IconArrowDown size={20} />}
            className={classes.button}
            onClick={() => {
              const contactSection = document.getElementById("contact");
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Solicitar plan
          </Button>
        </Group>
      </Container>
    </div>
  );
}
