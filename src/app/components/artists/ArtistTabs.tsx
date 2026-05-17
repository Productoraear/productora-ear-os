import React from 'react';
import { 
  FileText, 
  Music, 
  Image as ImageIcon, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Globe, 
  Users 
} from 'lucide-react';

export type SubTabId = 'bio' | 'media' | 'releases' | 'contracts' | 'schedule' | 'analytics' | 'notes' | 'seo_matrix';

interface ArtistTabsProps {
  activeTab: SubTabId;
  onChange: (tab: SubTabId) => void;
  allowedTabs?: SubTabId[];
}

export const ArtistTabs: React.FC<ArtistTabsProps> = ({ activeTab, onChange, allowedTabs }) => {
  const tabs = [
    { id: 'bio', label: 'Biografía & Perfil', icon: Users },
    { id: 'media', label: 'Galería Multimedia', icon: ImageIcon },
    { id: 'releases', label: 'Catálogo Releases', icon: Music },
    { id: 'contracts', label: 'Smart Contracts', icon: FileText },
    { id: 'schedule', label: 'Agenda & Giras', icon: Calendar },
    { id: 'analytics', label: 'Streams & Analytics', icon: TrendingUp },
    { id: 'notes', label: 'Notas de Gestión', icon: MessageSquare },
    { id: 'seo_matrix', label: 'SEO & B2G Swarm', icon: Globe },
  ] as const;

  const filteredTabs = allowedTabs 
    ? tabs.filter(t => allowedTabs.includes(t.id as SubTabId))
    : tabs;

  return (
    <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
      {filteredTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as SubTabId)}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              isActive 
                ? 'bg-white text-black shadow-lg shadow-white/5 border border-white/10' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={14} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
