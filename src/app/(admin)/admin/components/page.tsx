import type { Metadata } from 'next';
import ComponentsShowcaseClient from './ComponentsShowcaseClient';

export const metadata: Metadata = {
  title: 'Biblioteca Vanguardia | Admin EAR OS',
  robots: { index: false, follow: false },
};

export default function AdminComponentsPage() {
  return <ComponentsShowcaseClient />;
}
