/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE RECLAMACIÓN DE FICHAS (CLAIM STATE MACHINE)
 * ════════════════════════════════════════════════════════════════════════════
 * Máquina de estados finita (FSM) para la reclamación soberana de una ficha
 * (VendorShadowProfile) por parte de su titular legítimo.
 *
 * Estados canónicos (alineados con `ClaimStatus` de Prisma):
 *   GHOST_UNCLAIMED → CLAIM_INITIATED → DOCUMENTS_SUBMITTED → ACTIVE_VERIFIED
 *   (cualquier estado puede derivar a REJECTED ante acreditación insuficiente)
 *
 * Garantías S-CLASS:
 *   - Transiciones estrictamente validadas (sin saltos ilegales).
 *   - Emisión de JWT de verificación firmado con `JWT_SECRET`.
 *   - Al alcanzar ACTIVE_VERIFIED se emite evento asíncrono a n8n para el
 *     email de bienvenida (fire-and-forget con AbortController timeout).
 *   - Cero `any` implícitos, tipado de cirujano.
 * ════════════════════════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import { ClaimStatus } from '@prisma/client';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de dominio
// ─────────────────────────────────────────────────────────────────────────────

export type ClaimMachineState =
    | 'GHOST_UNCLAIMED'
    | 'CLAIM_INITIATED'
    | 'DOCUMENTS_SUBMITTED'
    | 'ACTIVE_VERIFIED'
    | 'REJECTED';

export type ClaimTransitionEvent =
    | 'CLAIM_STARTED'
    | 'DOCUMENTS_RECEIVED'
    | 'VERIFICATION_APPROVED'
    | 'VERIFICATION_REJECTED';

export interface ClaimContext {
    claimId: string;
    profileName: string;
    providerEmail: string;
    ownerName: string;
    cifNif?: string;
}

export interface ClaimJwtPayload {
    claimId: string;
    profileName: string;
    providerEmail: string;
    state: ClaimMachineState;
    iss: 'EAR_OS_CLAIM_ENGINE';
}

export interface StateTransitionResult {
    success: boolean;
    from: ClaimMachineState;
    to: ClaimMachineState;
    event: ClaimTransitionEvent;
    verificationToken: string | null;
    welcomeEmailDispatched: boolean;
    message: string;
}

interface WelcomeEmailN8nEvent {
    event: 'vendor_claim_verified';
    claimId: string;
    profileName: string;
    providerEmail: string;
    ownerName: string;
    verifiedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constantes SSOT
// ─────────────────────────────────────────────────────────────────────────────

const JWT_ISSUER = 'EAR_OS_CLAIM_ENGINE';
const JWT_EXPIRES_IN = '30d';
const N8N_DISPATCH_TIMEOUT_MS = 4000;

const N8N_VENDOR_WELCOME_WEBHOOK_URL = process.env.N8N_VENDOR_WELCOME_WEBHOOK_URL;

// ─────────────────────────────────────────────────────────────────────────────
// Tabla de transiciones legales (Map inmutable)
// ─────────────────────────────────────────────────────────────────────────────

const TRANSITIONS: ReadonlyMap<ClaimMachineState, ReadonlyMap<ClaimTransitionEvent, ClaimMachineState>> =
    new Map<ClaimMachineState, ReadonlyMap<ClaimTransitionEvent, ClaimMachineState>>([
        [
            'GHOST_UNCLAIMED',
            new Map<ClaimTransitionEvent, ClaimMachineState>([
                ['CLAIM_STARTED', 'CLAIM_INITIATED'],
            ]),
        ],
        [
            'CLAIM_INITIATED',
            new Map<ClaimTransitionEvent, ClaimMachineState>([
                ['DOCUMENTS_RECEIVED', 'DOCUMENTS_SUBMITTED'],
                ['VERIFICATION_REJECTED', 'REJECTED'],
            ]),
        ],
        [
            'DOCUMENTS_SUBMITTED',
            new Map<ClaimTransitionEvent, ClaimMachineState>([
                ['VERIFICATION_APPROVED', 'ACTIVE_VERIFIED'],
                ['VERIFICATION_REJECTED', 'REJECTED'],
            ]),
        ],
        [
            'REJECTED',
            new Map<ClaimTransitionEvent, ClaimMachineState>(),
        ],
        [
            'ACTIVE_VERIFIED',
            new Map<ClaimTransitionEvent, ClaimMachineState>(),
        ],
    ]);

// ─────────────────────────────────────────────────────────────────────────────
// Emisión JWT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Firma un JWT con los claims de reclamación. Devuelve `null` si la variable
 * de entorno `JWT_SECRET` no está disponible (defensa en profundidad).
 */
export function issueClaimVerificationToken(
    context: ClaimContext,
    state: ClaimMachineState
): string | null {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('[claimStateMachine] JWT_SECRET no configurado. No se puede emitir token de verificación.');
        return null;
    }

