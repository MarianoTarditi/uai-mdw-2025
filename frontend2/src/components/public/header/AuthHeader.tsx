import {} from "@tabler/icons-react";
import { Box, Group } from "@mantine/core";
import classes from "./AuthHeader.module.css";
import { DarkMode } from "../../public/darkMode/DarkMode";
import { Link } from "react-router-dom";

export function AuthHeader() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" align="center" h="100%">
          
          <Link 
            to="/home" 
            onClick={scrollToTop}
            style={{ display: "flex", alignItems: "center" }} 
          >
            <img 
              src="/Logo.png" 
              alt="Logo" 
              className="linkResetLogo"
              style={{ height: '70px', width: 'auto' }} 
            />
          </Link>

          <Group visibleFrom="sm">
            <DarkMode />
          </Group>
        </Group>
      </header>
    </Box>
  );
}