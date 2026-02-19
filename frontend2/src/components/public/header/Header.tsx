import { Box, Burger, Divider, Drawer, Group, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import classes from "./Header.module.css";
import { DarkMode } from "../darkMode/DarkMode";
import { Link } from "react-router-dom";

export function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box>
      <header
        className={`${classes.header} ${scrolled ? classes.scrolled : ""}`}
        role="banner"
      >
        <nav
          aria-label="Navegación principal"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Group
            justify="space-between"
            h="100%"
            style={{ width: "100%", height: "100%" }}
          >
            <div className={classes.logoContainer}>
              <Link
                to="/"
                className="linkResetLogo"
                aria-label="Ir al inicio - Turri Gym"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
              >
                <img
                  src="/Logo.png"
                  alt="Turri Gym - Logo"
                  className={classes.logoImage}
                />
              </Link>
            </div>

            <Group
              h="100%"
              gap={0}
              visibleFrom="sm"
              className={classes.navCenter}
              role="list"
            >
              <a
                href="#inicio"
                className={classes.link}
                role="listitem"
                aria-label="Ir a la sección de inicio"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("inicio")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Inicio
              </a>
              <a
                href="#planes"
                className={classes.link}
                role="listitem"
                aria-label="Ir a la sección de planes"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("planes")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Planes
              </a>
              <a
                href="#instalaciones"
                className={classes.link}
                role="listitem"
                aria-label="Ir a la sección de instalaciones"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("instalaciones")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Instalaciones
              </a>
              <a
                href="#faq"
                className={classes.link}
                role="listitem"
                aria-label="Ir a la sección de preguntas frecuentes"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("faq")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                FAQ
              </a>
              <a
                href="#contact"
                className={classes.link}
                role="listitem"
                aria-label="Ir a la sección de contacto"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contacto
              </a>
            </Group>

            <Group visibleFrom="sm">
              <DarkMode />
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
              color="white"
              size="md"
              aria-label="Abrir menú de navegación"
              aria-expanded={drawerOpened}
            />
          </Group>
        </nav>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menú de navegación"
        hiddenFrom="sm"
        zIndex={1000000}
        aria-label="Menú de navegación móvil"
      >
        <ScrollArea h={`calc(100vh - ${80}px)`} mx="-md">
          <Divider my="sm" />

          <a
            href="#inicio"
            className={classes.link}
            onClick={(e) => {
              e.preventDefault();
              closeDrawer();
              setTimeout(() => {
                document
                  .getElementById("inicio")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Inicio
          </a>
          <a
            href="#planes"
            className={classes.link}
            onClick={(e) => {
              e.preventDefault();
              closeDrawer();
              setTimeout(() => {
                document
                  .getElementById("planes")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Planes
          </a>
          <a
            href="#instalaciones"
            className={classes.link}
            onClick={(e) => {
              e.preventDefault();
              closeDrawer();
              setTimeout(() => {
                document
                  .getElementById("instalaciones")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Instalaciones
          </a>
          <a
            href="#faq"
            className={classes.link}
            onClick={(e) => {
              e.preventDefault();
              closeDrawer();
              setTimeout(() => {
                document
                  .getElementById("faq")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            FAQ
          </a>
          <a
            href="#contact"
            className={classes.link}
            onClick={(e) => {
              e.preventDefault();
              closeDrawer();
              setTimeout(() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Contacto
          </a>

          <Divider my="sm" />

          <Group
            justify="center"
            pb="xl"
            px="md"
            className={classes.mobileThemeToggle}
          >
            <DarkMode />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
