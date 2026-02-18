import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import {
  ActionIcon,
  Container,
  Group,
  Text,
  Divider,
  Stack,
} from "@mantine/core";
import classes from "./Footer.module.css";
import { siteConfig } from "../config/siteConfig";

export function Footer() {
  const whatsappUrl = `https://wa.me/${siteConfig.social.whatsapp}`;

  return (
    <footer className={classes.footer} role="contentinfo">
      <Container className={classes.inner} size="xl">
        <div className={classes.content}>
          <Stack gap="xs" className={classes.brandSection}>
            <Text
              fw={800}
              size="xl"
              className={classes.brandName}
              component="h2"
            >
              {siteConfig.trainer.name.toUpperCase()}
            </Text>
            <Text size="sm" className={classes.tagline}>
              Entrenamiento personalizado de fuerza
            </Text>
          </Stack>

          <Divider orientation="vertical" className={classes.divider} />

          <Stack gap="md" className={classes.socialSection}>
            <Text size="sm" fw={600} className={classes.socialTitle}>
              Seguíme en redes
            </Text>
            <Group gap="sm" className={classes.links}>
              {siteConfig.social.instagram && (
                <ActionIcon
                  size="xl"
                  variant="light"
                  component="a"
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguíme en Instagram"
                  className={classes.socialIcon}
                  data-social="instagram"
                >
                  <IconBrandInstagram size={22} stroke={2} />
                </ActionIcon>
              )}

              {siteConfig.social.whatsapp && (
                <ActionIcon
                  size="xl"
                  variant="light"
                  component="a"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactáme por WhatsApp"
                  className={classes.socialIcon}
                  data-social="whatsapp"
                >
                  <IconBrandWhatsapp size={22} stroke={2} />
                </ActionIcon>
              )}
            </Group>
          </Stack>
        </div>

        <Divider className={classes.bottomDivider} />

        <div className={classes.copyright}>
          <Text size="sm" className={classes.copyrightText}>
            © {new Date().getFullYear()} {siteConfig.trainer.name}. Todos los
            derechos reservados.
          </Text>
        </div>
      </Container>
    </footer>
  );
}
