import { save, load } from '../lib/intelligence/EternalMemory';
import { Buffer } from 'buffer';

async function testMemoryPersistence() {
  const testFragment = {
    id: 'FORENSIC_SIG_77',
    timestamp: Date.now(),
    data: Buffer.from('EAR_OS_STABILITY_TEST').toString('hex'),
    entropy: Math.random()
  };

  // Fase A: Inyección
  await save('INTEGRITY_CHECK', testFragment);

  // Fase B: Colapso Simulado
  window.location.reload();
}

testMemoryPersistence();