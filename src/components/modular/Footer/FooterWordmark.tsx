"use client";

import { useEffect, useRef, useState } from "react";

export default function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex-1 w-full md:w-auto flex justify-end"
    >
      <div className="relative inline-flex items-start">
        {/* Anchored black square — sits on top-left corner of the wordmark */}
        <div
          className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-black"
          aria-hidden
        />
        <span
          className={`sblvk-wordmark font-black text-[15vw] leading-[0.8] uppercase select-none ${
            visible ? "is-visible" : ""
          }`}
          aria-label="SBLVK"
        >
          SBLVK
        </span>
      </div>
    </div>
  );
}
