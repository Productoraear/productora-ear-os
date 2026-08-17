import { runHunterB2GScan, sendTelegramB2GAlert, Licitacion } from '../src/lib/services/b2g-hunter';

export { runHunterB2GScan, sendTelegramB2GAlert, type Licitacion };

if (require.main === module) {
  runHunterB2GScan();
}
