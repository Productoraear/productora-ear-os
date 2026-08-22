'use client';
import { useEffect, useRef } from 'react';
import { create } from 'zustand';
export const useBiometricStore = create((set) => ({
    intent: 0,
    isReadyToCommit: false,
    mousePos: { x: 0, y: 0 },
    setIntent: (intent) => set({ intent }),
    setReadyToCommit: (isReadyToCommit) => set({ isReadyToCommit }),
    setMousePos: (mousePos) => set({ mousePos }),
}));
export function useBiometricIntent() {
    const { setIntent, setReadyToCommit, setMousePos } = useBiometricStore();
    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastTime = useRef(Date.now());
    const hoverStartTime = useRef(null);
    useEffect(() => {
        const handleMouseMove = (e) => {
            const now = Date.now();
            const dt = now - lastTime.current;
            if (dt === 0)
                return;
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = dist / dt;
            setMousePos({ x: e.clientX, y: e.clientY });
            // Si la velocidad es muy baja, empezamos a acumular intención
            if (speed < 0.1) {
                if (!hoverStartTime.current)
                    hoverStartTime.current = now;
                const duration = now - hoverStartTime.current;
                const intentLevel = Math.min(duration / 1500, 1); // 1.5 segundos para full intent
                setIntent(intentLevel);
                if (intentLevel > 0.9) {
                    setReadyToCommit(true);
                }
            }
            else {
                hoverStartTime.current = null;
                setIntent(0);
                setReadyToCommit(false);
            }
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            lastTime.current = now;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [setIntent, setReadyToCommit, setMousePos]);
}
