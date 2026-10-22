import { NextRequest, NextResponse } from 'next/server';
import {
    executeSettlement,
    ExecuteSettlementParams,
    SettlementExecutionResult,
} from '@/lib/finance/splitSettlementEngine';
import { TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

interface SettlementRequestBody {
    eventId: string;
    baseAmount?: number;
    depositPaid?: number;
    applyIrpf?: boolean;
    irpfRatePercent?: number;
    client: {
        name: string;
        taxId: string;
        email?: string;
    };
    provider: {
        id: string;
        name: string;
        taxId: string;
        stripeAccountId?: string;
    };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = (await req.json()) as Partial<SettlementRequestBody>;

        if (!body.eventId || typeof body.eventId !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Identificador eventId obligatorio requerido.' },
                { status: 400 }
            );
        }

        if (!body.client?.name || !body.client?.taxId) {
            return NextResponse.json(
                { success: false, error: 'Datos del cliente para liquidación incompletos (name, taxId requeridos).' },
                { status: 400 }
            );
        }

        if (!body.provider?.id || !body.provider?.name || !body.provider?.taxId) {
            return NextResponse.json(
                { success: false, error: 'Datos del proveedor para liquidación incompletos (id, name, taxId requeridos).' },
                { status: 400 }
            );
        }

        const params: ExecuteSettlementParams = {
            eventId: body.eventId,
            baseAmount: typeof body.baseAmount === 'number' && body.baseAmount > 0
                ? body.baseAmount
                : TARIFA_BASE_SOLISTA_EUR,
            depositPaid: typeof body.depositPaid === 'number' && body.depositPaid >= 0
                ? body.depositPaid
                : DEPOSITO_STRIPE_EUR,
            applyIrpf: Boolean(body.applyIrpf),
            irpfRatePercent: typeof body.irpfRatePercent === 'number' ? body.irpfRatePercent : undefined,
            client: {
                name: body.client.name,
                taxId: body.client.taxId,
                email: body.client.email,
            },
            provider: {
                id: body.provider.id,
                name: body.provider.name,
                taxId: body.provider.taxId,
                stripeAccountId: body.provider.stripeAccountId,
            },
        };

        const settlement: SettlementExecutionResult = executeSettlement(params);

        return NextResponse.json({
            success: true,
            settlement,
            artistPayoutEur: settlement.breakdown.finalArtistNetPayoutEur,
            vimumeDonationEur: settlement.breakdown.vimumeDonationEur,
            modelo182Hash: settlement.modelo182Certificate.sha256Hash,
        });
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido al liquidar el evento';
        return NextResponse.json(
            { success: false, error: errorMsg },
            { status: 500 }
        );
    }
}
