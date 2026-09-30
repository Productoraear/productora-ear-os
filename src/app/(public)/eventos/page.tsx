import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos | EAR",
  description: "Agenda de eventos de Productora EAR.",
};

export default function EventosPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030305",
        color: "#f4f4f5",
        padding: "48px 24px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "48px", lineHeight: 1.1 }}>
        Eventos
      </h1>
      <p style={{ maxWidth: 720, marginTop: 16, marginBottom: 0, lineHeight: 1.6 }}>
        Agenda de eventos de Productora EAR.
      </p>
    </main>
  );
}