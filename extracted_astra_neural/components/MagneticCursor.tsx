
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const MagneticCursor: React.FC = () => {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 10);
            cursorY.set(e.clientY - 10);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('clickable')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-5 h-5 border-2 border-gold-light rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
            animate={{
                scale: isHovering ? 2.5 : 1,
                backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                borderColor: isHovering ? 'transparent' : '#F4D03F' // Gold
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
            <motion.div 
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
                animate={{ opacity: isHovering ? 0 : 1 }}
            />
        </motion.div>
    );
};
