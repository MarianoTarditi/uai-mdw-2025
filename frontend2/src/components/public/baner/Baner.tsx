import { Marquee } from "@gfazioli/mantine-marquee";
import {
  IconBarbell, 
  IconRun, 
  IconBottle, 
  IconHeartRateMonitor, 
  IconScale, 
  IconShoe, 
  IconTrophy, 
  IconStopwatch, 
  IconActivity, 
} from "@tabler/icons-react";
import "@gfazioli/mantine-marquee/styles.css";
import "@gfazioli/mantine-marquee/styles.layer.css";
import { ThemeIcon, useMantineColorScheme } from "@mantine/core";
import { type ReactNode, type ComponentPropsWithoutRef } from "react";

export function Baner() {
  const { colorScheme } = useMantineColorScheme();

  const iconStyle = {
    width: "50%",
    height: "50%",
    color:
      colorScheme === "dark"
        ? "var(--mantine-color-gray-0)"
        : "var(--mantine-color-gray-9)",
  };

  const iconsGym = [
    <IconBarbell style={iconStyle} stroke={1.5} key="barbell" />,
    <IconRun style={iconStyle} stroke={1.5} key="run" />,
    <IconHeartRateMonitor style={iconStyle} stroke={1.5} key="heart" />,
    <IconBottle style={iconStyle} stroke={1.5} key="bottle" />,
    <IconStopwatch style={iconStyle} stroke={1.5} key="stopwatch" />,
    <IconScale style={iconStyle} stroke={1.5} key="scale" />,
    <IconShoe style={iconStyle} stroke={1.5} key="shoe" />,
    <IconTrophy style={iconStyle} stroke={1.5} key="trophy" />,
    <IconActivity style={iconStyle} stroke={1.5} key="activity" />,
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
        marginTop: 40,
        marginBottom: 40,
        background: "transparent",
      }}
    >
      <Marquee w={792} pauseOnHover fadeEdges>
        {iconsGym.map((icon, index) => (
          <BoxComponent key={index}>{icon}</BoxComponent>
        ))}
      </Marquee>
    </div>
  );
}
