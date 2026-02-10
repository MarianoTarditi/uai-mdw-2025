import {} from "@tabler/icons-react";
import { Box, Group } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./AuthHeader.module.css";
import { DarkMode } from "../../public/darkMode/DarkMode";
import { Link } from "react-router-dom";

export function AuthHeader() {
  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Link to="/">
            <MantineLogo size={30} className="linkResetLogo" />
          </Link>

          <Group visibleFrom="sm">
            <DarkMode />
          </Group>
        </Group>
      </header>
    </Box>
  );
}
