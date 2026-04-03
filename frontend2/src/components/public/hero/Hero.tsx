import { Container, Overlay, Text, Button, Group } from "@mantine/core";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { siteConfig } from "../config/siteConfig";
import classes from "./Hero.module.css";

export function Hero() {
  return (
    <div className={classes.hero} role="banner">
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.4712) 0%, rgba(0, 0, 0, 0.38) 40%, rgba(0, 0, 0, 0.3192) 72%, rgba(0, 0, 0, 0.2736) 100%)"
        opacity={1}
        zIndex={0}
        blur={2}
      />
      <Container className={classes.container} size="lg">
        <div className={classes.logoSection}>
          <div className={classes.logoContainer}>
            <div className={classes.line}></div>
            <img
              src="/Logo.png"
              alt="Agustin Turri - Entrenador de Fuerza"
              className={classes.logo}
            />
            <div className={classes.line}></div>
          </div>

          <div className={classes.bottomText}>
            <Text className={classes.ctaQuestion}></Text>
            <Text className={classes.ctaAction}>
              ¡ESCRIBIME Y EMPEZÁ HOY MISMO!
            </Text>
          </div>

          <Group
            mt="xl"
            gap="md"
            justify="center"
            className={classes.buttonGroup}
          >
            <Button
              variant="filled"
              size="md"
              radius="xl"
              onClick={() => {
                window.location.href = "/login";
              }}
              className={classes.button}
            >
              iniciar Sesión
            </Button>
            <Button
              size="md"
              radius="xl"
              variant="outline"
              rightSection={<IconBrandWhatsapp size={20} />}
              className={classes.controlSecondary}
              onClick={() => {
                const message =
                  "Hola Agustin! Quiero solicitar información sobre los planes de entrenamiento.";
                const url = `https://wa.me/${siteConfig.social.whatsapp}?text=${encodeURIComponent(message)}`;
                window.open(url, "_blank");
              }}
              aria-label="Contactar por WhatsApp"
            >
              Contáctame 
            </Button>
          </Group>
        </div>
      </Container>
    </div>
  );
}
