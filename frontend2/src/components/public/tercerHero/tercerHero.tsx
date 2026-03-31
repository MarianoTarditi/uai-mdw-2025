import {
  Container,
  Overlay,
  Title,
  Text,
  Badge,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { IconUsers, IconClock, IconCheck } from "@tabler/icons-react";
import classes from "./TercerHero.module.css";
import { Titles } from "./title/Titles";
import { Carrusel } from "../carrusel/Carrusel";
import { useEffect, useRef, useState } from "react";

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
      {shouldLoadMedia && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className={classes.videoBackground}
          aria-hidden="true"
        >
          <source src="/images/Video5.mp4" type="video/mp4" />
        </video>
      )}

      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%)"
        opacity={0.85}
        zIndex={1}
      />

      <Container className={classes.contentContainer} size="xl">
        <div className={classes.contentWrapper}>
          <Badge
            size="lg"
            variant="light"
            color="blue"
            mb="md"
            className={classes.badge}
          >
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

          <div
            style={{
              width: "60px",
              height: "3px",
              backgroundColor: "var(--mantine-color-blue-5)",
              margin: "0 auto 30px auto",
              borderRadius: "2px",
            }}
          />

          <Text className={classes.description} ta="center" mt="md">
            El entrenamiento es personalizado, con grupos reducidos para
            asegurar que cada alumno reciba atención individualizada.
          </Text>

          <Group justify="center" gap="xl" mt="xl" className={classes.features}>
            <div className={classes.featureItem}>
              <IconUsers size={24} stroke={2} className={classes.featureIcon} />
              <Text size="sm" fw={600} c="white">
                1 Profesor
              </Text>
              <Text size="xs" c="dimmed">
                Cada 5 alumnos
              </Text>
            </div>
            <div className={classes.featureDivider} />
            <div className={classes.featureItem}>
              <IconClock size={24} stroke={2} className={classes.featureIcon} />
              <Text size="sm" fw={600} c="white">
                Horarios
              </Text>
              <Text size="xs" c="dimmed">
                Fijos
              </Text>
            </div>
            <div className={classes.featureDivider} />
            <div className={classes.featureItem}>
              <IconCheck size={24} stroke={2} className={classes.featureIcon} />
              <Text size="sm" fw={600} c="white">
                Cupo
              </Text>
              <Text size="xs" c="dimmed">
                Limitado
              </Text>
            </div>
          </Group>
        </div>

        <Titles description="Un profesor cada 5 alumnos, adaptando el plan de entrenamiento a los objetivos específicos de cada persona. Horarios fijos y cupo limitado, para garantizar una atención verdaderamente personalizada." />

        <Title
          order={3}
          ta="center"
          c="white"
          mt={60}
          mb={10}
          style={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
          }}
        >
          Entrenamiento en acción
        </Title>

        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "var(--mantine-color-blue-5)",
            margin: "0 auto 30px auto",
            borderRadius: "2px",
          }}
        />

        {shouldLoadMedia ? (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <Carrusel
              media={[
                { src: "/images/espacio1.jpeg", alt: "Espacio" },
                { src: "/images/videoGenereal.mp4", alt: "Video Adriano" },
                { src: "/images/VideoTeisa.mp4", alt: "Video Teisa" },
                { src: "/images/VideoGeneral2.mp4", alt: "Video Adriano" },
              ]}
            />
            <Carrusel
              media={[
                { src: "/images/espacio2.jpeg", alt: "Espacio 2" },
                { src: "/images/VideoAdriano.mp4", alt: "Video Adriano" },
                { src: "/images/espacio5.jpeg", alt: "Espacio 5" },
                { src: "/images/VideoGeneral3.mp4", alt: "Video Adriano" },
              ]}
            />
          </SimpleGrid>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {[1, 2].map((item) => (
              <div
                key={item}
                style={{
                  height: 600,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                }}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </section>
  );
}
