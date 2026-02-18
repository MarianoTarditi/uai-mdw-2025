import { Accordion, Container, Title, Badge, Text, Group } from "@mantine/core";
import { IconHelpCircle } from "@tabler/icons-react";
import classes from "./Faq.module.css";

export function Faq() {
  return (
    <section className={classes.section}>
      <Container size="sm" className={classes.wrapper} id="faq">
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
          <div
            style={{
              width: "60px",
              height: "3px",
              backgroundColor: "var(--mantine-color-blue-5)",
              margin: "0 auto 30px auto",
              borderRadius: "2px",
            }}
          />
          <Text ta="center" className={classes.subtitle} mt="sm">
            Todo lo que necesitas saber sobre nuestros planes de entrenamiento
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
              El entrenamiento es completamente personalizado según tus
              objetivos, nivel de condición física y disponibilidad. Recibirás
              un plan de entrenamiento adaptado a tus necesidades, con
              seguimiento constante y ajustes semanales basados en tu progreso.
              Todo esto se complementa con videos demostrativos, corrección de
              técnica y soporte directo por WhatsApp.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="cuanto-tiempo">
            <Accordion.Control>
              ¿Cuánto tiempo necesito para ver resultados?
            </Accordion.Control>
            <Accordion.Panel>
              Los resultados varían según cada persona y sus objetivos.
              Generalmente, con un entrenamiento constante y adecuado, puedes
              comenzar a notar mejoras en fuerza y resistencia en las primeras
              4-6 semanas. Los cambios más significativos en composición
              corporal suelen verse después de 8-12 semanas de entrenamiento
              consistente combinado con una alimentación adecuada.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="principiante">
            <Accordion.Control>
              ¿Puedo entrenar si soy principiante?
            </Accordion.Control>
            <Accordion.Panel>
              ¡Absolutamente! El entrenamiento está diseñado para adaptarse a
              todos los niveles, desde principiantes hasta avanzados. Si eres
              nuevo en el entrenamiento de fuerza, comenzaremos con ejercicios
              básicos y progresaremos gradualmente, siempre priorizando la
              técnica correcta y la seguridad.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="equipamiento">
            <Accordion.Control>
              ¿Necesito equipamiento especial?
            </Accordion.Control>
            <Accordion.Panel>
              El plan se adapta a lo que tengas disponible. Puedo diseñar
              entrenamientos para gimnasio completo, gimnasio básico o incluso
              entrenamiento en casa con equipamiento mínimo. Te proporcionaré
              alternativas para cada ejercicio según tu situación.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="horarios">
            <Accordion.Control>
              ¿Hay horarios fijos o puedo entrenar cuando quiera?
            </Accordion.Control>
            <Accordion.Panel>
              El entrenamiento es flexible y puedes realizarlo en el momento que
              mejor se adapte a tu rutina. Sin embargo, si prefieres entrenar en
              grupo, ofrezco sesiones con horarios fijos y cupo limitado (un
              profesor cada 4 alumnos) para garantizar atención personalizada.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </section>
  );
}
