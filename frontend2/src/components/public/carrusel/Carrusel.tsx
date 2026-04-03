import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import { useState, useRef, useEffect, useCallback } from "react";
import { Image, Text } from "@mantine/core";
import type { EmblaCarouselType } from "embla-carousel";
import classes from "./Carrusel.module.css";

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
        videoRef.current.play().catch((e) => console.log("Autoplay prevenido", e));
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
      className={classes.media}
    />
  );
};

export function Carrusel({ media }: CarruselProps) {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isVideo = (src: string) => {
    return src.toLowerCase().endsWith(".mp4") || src.toLowerCase().endsWith(".webm");
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
    const isCurrentVideo = currentMedia.type === "video" || isVideo(currentMedia.src);

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
    <div className={classes.carouselShell}>
      <Carousel
        getEmblaApi={setEmbla}
        onSlideChange={(index) => setCurrentSlide(index)}
        emblaOptions={{ loop: true }}
        withIndicators
        height={700}
        classNames={{
          root: classes.carousel,
          controls: classes.controls,
          control: classes.control,
          indicators: classes.indicators,
          indicator: classes.indicator,
          viewport: classes.viewport,
          slide: classes.slide,
        }}
      >
        {media.map((item, index) => {
          const isItemVideo = item.type === "video" || isVideo(item.src);

          return (
            <Carousel.Slide key={`${item.src}-${index}`}>
              <div className={classes.mediaFrame}>
                {isItemVideo ? (
                  <CarouselVideo
                    src={item.src}
                    isActive={currentSlide === index}
                    onEnded={goToNextSlide}
                  />
                ) : (
                  <Image src={item.src} alt={item.alt} className={classes.mediaImage} />
                )}
                <div className={classes.mediaOverlay}>
                  <Text className={classes.mediaCounter}>{`${index + 1}/${media.length}`}</Text>
                </div>
              </div>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
}
