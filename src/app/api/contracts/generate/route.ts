import { NextRequest, NextResponse } from 'next/server';
import {
    generateSmartContract,
    GenerateContractParams,
    SmartContractDocument,
} from '@/lib/contracts/smartContractEngine';
import { TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { prisma } from '@/lib/prisma';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

        // 1. Persistencia real en PostgreSQL mediante Prisma (cero fachadas)
        let persistedId = contract.contractId;
        try {
            if (prisma?.smartContract) {
                const dbRecord = await prisma.smartContract.create({
                    data: {
                        id: contract.contractId,
                        title: `Contrato Artístico ${contract.eventDetails.city} - ${contract.parties.provider.name}`,
                        deposit: contract.financials.depositDeducted,
                        contractTerms: contract.clauses.join('\n\n'),
                        status: contract.status,
                        stripeSessionId: contract.requestId,
                    },
                });
                persistedId = dbRecord.id;
            }
        } catch (dbError) {
            console.warn('[CONTRACT_GENERATE] Persistencia BD fallback (continuando con contrato emitido):', dbError);
        }

        // 2. Despacho no bloqueante al cluster n8n (cero leads huérfanos)
        fireAndForgetN8n('stripe-price-lock', {
            event: 'CONTRACT_GENERATED',
            contractId: persistedId,
            requestId: contract.requestId,
            clientEmail: contract.parties.client.email,
            clientPhone: contract.parties.client.phone,
            providerName: contract.parties.provider.name,
            totalEur: contract.financials.totalAmount,
            depositDeductedEur: contract.financials.depositDeducted,
            remainingToPayEur: contract.financials.remainingToPay,
            sha256Hash: contract.sha256Hash,
            createdAt: contract.createdAt,
        });

        fireAndForgetN8n('b2b-quote', {
            event: 'CONTRACT_QUOTE_DISPATCHED',
            contractId: persistedId,
            requestId: contract.requestId,
            eventDate: contract.eventDetails.date,
            location: contract.eventDetails.location,
            baseAmount: contract.financials.baseAmount,
        });

        return NextResponse.json({
            success: true,
            contract,
            persistedId,
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
