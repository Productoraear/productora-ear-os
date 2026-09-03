import type { Metadata } from "next";
import ArtistCinematicProfile from "@/components/artists/ArtistCinematicProfile";

export const metadata: Metadata = {
  title: "Edwin Agudelo & Roster S-Class — Productora EAR",
  description: "Descubre la autoridad técnica y artística del Roster Soberano. Voz, guitarra y acústica perfecta.",
};

export default function ArtistasCinematicPage() {
  return (
    <ArtistCinematicProfile
      name="Edwin Agudelo"
      specialty="Voz, Oficio y Escenario"
      imageUrl="/images/brand/ear_diamante_central.png"
      videoUrl=""
    />
  );
}