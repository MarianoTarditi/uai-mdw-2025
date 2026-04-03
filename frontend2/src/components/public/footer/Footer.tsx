import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import {
  ActionIcon,
  Container,
  Divider,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import classes from "./Footer.module.css";
import { siteConfig } from "../config/siteConfig";

const footerLinks = [
  { label: "Inicio", target: "inicio" },
  { label: "Planes", target: "planes" },
  { label: "Instalaciones", target: "instalaciones" },
  { label: "FAQ", target: "faq" },
  { label: "Contacto", target: "contact" },
];

export function Footer() {
  const whatsappUrl = `https://wa.me/${siteConfig.social.whatsapp}`;

  const scrollToSection = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className={classes.footer} role="contentinfo">
      <div className={classes.overlay} />
      <div className={classes.glowTop} aria-hidden="true" />
      <div className={classes.glowBottom} aria-hidden="true" />

      <Container className={classes.inner} size="xl">
        <div className={classes.shell}>
          <div className={classes.content}>
            <Stack gap="xs" className={classes.brandSection}>
              <Text fw={800} size="xl" className={classes.brandName} component="h2">
                {siteConfig.trainer.name.toUpperCase()}
              </Text>
              <Text size="sm" className={classes.tagline}>
                Entrenamiento personalizado de fuerza y reacondicionamiento físico.
              </Text>
            </Stack>

            <Divider orientation="vertical" className={classes.divider} />

            <Stack gap="sm" className={classes.navSection}>
              <Text size="sm" fw={600} className={classes.sectionTitle}>
                Navegación
              </Text>
              <Group gap="xs" className={classes.footerLinks}>
                {footerLinks.map((item) => (
                  <a
                    key={item.target}
                    href={`#${item.target}`}
                    className={classes.footerLink}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.target);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </Group>
            </Stack>

            <Divider orientation="vertical" className={classes.divider} />

            <Stack gap="md" className={classes.socialSection}>
              <Text size="sm" fw={600} className={classes.sectionTitle}>
                Seguime en redes
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
                    aria-label="Seguime en Instagram"
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
                    aria-label="Contactame por WhatsApp"
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
              {new Date().getFullYear()} {siteConfig.trainer.name}. Todos los derechos reservados.
            </Text>
          </div>
        </div>
      </Container>
    </footer>
  );
}
