import TinderMatcherClient from "@/components/pricing/TinderMatcherClient";

export const metadata = {
  title: "Artistas y Formatos Matcher | Productora EAR",
  description: "Encuentra el ensamble artístico perfecto según aforo, acústica y formato para tu evento o celebración municipal."
};

export default function MatcherPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <TinderMatcherClient />
      </div>
    </main>
  );
}
