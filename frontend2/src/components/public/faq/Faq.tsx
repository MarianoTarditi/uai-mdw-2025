import { Accordion, Badge, Container, Group, Text, Title } from "@mantine/core";
import { IconHelpCircle } from "@tabler/icons-react";
import classes from "./Faq.module.css";

export function Faq() {
  return (
    <section className={classes.section}>
      <div className={classes.overlay} />
      <div className={classes.glowTop} aria-hidden="true" />
      <div className={classes.glowBottom} aria-hidden="true" />

      <Container size="sm" className={classes.wrapper} id="faq">
        <div className={classes.headerShell}>
          <div className={classes.header}>
            <Group justify="center" mb="md">
              <Badge
                size="lg"
                variant="filled"
                className={classes.badge}
                leftSection={<IconHelpCircle size={16} />}
              >
                FAQ
              </Badge>
            </Group>
            <Title ta="center" className={classes.title} mb="sm" component="h2">
              Preguntas Frecuentes
            </Title>
            <div className={classes.divider} />
            <Text ta="center" className={classes.subtitle} mt="sm">
              Todo lo que necesitás saber sobre los planes de entrenamiento,
              metodologa y acompañamiento.
            </Text>
          </div>

          <Accordion
            variant="separated"
            aria-label="Preguntas frecuentes sobre entrenamiento"
            className={classes.accordion}
          >
            <Accordion.Item className={classes.item} value="como-funciona">
              <Accordion.Control>
                ¿Cómo funciona el entrenamiento personalizado?
              </Accordion.Control>
              <Accordion.Panel>
                El entrenamiento es completamente personalizado segín tus
                objetivos, nivel de condicin fsica y disponibilidad. Recibirs
                un plan adaptado a tus necesidades, con seguimiento constante y
                ajustes semanales basados en tu progreso. Todo esto se
                complementa con videos demostrativos, correccin de tcnica y
                soporte directo por WhatsApp.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="cuanto-tiempo">
              <Accordion.Control>
                ¿Cuánto tiempo necesito para ver resultados?
              </Accordion.Control>
              <Accordion.Panel>
                Los resultados varían segün cada persona y sus objetivos.
                Generalmente, con un entrenamiento constante y adecuado, podés
                comenzar a notar mejoras en fuerza y resistencia en las primeras
                4 a 6 semanas. Los cambios más significativos en composición
                corporal suelen verse después de 8 a 12 semanas.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="principiante">
              <Accordion.Control>
                ¿Puedo entrenar si soy principiante?
              </Accordion.Control>
              <Accordion.Panel>
                ¿Absolutamente! El entrenamiento está diseñado para adaptarse a
                todos los niveles, desde principiantes hasta avanzados. Si estás
                empezando, se arranca con ejercicios básicos y se progresa de
                forma gradual, siempre priorizando técnica y seguridad.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="equipamiento">
              <Accordion.Control>
                ¿Necesito equipamiento especial?
              </Accordion.Control>
              <Accordion.Panel>
                El plan se adapta a lo que tengas disponible. Se pueden diseñar
                entrenamientos para gimnasio completo, gimnasio básico o incluso
                entrenamiento en casa con equipamiento mínimo. Siempre hay
                alternativas según tu situación.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className={classes.item} value="horarios">
              <Accordion.Control>
                ¿Hay horarios fijos o puedo entrenar cuando quiera?
              </Accordion.Control>
              <Accordion.Panel>
                El entrenamiento es flexible y pods realizarlo en el momento
                que mejor se adapte a tu rutina. Si prefers entrenar en grupo,
                tambin hay sesiones con horarios fijos y cupo limitado para
                garantizar atención personalizada.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
