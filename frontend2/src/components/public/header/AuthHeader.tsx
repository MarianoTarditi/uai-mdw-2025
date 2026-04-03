import { Box, Group } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DarkMode } from "../darkMode/DarkMode";
import headerClasses from "./Header.module.css";

const LANDING_PATH = "/home";

export function AuthHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const shellStyle = scrolled
    ? {
        background:
          "linear-gradient(180deg, rgba(3, 7, 18, 0.96), rgba(3, 7, 18, 0.88))",
        borderColor: "rgba(191, 219, 254, 0.18)",
        boxShadow: "0 24px 60px rgba(2, 6, 23, 0.44)",
      }
    : {
        background:
          "linear-gradient(180deg, rgba(5, 9, 19, 0.94), rgba(5, 9, 19, 0.82))",
        borderColor: "rgba(148, 163, 184, 0.18)",
        boxShadow: "0 20px 52px rgba(2, 6, 23, 0.34)",
      };

  return (
    <Box>
      <header
        className={`${headerClasses.header} ${scrolled ? headerClasses.scrolled : ""}`}
        role="banner"
        style={{
          background:
            "linear-gradient(180deg, rgba(2, 6, 23, 0.42), rgba(2, 6, 23, 0.05))",
        }}
      >
        <div className={headerClasses.innerShell} style={shellStyle}>
          <nav className={headerClasses.nav} aria-label="Navegación de autenticación">
            <Group justify="space-between" h="100%" className={headerClasses.navGroup}>
              <div className={headerClasses.logoContainer}>
                <Link
                  to={LANDING_PATH}
                  className={headerClasses.logoLink}
                  aria-label="Volver al inicio - Turri Gym"
                  onClick={handleGoHome}
                >
                  <img
                    src="/Logo.png"
                    alt="Turri Gym - Logo"
                    className={headerClasses.logoImage}
                  />
                </Link>
              </div>

              <Group visibleFrom="sm" className={headerClasses.navCenter} role="list">
                <Link
                  to={LANDING_PATH}
                  className={headerClasses.link}
                  role="listitem"
                  aria-label="Volver al inicio"
                  onClick={handleGoHome}
                >
                  <IconArrowLeft size={16} stroke={2} />
                  <span>Volver al inicio</span>
                </Link>
              </Group>

              <Group gap="xs" className={headerClasses.actionsGroup}>
                <Group hiddenFrom="sm">
                  <Link
                    to={LANDING_PATH}
                    className={headerClasses.link}
                    aria-label="Ir al inicio"
                    onClick={handleGoHome}
                  >
                    <IconArrowLeft size={16} stroke={2} />
                    <span>Inicio</span>
                  </Link>
                </Group>
                <DarkMode />
              </Group>
            </Group>
          </nav>
        </div>
      </header>
    </Box>
  );
}
