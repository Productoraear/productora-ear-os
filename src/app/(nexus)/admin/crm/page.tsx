import { ExpansionDashboard } from '@/modules/SClassScreens/ExpansionDashboard';

export const dynamic = 'force-dynamic'; // Evita el cacheo que causa el salto

export default function Page() {
  return <ExpansionDashboard />;
}
