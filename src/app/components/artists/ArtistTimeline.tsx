import React from 'react';
import { CalendarEvent } from '@/lib/artists/schema';
import { Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';

interface ArtistTimelineProps {
  events: CalendarEvent[];
}

export const ArtistTimeline: React.FC<ArtistTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Giras y Gigs</h3>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Calendario de actuaciones en directo y eventos corporativos</p>
      </div>

      <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-white/5">
        {events.map((event) => {
          return (
            <div key={event.id} className="flex gap-8 items-start relative group">
              <div className="w-12 h-12 rounded-2xl bg-[#0b0b0b] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-[#ecb613] group-hover:border-[#ecb613]/20 transition-all z-10">
                <Calendar size={16} />
              </div>

              <div className="flex-1 bg-[#0b0b0b] border border-white/5 rounded-3xl p-8 space-y-4 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
                      {event.status}
                    </span>
                    <h4 className="text-lg font-black uppercase text-white tracking-tight mt-3">{event.title}</h4>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40 pt-2">
                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#ecb613]" /> {event.location}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-white/30" /> {new Date(event.startsAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
