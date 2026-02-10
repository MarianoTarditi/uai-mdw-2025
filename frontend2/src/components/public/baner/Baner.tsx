import { Marquee } from '@gfazioli/mantine-marquee';
import {
  IconBrand4chan,
  IconBrandAmazon,
  IconBrandBing,
  IconBrandGithub,
  IconBrandMantine,
  IconBrandWhatsapp,
  IconBrandWordpress,
} from "@tabler/icons-react";
import '@gfazioli/mantine-marquee/styles.css';
import '@gfazioli/mantine-marquee/styles.layer.css';
import { ThemeIcon } from "@mantine/core";
import { type ReactNode, type ComponentPropsWithoutRef } from "react";

export function Baner() {
  const iconsBrand = [
    <IconBrand4chan style={{ width: '50%', height: '70%' }} />,
    <IconBrandWhatsapp style={{ width: '50%', height: '70%' }} />,
    <IconBrandWordpress style={{ width: '50%', height: '70%' }} />,
    <IconBrandBing style={{ width: '70%', height: '70%' }} />,
    <IconBrandGithub style={{ width: '70%', height: '70%' }} />,
    <IconBrandMantine style={{ width: '70%', height: '70%' }} />,
    <IconBrandAmazon style={{ width: '70%', height: '70%' }} />,
  ];

  function BoxComponent({
    children,
    ...props
  }: { children: ReactNode } & ComponentPropsWithoutRef<typeof ThemeIcon>) {
    return (
      <ThemeIcon {...props} variant="transparent" size="120px">
        {children}
      </ThemeIcon>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <Marquee w={792} pauseOnHover fadeEdges>
        {iconsBrand.map((icon, index) => (
          <BoxComponent key={index}>{icon}</BoxComponent>
        ))}
      </Marquee>
    </div>
  );
}
