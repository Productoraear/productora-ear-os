import React from 'react';
import { Home, Search, Layout, User, Settings } from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 w-full transition-all duration-300 ${
      isActive ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-white'
    }`}
  >
    <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-[#D4AF37]/10' : ''}`}>
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
    </div>
    <span className="text-[10px] font-medium uppercase tracking-widest">{label}</span>
  </button>
);

const EarBottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="max-w-md mx-auto bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center justify-around h-16 px-2">
        <NavItem icon={Home} label="Nexus" isActive />
        <NavItem icon={Search} label="Astra" />
        <NavItem icon={Layout} label="Portal" />
        <NavItem icon={User} label="Perfil" />
        <NavItem icon={Settings} label="Engine" />
      </div>
    </nav>
  );
};

export default EarBottomNav;
