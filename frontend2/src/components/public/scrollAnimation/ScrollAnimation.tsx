import { useEffect, useRef, useState, type ReactNode } from "react";
import classes from "./ScrollAnimation.module.css";

interface ScrollAnimationProps {
  children: ReactNode;
  animation?:
    | "fadeIn"
    | "fadeInUp"
    | "fadeInDown"
    | "fadeInLeft"
    | "fadeInRight"
    | "slideUp"
    | "scaleIn";
  delay?: number;
  duration?: number;
  threshold?: number;
}

export function ScrollAnimation({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = 0.72,
  threshold = 0.1,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = elementRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`${classes["scroll-animation"]} ${classes[`scroll-animation-${animation}`]} ${isVisible ? classes["scroll-animation-visible"] : ""}`}
      style={{
        ["--scroll-animation-delay" as string]: `${delay}s`,
        ["--scroll-animation-duration" as string]: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