    const payload: ClaimJwtPayload = {
        claimId: context.claimId,
        profileName: context.profileName,
        providerEmail: context.providerEmail,
        state,
        iss: JWT_ISSUER,
    };

    return jwt.sign(payload, secret, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: JWT_ISSUER,
    });
}

/**
 * Verifica la integridad y autenticidad de un token de reclamación emitido
 * por el motor. Devuelve el payload tipado o `null` si es inválido/expirado.
 */
export function verifyClaimToken(token: string): ClaimJwtPayload | null {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('[claimStateMachine] JWT_SECRET no configurado. No se puede verificar token.');
        return null;
    }

    try {
        const decoded = jwt.verify(token, secret, { issuer: JWT_ISSUER });
        if (typeof decoded === 'string' || decoded.iss !== JWT_ISSUER || !decoded.claimId) {
            return null;
        }

        return {
            claimId: decoded.claimId as string,
            profileName: decoded.profileName as string,
            providerEmail: decoded.providerEmail as string,
            state: decoded.state as ClaimMachineState,
            iss: decoded.iss as 'EAR_OS_CLAIM_ENGINE',
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Despacho asíncrono a n8n (email de bienvenida)
// ─────────────────────────────────────────────────────────────────────────────

function dispatchWelcomeEmailToN8n(event: WelcomeEmailN8nEvent): boolean {
    if (!N8N_VENDOR_WELCOME_WEBHOOK_URL) {
        console.warn('[claimStateMachine] N8N_VENDOR_WELCOME_WEBHOOK_URL no configurado. Omitiendo email de bienvenida.');
        return false;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), N8N_DISPATCH_TIMEOUT_MS);

    void (async () => {
        try {
            const res = await fetch(N8N_VENDOR_WELCOME_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
                signal: controller.signal,
            });

            if (!res.ok) {
                console.error(`[claimStateMachine] Webhook n8n no OK (${res.status}) para ${event.claimId}.`);
            } else {
                console.log(`[claimStateMachine] Email de bienvenida despachado para ${event.claimId}.`);
            }
        } catch (err) {
            const reason = err instanceof Error ? err.message : String(err);
            console.error(`[claimStateMachine] Fallo al despachar webhook n8n: ${reason}`);
        } finally {
            clearTimeout(timeout);
        }
    })();

    // Se devuelve `true` porque la entrega es asíncrona; el evento ya fue encolado.
    return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Máquina de estados principal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aplica una transición validada sobre la máquina de estados de reclamación.
 * Si la transición es ilegal devuelve `success: false` sin efectos secundarios.
 * Al alcanzar `ACTIVE_VERIFIED` emite el JWT y dispara el webhook de bienvenida.
 */
export function transitionClaimState(
    currentState: ClaimMachineState,
    event: ClaimTransitionEvent,
    context: ClaimContext
): StateTransitionResult {
    const eventMap = TRANSITIONS.get(currentState);
    const nextState = eventMap?.get(event);

    if (!nextState) {
        return {
            success: false,
            from: currentState,
            to: currentState,
            event,
            verificationToken: null,
            welcomeEmailDispatched: false,
            message: `Transición ilegal: no se puede aplicar '${event}' desde '${currentState}'.`,
        };
    }

    let verificationToken: string | null = null;
    let welcomeEmailDispatched = false;

    if (nextState === 'ACTIVE_VERIFIED') {
        verificationToken = issueClaimVerificationToken(context, nextState);
        welcomeEmailDispatched = dispatchWelcomeEmailToN8n({
            event: 'vendor_claim_verified',
            claimId: context.claimId,
            profileName: context.profileName,
            providerEmail: context.providerEmail,
            ownerName: context.ownerName,
            verifiedAt: new Date().toISOString(),
        });
    }

    return {
        success: true,
        from: currentState,
        to: nextState,
        event,
        verificationToken,
        welcomeEmailDispatched,
        message: `Transición aplicada: ${currentState} → ${nextState} por evento ${event}.`,
    };
}

/**
 * Normaliza el estado persistido por Prisma (`ClaimStatus`) al dominio de la
 * máquina de estados. Cualquier valor fuera de catálogo se trata como
 * `GHOST_UNCLAIMED` por seguridad.
 */
export function mapPrismaClaimStatus(status: ClaimStatus): ClaimMachineState {
    switch (status) {
        case ClaimStatus.GHOST_UNCLAIMED:
            return 'GHOST_UNCLAIMED';
        case ClaimStatus.CLAIMED_PENDING_VERIFICATION:
            return 'DOCUMENTS_SUBMITTED';
        case ClaimStatus.VERIFIED_ACTIVE:
            return 'ACTIVE_VERIFIED';
        default:
            return 'GHOST_UNCLAIMED';
    }
}