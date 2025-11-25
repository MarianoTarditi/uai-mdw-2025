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
        style={{ margin: "0 auto" }} 
        styles={{
          control: {
            color: "black", 
            backgroundColor: "white", 
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          },
          indicator: {
            backgroundColor: "white", 
          },
        }}
      >
        <Carousel.Slide>
          <Image src="/images/gym1.jpeg" height={400} alt="Slide 1" />
        </Carousel.Slide>

        <Carousel.Slide>
          <Image src="/images/photoGym.jfif" height={400} alt="Slide 2" />
        </Carousel.Slide>

        <Carousel.Slide>
          <Image src="/images/gym2.jpg" height={400} alt="Slide 3" />
        </Carousel.Slide>
      </Carousel>
    </div>
  );
}
