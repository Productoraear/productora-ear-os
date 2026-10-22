import { NextRequest, NextResponse } from 'next/server';
import {
    generateSmartContract,
    GenerateContractParams,
    SmartContractDocument,
} from '@/lib/contracts/smartContractEngine';
import { TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

interface GenerateContractRequestBody {
    requestId: string;
    client: {
        name: string;
        taxId?: string;
        email: string;
        phone: string;
        address?: string;
    };
    provider: {
        id: string;
        name: string;
        taxId?: string;
        email: string;
        phone: string;
        address?: string;
        stageName?: string;
    };
    eventDetails: {
        date: string;
        startTime?: string;
        durationHours?: number;
        location: string;
        city: string;
        province?: string;
        venueName?: string;
        estimatedPax?: number;
    };
    baseAmount?: number;
    depositPaid?: number;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = (await req.json()) as Partial<GenerateContractRequestBody>;

        if (!body.requestId || typeof body.requestId !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Identificador requestId obligatorio y válido requerido.' },
                { status: 400 }
            );
        }

        if (!body.client?.name || !body.client?.email || !body.client?.phone) {
            return NextResponse.json(
                { success: false, error: 'Datos de cliente incompletos (name, email, phone requeridos).' },
                { status: 400 }
            );
        }

        if (!body.provider?.id || !body.provider?.name || !body.provider?.email) {
            return NextResponse.json(
                { success: false, error: 'Datos de proveedor incompletos (id, name, email requeridos).' },
                { status: 400 }
            );
        }

        if (!body.eventDetails?.date || !body.eventDetails?.location || !body.eventDetails?.city) {
            return NextResponse.json(
                { success: false, error: 'Detalles del evento incompletos (date, location, city requeridos).' },
                { status: 400 }
            );
        }

        const params: GenerateContractParams = {
            requestId: body.requestId,
            client: {
                name: body.client.name,
                taxId: body.client.taxId,
                email: body.client.email,
                phone: body.client.phone,
                address: body.client.address,
            },
            provider: {
                id: body.provider.id,
                name: body.provider.name,
                taxId: body.provider.taxId,
                email: body.provider.email,
                phone: body.provider.phone,
                address: body.provider.address,
                stageName: body.provider.stageName,
            },
            eventDetails: {
                date: body.eventDetails.date,
                startTime: body.eventDetails.startTime,
                durationHours: body.eventDetails.durationHours,
                location: body.eventDetails.location,
                city: body.eventDetails.city,
                province: body.eventDetails.province,
                venueName: body.eventDetails.venueName,
                estimatedPax: body.eventDetails.estimatedPax,
            },
            baseAmount: typeof body.baseAmount === 'number' && body.baseAmount > 0
                ? body.baseAmount
                : TARIFA_BASE_SOLISTA_EUR,
            depositPaid: typeof body.depositPaid === 'number' && body.depositPaid >= 0
                ? body.depositPaid
                : DEPOSITO_STRIPE_EUR,
        };

        const contract: SmartContractDocument = generateSmartContract(params);

        return NextResponse.json({
            success: true,
            contract,
            sha256Hash: contract.sha256Hash,
            depositDeductedEur: contract.financials.depositDeducted,
            remainingToPayEur: contract.financials.remainingToPay,
        });
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Error desconocido al generar contrato';
        return NextResponse.json(
            { success: false, error: errorMsg },
            { status: 500 }
        );
    }
}
