/**
 * 🛰️ DIVISIÓN 3 · JURÍDICA, B2G & FINANCIERA.
 * ----------------------------------------------------------------------------
 * Reutiliza los motores soberanos existentes (smartContractEngine,
 * splitSettlementEngine, pricing SSOT). Cero duplicación de lógica de dinero.
 */
import { createHash } from 'node:crypto';
import type { AgentBus, AgentHandler, AgentMessage, AgentReply } from './agentBus';
import { dispatchToN8n } from './n8nDispatcher';
import { computeSplit, checkB2gCeiling } from './pricing';
import { DEPOSITO_STRIPE_EUR, CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { generateSmartContract } from '@/lib/contracts/smartContractEngine';
import { calculateSettlementBreakdown, generateModelo182Certificate } from '@/lib/finance/splitSettlementEngine';

/** 1. smart-contract-engine: genera contrato con sello SHA-256 (motor soberano). */
const smartContractEngineHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const requestId = String(msg.payload.requestId ?? `req-${Date.now().toString(36)}`);
  const contract = generateSmartContract({
    requestId,
    client: {
      name: String(msg.payload.clientName ?? 'Cliente'),
      email: String(msg.payload.clientEmail ?? 'cliente@correo.es'),
      phone: String(msg.payload.clientPhone ?? ''),
    },
    provider: {
      id: String(msg.payload.providerId ?? 'prov-edwin'),
      name: String(msg.payload.providerName ?? 'Edwin Agudelo'),
      email: String(msg.payload.providerEmail ?? 'produccion@productoraear.com'),
      phone: CENTRALITA_EAR_OS,
      stageName: 'Edwin Agudelo',
    },
    eventDetails: {
      date: String(msg.payload.eventDate ?? ''),
      city: String(msg.payload.city ?? 'Toledo'),
      location: String(msg.payload.location ?? 'Ubicación del evento'),
      estimatedPax: Number(msg.payload.pax ?? 100),
    },
    baseAmount: Number(msg.payload.baseAmount ?? 350),
    depositPaid: Number(msg.payload.depositPaid ?? DEPOSITO_STRIPE_EUR),
  });

  return {
    ok: true,
    summary: `Contrato ${contract.contractId}: total ${contract.financials.totalAmount} € · depósito ${contract.financials.depositDeducted} € · SHA-256 ${contract.sha256Hash.slice(0, 16)}…`,
  };
};

/** 2. b2g-tender-hunter: vigila y valida licitaciones menores (Art. 118 LCSP). */
const b2gTenderHunterHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const region = String(msg.payload.region ?? 'España');
  const estimatedEur = Number(msg.payload.estimatedEur ?? 0);
  const verdict = checkB2gCeiling(estimatedEur);

  void dispatchToN8n('b2g-tender', {
    region,
    estimatedEur,
    allowed: verdict.allowed,
    margin: verdict.margin,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: verdict.allowed
      ? `Licitación menor en ${region}: ${estimatedEur} € conforme (margen preventivo ${verdict.margin} €).`
      : `Licitación en ${region}: ${estimatedEur} € EXCEDE el techo de ${verdict.ceiling} € (Art. 118 LCSP).`,
  };
};

/** 3. b2g-pliego-compiler: compila pliego con hash de inmutabilidad. */
const b2gPliegoCompilerHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const title = String(msg.payload.title ?? 'Pliego de licitación menor');
  const amountEur = Number(msg.payload.amountEur ?? 0);
  const verdict = checkB2gCeiling(amountEur);
  const split = computeSplit(amountEur);
  const pliegoId = createHash('sha256')
    .update(`${title}:${amountEur}`, 'utf8')
    .digest('hex')
    .slice(0, 12)
    .toUpperCase();

  return {
    ok: true,
    summary: `Pliego ${pliegoId}: ${title} · ${amountEur} € · split ${split.artista}/${split.earOs}/${split.vimume} € · ${
      verdict.allowed ? 'conforme Art. 118 LCSP' : 'requiere licitación abierta'
    }.`,
  };
};

