import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { Image } from "@mantine/core";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export function Carrusel() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return (
    <div style={{ height: 400 }}>
      <Carousel
        withIndicators
        height="100%"
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={() => autoplay.current.play()}
        styles={{
          root: {
            position: "relative",
          },
          control: {
            color: "black",
            backgroundColor: "white",
            borderRadius: "50%",
            width: 36,
            height: 36,
            top: "50%",
            transform: "translateY(-200%)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.8)",
            },
          },
          indicator: {
            backgroundColor: "white",
          },
        }}
      >
        <Carousel.Slide>
          <Image
            src="/images/gym1.jpeg"
            h="100%"
            fit="cover"
            alt="Slide 1"
          />
        </Carousel.Slide>

        <Carousel.Slide>
          <Image
            src="/images/photoGym.jpeg"
            h="100%"
            fit="cover"
            alt="Slide 2"
          />
        </Carousel.Slide>

        <Carousel.Slide>
          <Image
            src="/images/sentadilla-con-barra.jpg"
            h="100%"
            fit="cover"
            alt="Slide 3"
          />
        </Carousel.Slide>
      </Carousel>
    </div>
  );
}
