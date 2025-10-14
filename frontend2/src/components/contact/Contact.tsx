import {
  ActionIcon,
  Button,
  Container,
  Group,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
  useComputedColorScheme,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { ContactIconsList } from "./ContactIcons";
import classes from "./Contact.module.css";

const social = [IconBrandTwitter, IconBrandYoutube, IconBrandInstagram];

export function Contact() {
  const colorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const isLight = colorScheme === "light";

  const icons = social.map((Icon, index) => (
    <ActionIcon
      key={index}
      size={28}
      className={classes.social}
      variant="transparent"
    >
      <Icon size={22} stroke={1.5} />
    </ActionIcon>
  ));

  return (
    <Container size="xl">
      <div
        style={{
          margin: "0",
          padding: "0",
        }}
      >
        <div
          className={classes.wrapper}
          style={{
            backgroundImage: isLight
              ? "linear-gradient(-60deg, #5fadff 0%, #081024 80%)"
              : "linear-gradient(-60deg, #1A1B1E 0%, #000000 80%)",
            borderRadius: "12px",
            transition:
              "background-color 0.3s ease, background-image 0.3s ease",
          }}
        >
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={50}>
            {/* Columna izquierda */}
            <div>
              <Title className={classes.title}>Contact us</Title>
              <Text className={classes.description} mt="sm" mb={30}>
                Leave your email and we will get back to you within 24 hours
              </Text>

              <ContactIconsList />
              <Group mt="xl">{icons}</Group>
            </div>

            {/* Columna derecha (formulario) */}
            <div
              className={classes.form}
              style={{
                backgroundColor: isLight ? "#ffffff" : "#1E1F22",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                transition: "background-color 0.3s ease, color 0.3s ease",
              }}
            >
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                radius="md"
                classNames={{ input: classes.input, label: classes.inputLabel }}
              />
              <TextInput
                label="Name"
                placeholder="John Doe"
                mt="md"
                radius="md"
                classNames={{ input: classes.input, label: classes.inputLabel }}
              />
              <Textarea
                required
                label="Your message"
                placeholder="I want to order your goods"
                minRows={4}
                mt="md"
                radius="md"
                classNames={{ input: classes.input, label: classes.inputLabel }}
              />

              <Group justify="flex-end" mt="md">
                <Button className={classes.control} radius="md">
                  Send message
                </Button>
              </Group>
            </div>
          </SimpleGrid>
        </div>
      </div>
    </Container>
  );
}
