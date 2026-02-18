import { Title, Text } from "@mantine/core";
import classes from "./Titles.module.css";

interface TitlesProps {
  title?: string; 
  description: string;
}

export function Titles({ title, description }: TitlesProps) {
  return (
    <div className={classes.wrapper}>
      {title && (
        <Title
          order={2}
          className={classes.title}
          ta="center"
          mt="sm"
          component="h2"
        >
          {title}
        </Title>
      )}

      <Text
        c="dimmed"
        ta="center"
        mt="md"
        fz={18}
        className={classes.description}
      >
        {description}
      </Text>
    </div>
  );
}
