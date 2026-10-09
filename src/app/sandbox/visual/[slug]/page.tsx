import { notFound } from "next/navigation";
import VisualDemo from "../demos";
import { DEMO_META, DEMO_SLUGS } from "../demo-registry";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function VisualDemoPage({ params }: PageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const validSlugs: readonly string[] = DEMO_SLUGS;
    if (!validSlugs.includes(slug)) {
        notFound();
    }

    const meta = DEMO_META[slug as keyof typeof DEMO_META];

    return (
        <main className="min-h-screen bg-[#030305] px-6 py-14 text-white w-full overflow-x-hidden">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8">
                    <a
                        href="/sandbox/visual"
                        className="mb-6 inline-block text-xs font-bold uppercase tracking-widest text-cyan-300 transition-colors hover:text-cyan-200"
                    >
                        ← Galería Visual
                    </a>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                        {meta.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-gray-400">{meta.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {meta.packages.map((pkg) => (
                            <span
                                key={pkg}
                                className="rounded-full border border-white/10 bg-[#09090d]/80 px-3 py-1 font-mono text-xs text-ear-gold"
                            >
                                {pkg}
                            </span>
                        ))}
                    </div>
                </header>

                <VisualDemo slug={slug as (typeof DEMO_SLUGS)[number]} />

                <footer className="mt-8 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-mono">/sandbox/visual/{slug}</span>
                    <span className="text-cyan-300">WebGL · OLED Premium</span>
                </footer>
            </div>
        </main>
    );
}