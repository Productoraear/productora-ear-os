"use client";

import React from 'react';
import Navbar from '@/components/Navbar';

const Footer = () => (
  <footer className="p-10 border-t border-white/5 text-[10px] text-gray-600 uppercase tracking-widest text-center">
    EAR OS GOLD v2.1 // 2026
  </footer>
);

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#C6C6C6] font-sans selection:bg-[#F2CA50] selection:text-[#050505]">
      <Navbar />
      <main className="pt-16 pb-20">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