/** 4. split-settlement-dispatcher: liquida el Split Soberano 80/10/10. */
const splitSettlementDispatcherHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const baseAmount = Number(msg.payload.baseAmount ?? 350);
  const breakdown = calculateSettlementBreakdown({
    baseAmount,
    depositPaid: Number(msg.payload.depositPaid ?? DEPOSITO_STRIPE_EUR),
  });
  const cert = generateModelo182Certificate({
    donorName: String(msg.payload.donorName ?? 'Cliente'),
    donorTaxId: String(msg.payload.donorTaxId ?? '00000000T'),
    donationAmount: breakdown.vimumeDonationEur,
  });

  void dispatchToN8n('split-settlement', {
    baseAmount,
    artistNet: breakdown.finalArtistNetPayoutEur,
    earOs: breakdown.earOsFeeEur,
    vimume: breakdown.vimumeDonationEur,
    certId: cert.certificateId,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Liquidación 80/10/10: Artista ${breakdown.finalArtistNetPayoutEur} € · EAR OS ${breakdown.earOsFeeEur} € · VIMUME ${breakdown.vimumeDonationEur} € · Certificado ${cert.certificateId}.`,
  };
};

/** 5. modelo-182-tax-shield: escudo fiscal Ley 49/2002 (Modelo 182 AEAT). */
const modelo182TaxShieldHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const donorName = String(msg.payload.donorName ?? 'Donante');
  const donorTaxId = String(msg.payload.donorTaxId ?? '00000000T');
  const donation = Number(msg.payload.donationAmount ?? 0);
  const cert = generateModelo182Certificate({ donorName, donorTaxId, donationAmount: donation });

  return {
    ok: true,
    summary: `Escudo fiscal Modelo 182: deducción ${cert.deductionRatePercent}% → ${cert.potentialTaxDeductionEur} € (${donation} € donados).`,
  };
};

/** 6. invoice-treasury-agent: tesorería y estado de cobro con IVA. */
const invoiceTreasuryAgentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const baseAmount = Number(msg.payload.baseAmount ?? 350);
  const breakdown = calculateSettlementBreakdown({
    baseAmount,
    depositPaid: Number(msg.payload.depositPaid ?? DEPOSITO_STRIPE_EUR),
  });

  void dispatchToN8n('invoice-treasury', {
    baseAmount,
    vat: breakdown.vatAmountEur,
    total: breakdown.totalGrossEur,
    remaining: breakdown.remainingToCollectEur,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Tesorería: base ${breakdown.baseGrossEur} € + IVA ${breakdown.vatAmountEur} € = ${breakdown.totalGrossEur} € · pendiente ${breakdown.remainingToCollectEur} €.`,
  };
};

/** 7. vendor-compliance-auditor: auditoría de datos verificados del proveedor. */
const vendorComplianceAuditorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const vendorName = String(msg.payload.vendorName ?? 'Proveedor');
  const phone = String(msg.payload.phone ?? '');
  const normalized = phone.replace(/[^0-9]/g, '');
  const isCentralita = normalized === '' || normalized === '693693048' || normalized === '34693693048';
  const verified = !isCentralita;
  const hasTaxId = String(msg.payload.taxId ?? '').trim() !== '';
  const compliant = verified && hasTaxId;

  void dispatchToN8n('vendor-compliance', {
    vendorName,
    verified,
    hasTaxId,
    compliant,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Auditoría de ${vendorName}: ${verified ? 'teléfono real verificable' : 'placeholder/centralita'} · ${
      hasTaxId ? 'NIF presente' : 'NIF ausente'
    } → ${compliant ? 'CONFORME' : 'NO CONFORME'}.`,
  };
};

/** 8. dispute-escrow-arbitrator: arbitraje neutral de fondos en escrow. */
const disputeEscrowArbitratorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const disputeId = String(msg.payload.disputeId ?? 'DSP-UNKNOWN');
  const amountEscrowEur = Math.max(0, Number(msg.payload.amountEscrowEur ?? 0));
  const split = computeSplit(amountEscrowEur);

  void dispatchToN8n('dispute-escrow', {
    disputeId,
    amountEscrowEur,
    artist: split.artista,
    earOs: split.earOs,
    vimume: split.vimume,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Arbitraje ${disputeId}: ${amountEscrowEur} € en escrow · resolución 80/10/10 (${split.artista}/${split.earOs}/${split.vimume} €).`,
  };
};

export function registerLegalFinancialDivision(bus: AgentBus): void {
  bus.register('smart-contract-engine', smartContractEngineHandler);
  bus.register('b2g-tender-hunter', b2gTenderHunterHandler);
  bus.register('b2g-pliego-compiler', b2gPliegoCompilerHandler);
  bus.register('split-settlement-dispatcher', splitSettlementDispatcherHandler);
  bus.register('modelo-182-tax-shield', modelo182TaxShieldHandler);
  bus.register('invoice-treasury-agent', invoiceTreasuryAgentHandler);
  bus.register('vendor-compliance-auditor', vendorComplianceAuditorHandler);
  bus.register('dispute-escrow-arbitrator', disputeEscrowArbitratorHandler);
}
