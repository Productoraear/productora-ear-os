import type { Metadata } from 'next';
import VillaEscorialParkSClassExperience from '@/components/fincas/VillaEscorialParkSClassExperience';

export const metadata: Metadata = {
    title: 'Villa Escorial Park · Mansión & Finca de Lujo S-Class | EAR OS',
    description:
        'Experiencia de reserva S-Class para Villa Escorial Park (San Lorenzo de El Escorial, Madrid). Depósito Price-Lock 100 €, rider acústico Ley 37/2003 y liquidación de alianzas en 3 días.',
};

export default function VillaEscorialParkPage() {
    return (
        <div className="w-full min-h-screen bg-[#030305] overflow-x-hidden">
            <VillaEscorialParkSClassExperience initialTelemetry={null} />
        </div>
    );
}