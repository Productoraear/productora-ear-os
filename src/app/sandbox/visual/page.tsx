import Link from "next/link";
import { DEMO_SLUGS, DEMO_META } from "./demo-registry";

export const metadata = {
    title: "Sandbox Visual 3D — EAR OS",
    description:
        "Galería S-Class de demostraciones WebGL: three, @react-three/fiber, @react-three/drei y shadergradient.",
};

const ACCENT = "#ecb613";

export default function VisualSandboxIndexPage() {
    return (
        <main className="min-h-screen bg-[#030305] px-6 py-16 text-white w-full overflow-x-hidden">
            <div className="mx-auto max-w-6xl">
                <header className="mb-14 border-b border-white/10 pb-8">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                        Sandbox WebGL · S-Class
                    </p>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                        Motor Visual{" "}
                        <span className="text-ear-gold">Tridimensional</span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm text-gray-400">
                        Doce demostraciones vivas construidas con{" "}
                        <code className="text-cyan-300">three</code>,{" "}
                        <code className="text-cyan-300">@react-three/fiber</code>,{" "}
                        <code className="text-cyan-300">@react-three/drei</code> y{" "}
                        <code className="text-cyan-300">shadergradient</code>.
                        Estética OLED profundo con acentos oro, rubí y cian.
                    </p>
                </header>

                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {DEMO_SLUGS.map((slug) => {
                        const meta = DEMO_META[slug];
                        return (
                            <li key={slug}>
                                <Link
                                    href={`/sandbox/visual/${slug}`}
                                    className="group flex h-full flex-col rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ear-gold/50"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="text-2xl">◈</span>
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-widest"
                                            style={{ color: ACCENT }}
                                        >
                                            {meta.packages.length} motor
                                            {meta.packages.length > 1 ? "es" : ""}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-black leading-tight text-white group-hover:text-ear-gold transition-colors duration-300">
                                        {meta.title}
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-400">{meta.description}</p>
                                    <div className="mt-auto pt-5">
                                        <span className="font-mono text-xs text-cyan-300">
                                            /sandbox/visual/{slug}
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </main>
    );
}