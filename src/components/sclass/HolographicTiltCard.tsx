'use client';

import React, { useCallback, useEffect, useRef } from 'react';

interface HolographicTiltCardProps {
    children: React.ReactNode;
    className?: string;
    /** Color del destello holográfico (hex). */
    glareColor?: string;
    /** Tilt máximo en grados. */
    maxTilt?: number;
    /** Escala al hover. */
    hoverScale?: number;
    /** Intensidad del destello (0 - 1). */
    glareIntensity?: number;
    /** Profundidad del parallax interno (px). */
    parallaxDepth?: number;
    /** Desactiva el tilt (solo destello). */
    disableTilt?: boolean;
}

interface TiltState {
    rx: number;
    ry: number;
    gx: number;
    gy: number;
    scale: number;
    glare: number;
}

const INITIAL_STATE: TiltState = { rx: 0, ry: 0, gx: 50, gy: 50, scale: 1, glare: 0 };

export default React.memo(function HolographicTiltCard({
    children,
    className = '',
    glareColor = '#ecb613',
    maxTilt = 10,
    hoverScale = 1.025,
    glareIntensity = 0.55,
    parallaxDepth = 18,
    disableTilt = false,
}: HolographicTiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<TiltState>({ ...INITIAL_STATE });
    const currentRef = useRef<TiltState>({ ...INITIAL_STATE });
    const rafRef = useRef<number>(0);
    const hoveringRef = useRef<boolean>(false);

    const applyState = useCallback(() => {
        const card = cardRef.current;
        const inner = innerRef.current;
        if (!card || !inner) return;

        const s = currentRef.current;
        card.style.transform = `perspective(1100px) rotateX(${s.rx.toFixed(3)}deg) rotateY(${s.ry.toFixed(3)}deg) scale3d(${s.scale.toFixed(4)}, ${s.scale.toFixed(4)}, 1)`;
        const parallaxX = (s.gy - 50) * (parallaxDepth / 50);
        const parallaxY = (50 - s.gx) * (parallaxDepth / 50);
        inner.style.transform = `translate3d(${parallaxX.toFixed(2)}px, ${parallaxY.toFixed(2)}px, 0)`;
        card.style.setProperty('--glare-x', `${s.gx.toFixed(2)}%`);
        card.style.setProperty('--glare-y', `${s.gy.toFixed(2)}%`);
        card.style.setProperty('--glare-o', (s.glare * glareIntensity).toFixed(3));
    }, [parallaxDepth, glareIntensity]);

    const tick = useCallback(() => {
        const c = currentRef.current;
        const t = targetRef.current;
        const ease = 0.12;

        c.rx += (t.rx - c.rx) * ease;
        c.ry += (t.ry - c.ry) * ease;
        c.gx += (t.gx - c.gx) * ease;
        c.gy += (t.gy - c.gy) * ease;
        c.scale += (t.scale - c.scale) * ease;
        c.glare += (t.glare - c.glare) * ease;

        applyState();

        if (hoveringRef.current) {
            rafRef.current = requestAnimationFrame(tick);
        } else {
            // Detener el bucle cuando el estado converge
            const settled =
                Math.abs(t.rx - c.rx) < 0.01 &&
                Math.abs(t.ry - c.ry) < 0.01 &&
                Math.abs(t.scale - c.scale) < 0.001 &&
                Math.abs(t.glare - c.glare) < 0.005;
            if (settled) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = 0;
            } else {
                rafRef.current = requestAnimationFrame(tick);
            }
        }
    }, [applyState]);

    const ensureLoop = useCallback(() => {
        if (rafRef.current === 0) {
            rafRef.current = requestAnimationFrame(tick);
        }
    }, [tick]);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            const card = cardRef.current;
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;

            targetRef.current = {
                rx: disableTilt ? 0 : (0.5 - py) * maxTilt,
                ry: disableTilt ? 0 : (px - 0.5) * maxTilt,
                gx: px * 100,
                gy: py * 100,
                scale: hoverScale,
                glare: 1,
            };
            ensureLoop();
        },
        [disableTilt, maxTilt, hoverScale, ensureLoop]
    );

    const handlePointerEnter = useCallback(() => {
        hoveringRef.current = true;
        targetRef.current = { ...targetRef.current, scale: hoverScale, glare: 1 };
        ensureLoop();
    }, [hoverScale, ensureLoop]);

    const handlePointerLeave = useCallback(() => {
        hoveringRef.current = false;
        targetRef.current = { ...INITIAL_STATE };
        ensureLoop();
    }, [ensureLoop]);

    useEffect(() => {
        return () => {
            if (rafRef.current !== 0) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = 0;
            }
        };
    }, []);

    return (
        <div
            ref={cardRef}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            className={`relative will-change-transform transition-none ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                ['--glare-x' as string]: '50%',
                ['--glare-y' as string]: '50%',
                ['--glare-o' as string]: '0',
                ['--glare-color' as string]: glareColor,
            }}
        >
            {/* Capa interna con parallax (contenido) */}
            <div ref={innerRef} className="relative h-full will-change-transform">
                {children}
            </div>

            {/* Destello holográfico que sigue al cursor */}
            <div
                className="absolute inset-0 pointer-events-none rounded-[inherit] z-30"
                style={{
                    background: `radial-gradient(circle at var(--glare-x) var(--glare-y), ${glareColor}55 0%, ${glareColor}18 28%, transparent 62%)`,
                    opacity: 'var(--glare-o)',
                    mixBlendMode: 'screen',
                }}
            />

            {/* Película iridiscente holográfica (conic) */}
            <div
                className="absolute inset-0 pointer-events-none rounded-[inherit] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `conic-gradient(from 210deg at var(--glare-x) var(--glare-y), transparent 0%, ${glareColor}22 12%, #ffffff14 22%, ${glareColor}1c 34%, transparent 48%, ${glareColor}20 62%, transparent 78%, ${glareColor}18 90%, transparent 100%)`,
                    mixBlendMode: 'overlay',
                }}
            />

            {/* Borde luminoso reactivo */}
            <div
                className="absolute inset-0 pointer-events-none rounded-[inherit] z-40"
                style={{
                    border: `1px solid ${glareColor}`,
                    opacity: 'calc(var(--glare-o) * 0.45)',
                    boxShadow: `inset 0 1px 0 ${glareColor}40, 0 18px 50px -12px ${glareColor}30`,
                }}
            />
        </div>
    );
});