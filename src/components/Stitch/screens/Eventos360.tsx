'use client';
import React from 'react';

export default function Eventos360() {
  const events = [
    { title: 'Bodas de Lujo', icon: 'favorite', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYTFLG0rNevBlyGA8cChBWqkZPSkGqFDZ9iNHA81pilS-2-k05Z4C_Doh7VxjliTsuAJxSeLIgeb_GwZzW8hZM9S1I-IgZHv3otuposa_HnC-urUg3-ZopXx-FhDRsq6Shk0xaBf9Vpp1NVDE_C8uq635E5c-iyzlx-j0PpKrKZeHhgCBu-AUoolacU4HFyUHdm9XVrGnfuFwnoGWQt59SAq3bmk3sfa8aHQm0BQM9r8eOProxDoQRYUBrOKNw2CAJmzT-YGNGNQ' },
    { title: 'Corporativo', icon: 'business_center', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPxpVRinME-vKv-YkFUVklQKfCMVRVlkM3LwsrRNhvXZUFzG44vAFelsLG8xwletLpV3e7Ul_dJ1BRPrx74DiP4bEXR0aTSw8E8lJH6PVx4U5nEc5kkdx8z09RwCcRYr2axKuqVuITn3LdjToWDNniq1TQDUoVFsC_neiZltxi60fdBrT8vudFC27cvitFERCXVpS2_aMjebh6b0-l0rRKMmf1RlTCDFUwEffKsJzyw75ffoZAkw5gnBUg4neldB-pO6JFu-A6VA' },
    { title: 'Ferias (IFEMA)', icon: 'storefront', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAgdcYirTdzawJoZuVmmpZNkSiEz1PAwSff-1e3OruM05K1jwcU2RtSuJfcV-L2TMelVPFd-4KA9Gx3UTQU_DB4Q4eH2ccYZDINpW6LzM9qYe_5nXlIKtRYUluq5ZpCEHpr8SXcZdhXacNyr7gKuQakoq271wypZiHiccMN6MurMlNbkf5dW36oF7PMBMEil3eY8rkqW2C2IURCZ12zAou7KEd1akDM4ntlbq8ghkRtO3PHyDTPY6H69Bu-v9Mvg0c3x8lmDL9jw' }
  ];

  return (
    <div className="w-full space-y-8 bg-[#221d10] p-4 text-white">
      <div className="text-center py-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Experiencias Inolvidables</h1>
        <p className="text-white/40 max-w-md mx-auto italic">Planificación meticulosa con nuestros sistemas anti-caos de Productora EAR.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((ev, i) => (
          <div key={i} className="group relative rounded-[40px] overflow-hidden bg-white/5 border border-white/10 hover:border-primary/40 transition-all">
            <div className="h-64 overflow-hidden">
              <img src={ev.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={ev.title} />
            </div>
            <div className="p-8 flex justify-between items-center bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">{ev.icon}</span>
                <span className="font-bold uppercase tracking-widest text-xs">{ev.title}</span>
              </div>
              <button className="text-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
