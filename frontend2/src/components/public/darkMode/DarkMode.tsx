import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import classes from "./DarkMode.module.css";

export function DarkMode() {
  const { setColorScheme } = useMantineColorScheme();

  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      color="white"
      variant="subtle"
      size="xl"
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      aria-label="Cambiar tema de color"
      className={classes.toggle}
    >
      <span className={classes.iconShell}>
        {computedColorScheme === "light" ? (
          <IconMoon stroke={1.7} className={classes.icon} />
        ) : (
          <IconSun stroke={1.7} className={classes.icon} />
        )}
      </span>
    </ActionIcon>
  );
}
