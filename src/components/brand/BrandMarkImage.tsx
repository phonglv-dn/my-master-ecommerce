"use client";

import { useState } from "react";

interface Props {
  primarySrc: string;
  fallbackSrc: string;
  size: number;
  className?: string;
  alt: string;
  brandName: string;
}

type Stage = "primary" | "fallback" | "text";

export default function BrandMarkImage({
  primarySrc,
  fallbackSrc,
  size,
  className,
  alt,
  brandName,
}: Props) {
  const [stage, setStage] = useState<Stage>("primary");

  const handleError = () => {
    if (stage === "primary" && primarySrc !== fallbackSrc) {
      setStage("fallback");
    } else {
      setStage("text");
    }
  };

  if (stage === "text") {
    return (
      <span
        className={className}
        style={{
          fontSize: Math.max(10, size * 0.45),
          fontWeight: 800,
          letterSpacing: "0.05em",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }}
        aria-label={alt}
      >
        {brandName}
      </span>
    );
  }

  const src = stage === "primary" ? primarySrc : fallbackSrc;

  // Plain <img> rather than next/image: SVG is already vector (no size to
  // optimize) and avoiding next/image lets us serve admin-uploaded SVGs
  // without enabling dangerouslyAllowSVG in next.config.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
      onError={handleError}
    />
  );
}
