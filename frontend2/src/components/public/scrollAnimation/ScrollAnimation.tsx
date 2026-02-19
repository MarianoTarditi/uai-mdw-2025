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
  duration = 0.6,
  threshold = 0.1,
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`${classes["scroll-animation"]} ${classes[`scroll-animation-${animation}`]} ${isVisible ? classes["scroll-animation-visible"] : ""}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
}
