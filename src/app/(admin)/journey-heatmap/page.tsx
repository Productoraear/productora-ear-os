import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default function JourneyHeatmapRedirect() {
  redirect('/admin/journey-heatmap');
}
