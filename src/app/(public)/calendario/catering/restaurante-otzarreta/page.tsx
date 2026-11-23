'use client';

import EntityCalendarBoard from '@/components/calendar/EntityCalendarBoard';

export default function OtzarretaCalendarPage() {
  return (
    <EntityCalendarBoard
      kind="catering"
      slug="restaurante-otzarreta"
      canMutate={false}
    />
  );
}
