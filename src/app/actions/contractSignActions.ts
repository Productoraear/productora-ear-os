'use server';

import { DigitalSignatureEngine, SignerPayload, DigitalContractSignature } from '@/features/contracts/engine/DigitalSignatureEngine';
import { prisma } from '@/lib/prisma';

export interface SignContractResult {
  success: boolean;
  signature?: DigitalContractSignature;
  signedPdfUrl?: string;
  signatureToken?: string;
  error?: string;
}

export async function signContractAction(payload: SignerPayload): Promise<SignContractResult> {
  try {
    if (!payload.name || !payload.nifCif || !payload.email || !payload.quoteHash) {
      return { success: false, error: 'Faltan campos obligatorios para la firma (Nombre, NIF/CIF, Email o Hash del Presupuesto).' };
    }

    const signature = DigitalSignatureEngine.generateSignature(payload);

    // Intentar persistir en Base de Datos (con fallback)
    try {
      if (prisma.smartContract) {
        await prisma.smartContract.create({
          data: {
            title: `Contrato Formalizado - ${signature.contractDetails.serviceName}`,
            deposit: signature.contractDetails.totalAmount,
            contractTerms: signature.contractDetails.legalFramework,
            signedAt: new Date(signature.signedAtMs),
            status: 'SIGNED_AND_SEALED',
            stripeSessionId: signature.signatureId,
          }
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ [CONTRACT_SIGN] Fallback de persistencia en BD:', dbErr);
    }

    const signatureToken = Buffer.from(JSON.stringify({
      sigId: signature.signatureId,
      hash: signature.verificationHash,
      signer: signature.signer.name,
      nif: signature.signer.nifCif,
      date: signature.signedAt,
      seal: signature.certificateSeal
    })).toString('base64url');

    const signedPdfUrl = `/api/dossier/pdf?service=${encodeURIComponent(signature.contractDetails.serviceName)}&location=${encodeURIComponent(signature.signer.entityName || 'Madrid')}&total=${signature.contractDetails.totalAmount}&signed=true&signer=${encodeURIComponent(signature.signer.name)}&sigId=${encodeURIComponent(signature.signatureId)}&sigDate=${encodeURIComponent(signature.signedAt)}&b2g=${signature.contractDetails.isB2G ? 'true' : 'false'}`;

    return {
      success: true,
      signature,
      signedPdfUrl,
      signatureToken,
    };
  } catch (error: any) {
    console.error('❌ [SIGN_CONTRACT_ACTION_ERROR]:', error);
    return { success: false, error: error.message || 'Error al procesar la firma digital' };
  }
}
