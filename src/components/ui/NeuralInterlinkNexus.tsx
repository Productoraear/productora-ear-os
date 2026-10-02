'use client';

import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';

interface NeuralInterlinkNexusProps {
  currentCategory?: string;
}

interface NexusBoundaryState {
  hasError: boolean;
}

interface NexusBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

class NexusErrorBoundary extends Component<NexusBoundaryProps, NexusBoundaryState> {
  state: NexusBoundaryState = { hasError: false };

  static getDerivedStateFromError(): NexusBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[NeuralInterlinkNexus] Fallo de render:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const NexusFallback: React.FC = () => (
  <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-4 text-sm text-white/70 backdrop-blur-md">
    Contenido temporalmente no disponible.
  </div>
);

const NeuralInterlinkNexus: React.FC<NeuralInterlinkNexusProps> = ({ currentCategory }) => {
  const links = generateLinks(currentCategory);

  return (
    <NexusErrorBoundary fallback={<NexusFallback />}>
      <Suspense fallback={<NexusFallback />}>
        <nav className="rounded-3xl bg-[#09090d]/80 border border-[#ecb613]/20 p-4 backdrop-blur-md">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={`${link.href}-${link.title}`}>
                <a
                  href={link.href}
                  className="block text-white/90 hover:text-[#ecb613] transition-all duration-300 ease-out"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Suspense>
    </NexusErrorBoundary>
  );
};

function generateLinks(category: string | undefined): LinkItem[] {
  const baseLinks: LinkItem[] = [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  switch (category) {
    case 'bodas':
      return [
        ...baseLinks,
        { title: 'Wedding Packages', href: '/services/weddings/packages' },
        { title: 'Photography Services', href: '/services/weddings/photography' },
        { title: 'Venue Rentals', href: '/services/weddings/venues' },
      ];
    case 'vimume':
      return [
        ...baseLinks,
        { title: 'Vimume Solutions', href: '/vimume/solutions' },
        { title: 'Vimume Services', href: '/vimume/services' },
        { title: 'Vimume Resources', href: '/vimume/resources' },
      ];
    case 'b2g':
      return [
        ...baseLinks,
        { title: 'B2G Projects', href: '/b2g/projects' },
        { title: 'B2G Initiatives', href: '/b2g/initiatives' },
        { title: 'B2G Impact', href: '/b2g/impact' },
      ];
    case 'artistas':
      return [
        ...baseLinks,
        { title: 'Artist Profiles', href: '/artistas/profiles' },
        { title: 'Art Gallery', href: '/artistas/gallery' },
        { title: 'Art Events', href: '/artistas/events' },
      ];
    default:
      return baseLinks;
  }
}

interface LinkItem {
  title: string;
  href: string;
}

export default NeuralInterlinkNexus;