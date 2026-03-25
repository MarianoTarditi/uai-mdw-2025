import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { useState, useRef, useEffect, useCallback } from "react";
import { Image } from "@mantine/core";
import type { EmblaCarouselType } from "embla-carousel";

interface MediaItem {
  src: string;
  alt: string;
  type?: "video" | "image";
}

interface CarruselProps {
  media: MediaItem[];
}

const CarouselVideo = ({
  src,
  isActive,
  onEnded,
}: {
  src: string;
  isActive: boolean;
  onEnded: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0; 
        videoRef.current
          .play()
          .catch((e) => console.log("Autoplay prevenido", e));
      } else {
        videoRef.current.pause(); 
      }
    }
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      src={isActive ? src : undefined}
      preload="metadata"
      muted
      playsInline
      onEnded={onEnded}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
};

export function Carrusel({ media }: CarruselProps) {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isVideo = (src: string) => {
    return (
      src.toLowerCase().endsWith(".mp4") || src.toLowerCase().endsWith(".webm")
    );
  };

  const goToNextSlide = useCallback(() => {
    if (embla) {
      if (embla.canScrollNext()) {
        embla.scrollNext();
      } else {
        embla.scrollTo(0);
      }
    }
  }, [embla]);

  useEffect(() => {
    if (!embla || media.length === 0) return;

    const currentMedia = media[currentSlide];
    const isCurrentVideo =
      currentMedia.type === "video" || isVideo(currentMedia.src);

    if (imageTimerRef.current) {
      clearTimeout(imageTimerRef.current);
    }

    if (!isCurrentVideo) {
      imageTimerRef.current = setTimeout(() => {
        goToNextSlide();
      }, 4000);
    }

    return () => {
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    };
  }, [currentSlide, embla, goToNextSlide, media]);

  return (
    <div
      style={{ maxWidth: 350, height: 600, margin: "0 auto", width: "100%" }}
    >
      <Carousel
        getEmblaApi={setEmbla}
        onSlideChange={(index) => setCurrentSlide(index)}
        emblaOptions={{ loop: true }}
        withIndicators
        height="100%"
        styles={{
          root: {
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          },
          control: {
            color: "black",
            backgroundColor: "white",
            top: "50%",
          },
        }}
      >
        {media.map((item, index) => {
          const isItemVideo = item.type === "video" || isVideo(item.src);

          return (
            <Carousel.Slide key={index}>
              {isItemVideo ? (
                <CarouselVideo
                  src={item.src}
                  isActive={currentSlide === index}
                  onEnded={goToNextSlide}
                />
              ) : (
                <Image
                  src={item.src}
                  alt={item.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
}
