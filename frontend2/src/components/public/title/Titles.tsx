import { Text, Title } from "@mantine/core";
import classes from "./Titles.module.css";

interface TitlesProps {
  title?: string;
  description: string;
}

export function Titles({ title, description }: TitlesProps) {
  return (
    <div className={classes.wrapper}>
      {title && (
        <>
          <Text className={classes.eyebrow}>Entrenamiento personalizado</Text>
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="sm"
            component="h2"
          >
            {title}
          </Title>
          <div className={classes.divider} />
        </>
      )}

      <Text ta="center" mt="md" fz={18} className={classes.description}>
        {description}
      </Text>
    </div>
  );
}
