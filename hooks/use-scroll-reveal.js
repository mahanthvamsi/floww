"use client";
import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to a container ref and adds
 * the "visible" class to all children that have a reveal class
 * (fade-up, fade-in, slide-left, stat-value, section-line).
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll(
      ".fade-up, .fade-in, .slide-left, .stat-value, .section-line"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}