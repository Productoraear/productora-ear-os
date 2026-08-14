import React from 'react';
import BentoGrid from './BentoGrid';

interface NeuralInterlinkNexusProps {
  currentCategory?: string;
}

const NeuralInterlinkNexus: React.FC<NeuralInterlinkNexusProps> = ({ currentCategory }) => {
  const links = generateLinks(currentCategory);

  return (
    <div className="bg-zinc-950/80 border-[#ecb613]/20 p-4">
{links.map((link, index) => (
  <a key={index} href={link.href} className="block text-white hover:text-yellow-500">
    {link.title}
  </a>
))}
    </div>
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