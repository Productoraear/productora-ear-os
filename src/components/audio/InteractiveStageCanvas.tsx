'use client';

import React, { useRef, useEffect } from 'react';
import { MusicianPosition, VenueType, MONITOR_CATALOG } from '@/lib/audio/symphonicRiderEngine';

interface Props {
  musicians: MusicianPosition[];
  venue: VenueType;
  cameraAngle: 'TOP_DOWN' | 'FOH_PERSPECTIVE' | 'STAGE_LEFT' | 'STAGE_RIGHT';
  onSelectMusician: (m: MusicianPosition) => void;
  selectedId?: string;
  activeMixerName?: string;
}

export const InteractiveStageCanvas: React.FC<Props> = ({
  musicians,
  venue,
  cameraAngle,
  onSelectMusician,
  selectedId,
  activeMixerName = 'SQ-7'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 540);

    ctx.clearRect(0, 0, width, height);

    // Dynamic environmental background
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
    if (venue === 'GLASS_DOME') {
      gradient.addColorStop(0, '#061325');
      gradient.addColorStop(1, '#020617');
    } else if (venue === 'THEATER_HALL') {
      gradient.addColorStop(0, '#1c140e');
      gradient.addColorStop(1, '#080504');
    } else if (venue === 'TENT') {
      gradient.addColorStop(0, '#151520');
      gradient.addColorStop(1, '#050508');
    } else {
      gradient.addColorStop(0, '#0a0d14');
      gradient.addColorStop(1, '#030305');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    if (cameraAngle === 'FOH_PERSPECTIVE') {
      ctx.translate(width / 2, height * 0.95);
      ctx.scale(1.15, 0.45);
      ctx.translate(-width / 2, -height * 0.95);
    } else if (cameraAngle === 'STAGE_LEFT') {
      ctx.translate(width * 0.2, height / 2);
      ctx.transform(0.8, -0.3, 0.1, 0.9, 0, 0);
      ctx.translate(-width * 0.2, -height / 2);
    } else if (cameraAngle === 'STAGE_RIGHT') {
      ctx.translate(width * 0.8, height / 2);
      ctx.transform(0.8, 0.3, -0.1, 0.9, 0, 0);
      ctx.translate(-width * 0.8, -height / 2);
    }

    const stageW = width * 0.84;
    const stageH = height * 0.76;
    const stageX = (width - stageW) / 2;
    const stageY = (height - stageH) / 2;

    // Stage 3D depth border
    ctx.fillStyle = '#09090b';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(stageX - 4, stageY + 6, stageW + 8, stageH + 6, 20);
    } else {
      ctx.rect(stageX - 4, stageY + 6, stageW + 8, stageH + 6);
    }
    ctx.fill();

    // Stage surface (OLED Premium Wood Finish)
    ctx.fillStyle = '#121216';
    ctx.strokeStyle = '#ecb613';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(stageX, stageY, stageW, stageH, 18);
    } else {
      ctx.rect(stageX, stageY, stageW, stageH);
    }
    ctx.fill();
    ctx.stroke();

    // Acoustic dispersion concentric arcs
    ctx.strokeStyle = 'rgba(236, 182, 19, 0.14)';
    ctx.lineWidth = 1;
    for (let r = 80; r <= 360; r += 55) {
      ctx.beginPath();
      ctx.arc(width / 2, stageY + stageH, r, Math.PI, 2 * Math.PI);
      ctx.stroke();
    }

    // Line Array Speakers / PA Towers Left & Right
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    // PA Left
    ctx.fillRect(stageX - 22, stageY + stageH - 90, 18, 70);
    ctx.strokeRect(stageX - 22, stageY + stageH - 90, 18, 70);
    // PA Right
    ctx.fillRect(stageX + stageW + 4, stageY + stageH - 90, 18, 70);
    ctx.strokeRect(stageX + stageW + 4, stageY + stageH - 90, 18, 70);

    ctx.font = 'bold 8px JetBrains Mono, monospace';
    ctx.fillStyle = '#a5b4fc';
    ctx.fillText('PA L', stageX - 18, stageY + stageH - 95);
    ctx.fillText('PA R', stageX + stageW + 6, stageY + stageH - 95);

    // Front of House (FOH Desk at bottom center)
    const fohW = 70;
    const fohH = 20;
    const fohX = width / 2 - fohW / 2;
    const fohY = stageY + stageH + 12;
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#ecb613';
    ctx.lineWidth = 1.5;
    ctx.fillRect(fohX, fohY, fohW, fohH);
    ctx.strokeRect(fohX, fohY, fohW, fohH);
    ctx.font = 'bold 8px JetBrains Mono, monospace';
    ctx.fillStyle = '#ecb613';
    ctx.textAlign = 'center';
    ctx.fillText(activeMixerName, width / 2, fohY + 13);

    // Draw Floor Monitor Wedges
    const wedges = [
      { x: stageX + stageW * 0.35, y: stageY + stageH - 24 },
      { x: stageX + stageW * 0.5, y: stageY + stageH - 24 },
      { x: stageX + stageW * 0.65, y: stageY + stageH - 24 }
    ];
    wedges.forEach((w) => {
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w.x - 12, w.y + 8);
      ctx.lineTo(w.x + 12, w.y + 8);
      ctx.lineTo(w.x + 8, w.y - 6);
      ctx.lineTo(w.x - 8, w.y - 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // Draw Musicians with Avatars & Mic Stands
    musicians.forEach((m) => {
      const px = stageX + (m.x / 100) * stageW;
      const py = stageY + (m.y / 100) * stageH;
      const isSelected = m.id === selectedId;

      let sectionColor = '#ecb613';
      if (m.section === 'MARIACHI') sectionColor = '#06b6d4';
      if (m.section === 'STRINGS') sectionColor = '#a855f7';
      if (m.section === 'BRASS') sectionColor = '#f97316';
      if (m.section === 'WOODWINDS') sectionColor = '#10b981';
      if (m.section === 'PERCUSSION') sectionColor = '#ef4444';

      // Monitor type badge (In-Ear vs Wedge)
      const monitor = MONITOR_CATALOG.find((mon) => mon.id === m.monitorId);
      const isInEar = monitor?.type === 'IN_EAR';

      // Selection Aura
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(px, py, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(236, 182, 19, 0.35)';
        ctx.fill();
        ctx.strokeStyle = '#ecb613';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Musician Podium / Circle
      ctx.beginPath();
      ctx.arc(px, py, isSelected ? 12 : 9, 0, 2 * Math.PI);
      ctx.fillStyle = sectionColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Instrument Avatar Icon
      ctx.font = isSelected ? '13px sans-serif' : '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.avatarIcon, px, py);

      // In-Ear indicator dot
      if (isInEar) {
        ctx.beginPath();
        ctx.arc(px + 8, py - 8, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
      }

      // Text labels for soloist, selected, or first few members
      if (isSelected || m.section === 'VOICE_SOLO' || m.channel <= 3) {
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.fillStyle = isSelected ? '#ecb613' : '#e4e4e7';
        ctx.fillText('CH' + m.channel + ' ' + m.instrument, px, py - 16);
      }
    });

    ctx.restore();
  }, [musicians, venue, cameraAngle, selectedId, activeMixerName]);

  return (
    <div className="relative w-full h-full min-h-[480px] flex items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-black">
      <canvas
        ref={canvasRef}
        className="cursor-crosshair w-full h-full"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = ((e.clientX - rect.left) / rect.width) * 100;
          const clickY = ((e.clientY - rect.top) / rect.height) * 100;

          let closest = musicians[0];
          let minDist = 9999;
          musicians.forEach((m) => {
            const dist = Math.hypot(m.x - clickX, m.y - clickY);
            if (dist < minDist) {
              minDist = dist;
              closest = m;
            }
          });
          if (closest && minDist < 15) {
            onSelectMusician(closest);
          }
        }}
      />
    </div>
  );
};
