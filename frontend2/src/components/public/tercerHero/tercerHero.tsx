import {
  Badge,
  Container,
  Group,
  Overlay,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { IconCheck, IconClock, IconUsers } from "@tabler/icons-react";
import classes from "./TercerHero.module.css";
import { Carrusel } from "../carrusel/Carrusel";
import { useEffect, useRef, useState } from "react";

const facilityHighlights = [
  {
    title: "1 Profesor",
    detail: "Cada 5 alumnos",
    icon: IconUsers,
  },
  {
    title: "Horarios",
    detail: "Fijos",
    icon: IconClock,
  },
  {
    title: "Cupo",
    detail: "Limitado",
    icon: IconCheck,
  },
];

export function TercerHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element || shouldLoadMedia) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadMedia(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoadMedia]);

  return (
    <section
      ref={sectionRef}
      className={classes.hero}
      aria-labelledby="instalaciones-title"
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.4712) 0%, rgba(0, 0, 0, 0.38) 40%, rgba(0, 0, 0, 0.3192) 72%, rgba(0, 0, 0, 0.2736) 100%)"
        opacity={1}
        zIndex={1}
      />

      <Container className={classes.contentContainer} size="xl">
        <div className={classes.heroShell}>
          <div className={classes.headerShell}>
            <Badge size="lg" variant="filled" className={classes.badge}>
              Entrenamientos personalizados
            </Badge>

            <Title
              id="instalaciones-title"
              order={2}
              className={classes.title}
              ta="center"
            >
              Instalaciones
            </Title>

            <div className={classes.divider} />

            <Text className={classes.description} ta="center">
              Un espacio pensado para entrenar con foco, seguimiento real y una
              din�mica de trabajo que prioriza la atenci�n individual.
            </Text>

            <Group justify="center" gap="lg" className={classes.features}>
              {facilityHighlights.map((feature) => (
                <div key={feature.title} className={classes.featureItem}>
                  <div className={classes.featureIconShell}>
                    <feature.icon
                      size={24}
                      stroke={2}
                      className={classes.featureIcon}
                    />
                  </div>
                  <Text size="sm" fw={700} className={classes.featureTitle}>
                    {feature.title}
                  </Text>
                  <Text size="xs" className={classes.featureDetail}>
                    {feature.detail}
                  </Text>
                </div>
              ))}
            </Group>
          </div>

          <div className={classes.copyShell}>
            <div className={classes.copyContent}>
              <Text className={classes.copyParagraph}>
                 - Un profesor cada 5 alumnos, adaptando el plan de entrenamiento a
                los objetivos específicos de cada persona.
              </Text>
              <Text className={classes.copyParagraphSecondary}>
                - Horarios fijos y cupo limitado, para garantizar una atención
                verdaderamente personalizada.
              </Text>
            </div>
          </div>
        </div>

        <div className={classes.mediaShell}>
          <div className={classes.mediaHeader}>
            <Text className={classes.mediaEyebrow}>Entrenamiento en acci�n</Text>

            <div className={classes.divider} />
          </div>

          {shouldLoadMedia ? (
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing="sm"
              className={classes.mediaGrid}
            >
              <Carrusel
                media={[
                  {
                    src: "/images/VideoLugar1.mp4",
                    alt: "Clase en movimiento",
                  },
                  {
                    src: "/images/espacio1.jpeg",
                    alt: "Zona principal de trabajo",
                  },
                  {
                    src: "/images/videoGenereal.mp4",
                    alt: "Entrenamiento guiado",
                  },
                  {
                    src: "/images/VideoGeneral2.mp4",
                    alt: "Seguimiento t�cnico",
                  },
                ]}
              />
              <Carrusel
                media={[
                  {
                    src: "/images/espacio2.jpeg",
                    alt: "Area de entrenamiento",
                  },
                  {
                    src: "/images/VideoAdriano.mp4",
                    alt: "Correcci�n de ejercicios",
                  },
                  {
                    src: "/images/espacio5.jpeg",
                    alt: "Sector de equipamiento",
                  },
                  {
                    src: "/images/CampeonDelmundo.mp4",
                    alt: "Trabajo en acci�n",
                  },
                ]}
              />
            </SimpleGrid>
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing="sm"
              className={classes.mediaGrid}
            >
              {[1, 2].map((item) => (
                <div key={item} className={classes.mediaPlaceholder} />
              ))}
            </SimpleGrid>
          )}
        </div>
      </Container>
    </section>
  );
}
