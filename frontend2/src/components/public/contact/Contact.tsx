import {
  Button,
  Group,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
  Container,
  Notification,
  Badge,
  Card,
  Stack,
  Grid,
} from "@mantine/core";
import { IconMail, IconSend, IconMapPin, IconPhone } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { siteConfig } from "../config/siteConfig";
import classes from "./Contact.module.css";

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      telefono: "",
      time: new Date().toLocaleString("es-AR"),
    },
    validate: {
      name: (value) =>
        value.trim().length < 2
          ? "El nombre debe tener al menos 2 caracteres"
          : null,
      email: (value) => (!/^\S+@\S+$/.test(value) ? "Email inválido" : null),
      subject: (value) =>
        value.trim().length === 0 ? "El asunto es requerido" : null,
      message: (value) =>
        value.trim().length < 10
          ? "El mensaje debe tener al menos 10 caracteres"
          : null,

      telefono: (value) => {
        const digits = value.replace(/\D/g, "");

        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          return "Teléfono inválido";
        }

        if (digits.length < 10) {
          return "Ingresá el Cód. de Área + Número (mínimo 10 números)";
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    console.log("1. Inicio del envío...", values);
    setLoading(true);
    setNotification(null);

    try {
      console.log("2. Configuración cargada:", siteConfig.contact);

      if (siteConfig.contact.useEmailJS) {
        console.log("3. Intentando importar EmailJS...");
        const emailjs = await import("@emailjs/browser");

        const result = await emailjs.send(
          siteConfig.contact.emailJSServiceId,
          siteConfig.contact.emailJSTemplateId,
          {
            name: values.name,
            email: values.email,
            subject: values.subject,
            message: values.message,
            telefono: values.telefono,
            time: values.time,
          },
          siteConfig.contact.emailJSPublicKey,
        );

        console.log("5. RESPUESTA DE EMAILJS:", result);

        if (result.status === 200) {
          setNotification({
            type: "success",
            message:
              "¡Mensaje enviado correctamente! Te responderé a la brevedad.",
          });
          form.reset();
        }
      }
    } catch (error) {
      console.error("ERROR FATAL:", error);
      setNotification({
        type: "error",
        message: "Hubo un error al enviar el mensaje.",
      });
    } finally {
      setLoading(false);
      console.log("6. Finalizó el proceso");
    }
  };

  return (
    <section className={classes.section}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Group justify="center" mb="md">
            <Badge
              size="lg"
              variant="filled"
              className={classes.badge}
              leftSection={<IconMail size={16} />}
            >
              Contacto
            </Badge>
          </Group>
          <Title
            order={2}
            size="h1"
            className={classes.title}
            ta="center"
            mb="sm"
            component="h2"
          >
            Contactáme
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
            ¿Listo para comenzar tu transformación? Completa el formulario y te
            responderé a la brevedad.
          </Text>
        </div>

        {notification && (
          <Notification
            color={notification.type === "success" ? "green" : "red"}
            title={notification.type === "success" ? "Éxito" : "Error"}
            onClose={() => setNotification(null)}
            mb="xl"
            className={classes.notification}
          >
            {notification.message}
          </Notification>
        )}

        <Grid gutter="xl" mt="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              className={classes.mapCard}
              shadow="lg"
              padding={0}
              radius="lg"
              withBorder
            >
              <div className={classes.mapContainer}>
                <iframe
                  src="https://www.google.com/maps?q=Hilario+Lagos+474,+Rojas,Argentina&output=embed"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    borderRadius: "var(--mantine-radius-lg)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del gimnasio - Hilario Lagos 474, Rojas"
                  className={classes.map}
                />
              </div>
              <div className={classes.mapOverlay}>
                <Stack gap="xs" align="center">
                  <IconMapPin
                    size={24}
                    stroke={2}
                    className={classes.mapIcon}
                  />
                  <Text fw={600} size="sm" ta="center">
                    Hilario Lagos 474, Rojas - Buenos Aires
                  </Text>
                </Stack>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              className={classes.formCard}
              shadow="lg"
              padding="xl"
              radius="lg"
            >
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
                  <TextInput
                    label="Nombre y Apellido"
                    placeholder="Tu nombre"
                    name="name"
                    variant="filled"
                    required
                    aria-required="true"
                    aria-label="Nombre completo"
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    label="Email"
                    placeholder="tu@email.com"
                    name="email"
                    type="email"
                    variant="filled"
                    required
                    aria-required="true"
                    aria-label="Dirección de correo electrónico"
                    {...form.getInputProps("email")}
                  />
                </SimpleGrid>

                <TextInput
                  label="Asunto"
                  placeholder="¿En qué puedo ayudarte?"
                  mt="md"
                  name="subject"
                  variant="filled"
                  required
                  aria-required="true"
                  aria-label="Asunto del mensaje"
                  {...form.getInputProps("subject")}
                />

                <TextInput
                  label="Teléfono"
                  placeholder="Tu teléfono"
                  mt="md"
                  name="subject"
                  variant="filled"
                  required
                  aria-required="true"
                  aria-label="Teléfono de contacto"
                  {...form.getInputProps("telefono")}
                />

                <Textarea
                  mt="md"
                  label="Mensaje"
                  placeholder="Cuéntame sobre tus objetivos y cómo puedo ayudarte..."
                  maxRows={10}
                  minRows={5}
                  autosize
                  name="message"
                  variant="filled"
                  required
                  aria-required="true"
                  aria-label="Mensaje"
                  {...form.getInputProps("message")}
                />

                <Group justify="center" mt="xl">
                  <Button
                    type="submit"
                    size="lg"
                    radius="xl"
                    loading={loading}
                    disabled={loading}
                    aria-label="Enviar formulario de contacto"
                    className={classes.submitButton}
                    leftSection={!loading && <IconSend size={18} />}
                    variant="filled"
                  >
                    {loading ? "Enviando..." : "Enviar mensaje"}
                  </Button>
                </Group>
              </form>
            </Card>
          </Grid.Col>
        </Grid>

        <SimpleGrid
          cols={{ base: 1, sm: 3 }}
          spacing="lg"
          mt="xl"
          className={classes.infoCards}
        >
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className={classes.infoCard}
          >
            <Stack align="center" gap="sm">
              <div className={classes.iconWrapper}>
                <IconMapPin size={32} stroke={1.5} className={classes.icon} />
              </div>
              <Text fw={600} size="lg" ta="center">
                Ubicación
              </Text>
              <Text c="dimmed" size="sm" ta="center">
                Sarmiento y Marmol, Rojas
              </Text>
            </Stack>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className={classes.infoCard}
          >
            <Stack align="center" gap="sm">
              <div className={classes.iconWrapper}>
                <IconPhone size={32} stroke={1.5} className={classes.icon} />
              </div>
              <Text fw={600} size="lg" ta="center">
                Teléfono
              </Text>
              <Text c="dimmed" size="sm" ta="center">
                <a href="tel:+5492494657475" className={classes.link}>
                  2474416101
                </a>
              </Text>
            </Stack>
          </Card>

          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className={classes.infoCard}
          >
            <Stack align="center" gap="sm">
              <div className={classes.iconWrapper}>
                <IconMail size={32} stroke={1.5} className={classes.icon} />
              </div>
              <Text fw={600} size="lg" ta="center">
                Email
              </Text>
              <Text c="dimmed" size="sm" ta="center">
                <a
                  href="mailto:agustinturri1@gmail.com"
                  className={classes.link}
                >
                  agustinturri1@gmail.com
                </a>
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>
      </Container>
    </section>
  );
}
