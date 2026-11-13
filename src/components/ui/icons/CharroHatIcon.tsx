import React from "react";

interface Props {
  className?: string;
  size?: number;
}

export default function CharroHatIcon({ className = "text-amber-400", size = 20 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="[suspicious link removed]"
      className={className}
      aria-label="Sombrero Charro de Gala Tradicional"
    >
      {/* Copa Alta Cónica con Hendiduras / Cuatro Pedradas */}
      <path
        d="M23 37C23.5 24 25.5 13 32 12C38.5 13 40.5 24 41 37H23Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M29 13.5C31 15 33 15 35 13.5C33.5 12.2 30.5 12.2 29 13.5Z"
        fill="#000000"
        fillOpacity="0.4"
      />
      {/* Toquilla Bordada de Gala Charra */}
      <path
        d="M22.5 35.5C25.5 34.5 38.5 34.5 41.5 35.5L42 38H22L22.5 35.5Z"
        fill="#F59E0B"
      />
      <circle cx="32" cy="36.5" r="1.2" fill="#FFFFFF" />
      <circle cx="27" cy="36.5" r="0.9" fill="#FFFFFF" />
      <circle cx="37" cy="36.5" r="0.9" fill="#FFFFFF" />

      {/* Falda Ancha Alabeada Tradicional */}
      <path
        d="M4 42C12 37.5 22 37 32 37C42 37 52 37.5 60 42C62 43.2 59 46.5 52 46.5C38 46.5 26 46.5 12 46.5C5 46.5 2 43.2 4 42Z"
        fill="currentColor"
      />
      <path
        d="M6 42.5C14 38.5 50 38.5 58 42.5C55 44.5 45 45.2 32 45.2C19 45.2 9 44.5 6 42.5Z"
        stroke="#F59E0B"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}