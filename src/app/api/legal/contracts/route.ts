import { NextRequest, NextResponse } from 'next/server';
import {
  GenerateContractInputSchema,
  generateBilateralOtpContract,
  verifyContractOtpSignature,
  BilateralContractDocument
} from '@/lib/legal/contracts/bilateral-otp-generator';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONTRACTS_STORE = path.join(process.cwd(), '.antigravity', 'generated_contracts.json');

function readContracts(): Record<string, BilateralContractDocument> {
  try {
    if (fs.existsSync(CONTRACTS_STORE)) {
      return JSON.parse(fs.readFileSync(CONTRACTS_STORE, 'utf8'));
    }
  } catch {
    // fallback
  }
  return {};
}

function saveContracts(store: Record<string, BilateralContractDocument>): void {
  try {
    const dir = path.dirname(CONTRACTS_STORE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CONTRACTS_STORE, JSON.stringify(store, null, 2), 'utf8');
  } catch {
    // fallback
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateContractInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PAYLOAD', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const contract = generateBilateralOtpContract(parsed.data);
    const store = readContracts();
    store[contract.contractId] = contract;
    saveContracts(store);

    return NextResponse.json({ success: true, contract }, { status: 201 });
  } catch (error) {
    console.error('[/api/legal/contracts] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractId, role, otp } = body;

    if (!contractId || !role || !otp) {
      return NextResponse.json(
        { success: false, error: 'MISSING_CONTRACT_OR_OTP' },
        { status: 400 }
      );
    }

    const store = readContracts();
    const contract = store[contractId];

    if (!contract) {
      return NextResponse.json(
        { success: false, error: 'CONTRACT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const result = verifyContractOtpSignature(contract, role, otp);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'INVALID_OTP' },
        { status: 403 }
      );
    }

    store[contractId] = result.updatedContract;
    saveContracts(store);

    return NextResponse.json({ success: true, contract: result.updatedContract }, { status: 200 });
  } catch (error) {
    console.error('[/api/legal/contracts] Error PATCH:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
}
