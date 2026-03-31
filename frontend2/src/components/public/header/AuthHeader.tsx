import { Box, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";

export function AuthHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                to="/home"
                className="linkResetLogo"
                aria-label="Ir al inicio - Turri Gym"
              >
                <img
                  src="/Logo.png"
                  alt="Turri Gym - Logo"
                  className={classes.logoImage}
                />
              </Link>
            </div>

       
          </Group>
        </nav>
      </header>
    </Box>
  );
}
