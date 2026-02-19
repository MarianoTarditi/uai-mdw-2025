import { Container, Overlay, Text, Button, Group } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import classes from "./Hero.module.css";
import type { CSSProperties } from "react";
import fuerza from "../../../assets/Fuerza.jpeg";

export function Hero() {
  return (
    <div
      className={classes.hero}
      role="banner"
      style={{ "--hero-bg-image": `url(${fuerza})` } as CSSProperties}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 50%, #000000 100%)"
        opacity={0.85}
        zIndex={0}
        blur={3}
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
              Comenzar Ahora
            </Button>
            <Button
              size="md"
              radius="xl"
              variant="outline"
              rightSection={<IconArrowDown size={20} />}
              className={classes.controlSecondary}
              onClick={() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              aria-label="Ver planes de entrenamiento"
            >
              Solicitar Plan
            </Button>
          </Group>
        </div>
      </Container>
    </div>
  );
}
