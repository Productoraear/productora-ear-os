import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MariachiJoinNetwork from '@/components/mariachi/MariachiJoinNetwork';
import { isInvitationCode } from '@/lib/mariachi/network-outreach';

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

interface JoinPageProps {
    searchParams: Promise<{ prov?: string; inv?: string }>;
}

/**
 * Nombre de provincia: letras (con acentos), espacios, puntos, apóstrofos y
 * guiones. Cualquier otra cosa se descarta antes de tocar el formulario.
 */
const PROVINCE_PATTERN = /^[\p{L}][\p{L}\s.'-]{0,39}$/u;

function sanitizeProvince(raw: string | undefined): string {
    if (!raw) {
        return '';
    }
    const candidate = raw.trim();
    return PROVINCE_PATTERN.test(candidate) ? candidate : '';
}

export const metadata: Metadata = {
    title: 'Alta de agrupaciones de mariachi · 0 € de cuota fija',
    description:
        'Registra tu agrupación de mariachi: sin alta, sin mensualidad y sin coste por contacto. Solo compartes el 10 % de infraestructura cuando el bolo se cobra y el depósito de 100 € es deducible para el cliente.',
    alternates: { canonical: `${BASE_URL}/mariachis/unirse` },
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: `${BASE_URL}/mariachis/unirse`,
        siteName: 'Productora EAR',
        title: 'Alta de agrupaciones de mariachi · 0 € de cuota fija',
        description:
            'Plaza de red sin cuota mensual: el grupo cobra el 80 % de cada bolo y la centralita solo factura cuando hay evento cobrado.',
    },
};

export default async function MariachiJoinPage({
    searchParams,
}: JoinPageProps) {
    const { prov, inv } = await searchParams;
    const defaultProvince = sanitizeProvince(prov);
    const invitationCode =
        inv && isInvitationCode(inv) ? inv.toUpperCase() : null;

    return (
        <main className="w-full min-h-screen overflow-x-hidden bg-[#030305] px-6 py-24 text-white selection:bg-[#ecb613] selection:text-black">
            <div className="mx-auto max-w-7xl space-y-8">
                <Link
                    href="/mariachis"
                    className="inline-flex items-center gap-2 font-mono text-xs text-white/50 transition-colors hover:text-white"
                >
                    <ArrowLeft size={14} aria-hidden="true" />
                    Volver al Contratador de Mariachis
                </Link>

                <MariachiJoinNetwork
                    defaultProvince={defaultProvince}
                    invitationCode={invitationCode}
                />
            </div>
        </main>
    );
}
