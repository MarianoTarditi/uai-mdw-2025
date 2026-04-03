import { Box, Burger, Divider, Drawer, Group, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import classes from "./Header.module.css";
import { DarkMode } from "../darkMode/DarkMode";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Inicio", target: "inicio" },
  { label: "Planes", target: "planes" },
  { label: "Instalaciones", target: "instalaciones" },
  { label: "FAQ", target: "faq" },
  { label: "Contacto", target: "contact" },
];

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

  const scrollToSection = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box>
      <header
        className={`${classes.header} ${scrolled ? classes.scrolled : ""}`}
        role="banner"
      >
        <div className={classes.innerShell}>
          <nav className={classes.nav} aria-label="Navegación principal">
            <Group justify="space-between" h="100%" className={classes.navGroup}>
              <div className={classes.logoContainer}>
                <Link
                  to="/"
                  className={classes.logoLink}
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
                gap={6}
                visibleFrom="sm"
                className={classes.navCenter}
                role="list"
              >
                {navItems.map((item) => (
                  <a
                    key={item.target}
                    href={`#${item.target}`}
                    className={classes.link}
                    role="listitem"
                    aria-label={`Ir a la sección de ${item.label.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.target);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </Group>

              <Group visibleFrom="sm" className={classes.actionsGroup}>
                <DarkMode />
              </Group>

              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                hiddenFrom="sm"
                className={classes.burger}
                size="md"
                aria-label="Abrir menú de navegación"
                aria-expanded={drawerOpened}
              />
            </Group>
          </nav>
        </div>
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
        classNames={{
          content: classes.drawerContent,
          header: classes.drawerHeader,
          title: classes.drawerTitle,
          body: classes.drawerBody,
        }}
      >
        <ScrollArea h={`calc(100vh - ${80}px)`} mx="-md">
          <Divider my="sm" className={classes.drawerDivider} />

          {navItems.map((item) => (
            <a
              key={item.target}
              href={`#${item.target}`}
              className={`${classes.link} ${classes.mobileLink}`}
              onClick={(e) => {
                e.preventDefault();
                closeDrawer();
                setTimeout(() => {
                  scrollToSection(item.target);
                }, 100);
              }}
            >
              {item.label}
            </a>
          ))}

          <Divider my="sm" className={classes.drawerDivider} />

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
