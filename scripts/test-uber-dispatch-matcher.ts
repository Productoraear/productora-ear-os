import fs from 'fs';
import path from 'path';
import { 
  calculateFullTaxBreakdown, 
  checkScheduleFeasibility, 
  triggerUberFailoverCascade, 
  TimeSlotBooking 
} from '../src/lib/matchmaker/uberDispatchScheduleEngine';

async function runUberDispatchMatcherAudit() {
  console.log('========================================================================');
  console.log('🧪 TEST DE TINDER NEURAL MATCHER & MOTOR DE DESPACHO UBER — S-CLASS');
  console.log('========================================================================');

  // 1. Verificación de Desglose de Impuestos (IVA 21%)
  const breakdown = calculateFullTaxBreakdown(450, 'Madrid', 4);
  console.log(`[FINANCE & IVA] Base: ${breakdown.basePrice} € | IVA (21%): ${breakdown.vatAmount} € | Logística: ${breakdown.logisticsFee} € | TOTAL BRUTO: ${breakdown.totalGrossPrice} €`);
  
  if (breakdown.vatAmount !== 94.5) throw new Error('IVA de 21% calculado incorrectamente.');
  if (breakdown.stripeDeposit !== 100.0) throw new Error('Depósito Stripe no es de 100,00 €.');

  // 2. Verificación de Viabilidad Horaria con Buffer de 60 min
  // Caso Base: Alcorcón (09:00 - 10:00) ➔ Algete (16:30)
  const gig1: TimeSlotBooking = {
    id: 'gig-alcorcon-01',
    vendorId: 'mariachi-01',
    vendorName: 'Mariachi Guadalupano S-Class',
    date: '2026-09-20',
    startTime: '09:00',
    durationMinutes: 60,
    location: 'Alcorcón, Madrid',
    lat: 40.3458,
    lng: -3.8249
  };

  const gig2Normal: TimeSlotBooking = {
    id: 'gig-algete-02',
    vendorId: 'mariachi-01',
    vendorName: 'Mariachi Guadalupano S-Class',
    date: '2026-09-20',
    startTime: '16:30',
    durationMinutes: 90,
    location: 'Algete, Madrid',
    lat: 40.5975,
    lng: -3.5002
  };

  const feasibilityNormal = checkScheduleFeasibility(gig1, gig2Normal);
  console.log(`[SCHEDULE CHECK] Caso Normal (Alcorcón 09:00 ➔ Algete 16:30): Viable = ${feasibilityNormal.isFeasible} (${feasibilityNormal.marginMinutes} min libres)`);
  
  if (!feasibilityNormal.isFeasible) throw new Error('La verificación normal debería ser viable.');

  // 3. Verificación de Simulación de Horas Extra (+6 Horas Extra en Alcorcón)
  const gig1Overtime: TimeSlotBooking = {
    ...gig1,
    durationMinutes: 60 + (6 * 60) // 7 horas total (09:00 a 16:00)
  };

  const feasibilityOvertime = checkScheduleFeasibility(gig1Overtime, gig2Normal);
  console.log(`[SCHEDULE CHECK] Caso Horas Extra (+6h Alcorcón, fin 16:00 ➔ Algete 16:30): Viable = ${feasibilityOvertime.isFeasible} (${feasibilityOvertime.marginMinutes} min libres)`);

  if (feasibilityOvertime.isFeasible) throw new Error('La simulación con +6h extra debería fallar por falta de buffer.');

  // 4. Verificación de Cascada de Relevo Automático Tipo Uber
  const candidates = [
    { id: 'mariachi-01', name: 'Mariachi Guadalupano S-Class', category: 'Mariachi', rating: 5.0 },
    { id: 'mariachi-02', name: 'Mariachi México Real (Grupo de Relevo #2)', category: 'Mariachi', rating: 4.9 }
  ];

  const failoverResult = triggerUberFailoverCascade(gig2Normal, candidates);
  console.log(`[UBER FAILOVER] Cascada Activada: Reasignado a ${failoverResult.assignedVendorName} (Status: ${failoverResult.status})`);

  if (failoverResult.status !== 'REASSIGNED_SUCCESS') throw new Error('La cascada de relevo Uber no reasignó el candidato.');
  if (failoverResult.assignedVendorId !== 'mariachi-02') throw new Error('No se seleccionó al candidato de reemplazo adecuado.');

  // 5. Verificación de Archivos Creados
  const filesToCheck = [
    'src/lib/matchmaker/uberDispatchScheduleEngine.ts',
    'src/features/matchmaker/ui/TinderNeuralMatcher.tsx',
    'src/app/(public)/matcher/page.tsx'
  ];

  for (const relPath of filesToCheck) {
    const fullPath = path.join(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`[FILE MISSING] No se encuentra el archivo obligatorio ${relPath}`);
    }
    console.log(`✅ [FILE OK] ${relPath}`);
  }

  console.log('========================================================================');
  console.log('✅ TODOS LOS CHECKS DE MATCHER TINDER Y DESPACHO UBER EN VERDE (EXIT CODE 0)');
  console.log('========================================================================');
}

runUberDispatchMatcherAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ ERROR EN AUDITORÍA:', err);
    process.exit(1);
  });
