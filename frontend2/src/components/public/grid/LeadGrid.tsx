import { Container, Grid, SimpleGrid, Skeleton } from "@mantine/core";
import { type ReactNode } from "react";

const PRIMARY_COL_HEIGHT = "400px";

interface LeadGridProps {
  children?: ReactNode;
}

export function LeadGrid({ children }: LeadGridProps) {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <Container size="xl" style={{ height: 500 }}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <div
          style={{
            height: PRIMARY_COL_HEIGHT,
            width: "100%",
            borderRadius: "var(--mantine-radius-md)",
            overflow: "hidden",
          }}
        >
          {children}
        </div>

        <Grid gutter="md">
          <Grid.Col>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
            />
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
}
