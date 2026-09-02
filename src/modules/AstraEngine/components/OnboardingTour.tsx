
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

export interface TourStep {
    targetId?: string; // ID of the element to highlight. If undefined, modal is centered.
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
    isOpen: boolean;
    onClose: () => void;
    steps: TourStep[];
    onComplete: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, steps, onComplete }) => {
    const { t } = useTranslations();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;

    const updateTargetRect = useCallback(() => {
        if (currentStep?.targetId) {
            const element = document.getElementById(currentStep.targetId);
            if (element) {
                // Scroll element into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTargetRect(element.getBoundingClientRect());
            } else {
                setTargetRect(null); // Fallback to center if ID not found
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep]);

    useEffect(() => {
        if (isOpen) {
            // Small delay to allow DOM to settle (rendering animations)
            const timer = setTimeout(updateTargetRect, 500);
            window.addEventListener('resize', updateTargetRect);
            window.addEventListener('scroll', updateTargetRect, true);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('resize', updateTargetRect);
                window.removeEventListener('scroll', updateTargetRect, true);
            };
        }
    }, [isOpen, currentStepIndex, updateTargetRect]);

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
            onClose();
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    if (!isOpen) return null;

    // Calculate Popover Position
    let popoverStyle: React.CSSProperties = {};
    
    if (targetRect) {
        // Positioning logic relative to target
        // Default to bottom if fits, otherwise top
        const spaceBelow = window.innerHeight - targetRect.bottom;
        const spaceAbove = targetRect.top;
        const isOnBottom = spaceBelow > 250 || spaceBelow > spaceAbove;

        popoverStyle = {
            position: 'absolute',
            top: isOnBottom ? targetRect.bottom + 20 : 'auto',
            bottom: isOnBottom ? 'auto' : window.innerHeight - targetRect.top + 20,
            left: targetRect.left + (targetRect.width / 2) - 200, // Center horizontally roughly
            width: '400px',
            maxWidth: '90vw',
        };
        
        // Boundary checks
        if (targetRect.left + (targetRect.width / 2) - 200 < 10) {
             popoverStyle.left = 10;
        } else if (targetRect.left + (targetRect.width / 2) + 200 > window.innerWidth) {
             popoverStyle.left = window.innerWidth - 410;
        }

    } else {
        // Center screen
        popoverStyle = {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            maxWidth: '90vw',
            zIndex: 60
        };
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop / Spotlight */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 overflow-hidden"
                        style={{ pointerEvents: 'auto' }} // Block clicks behind
                    >
                        {/* This SVG creates the "hole" spotlight effect */}
                        <svg width="100%" height="100%" className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <defs>
                                <mask id="spotlight-mask">
                                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                                    {targetRect && (
                                        <rect
                                            x={targetRect.left - 10}
                                            y={targetRect.top - 10}
                                            width={targetRect.width + 20}
                                            height={targetRect.height + 20}
                                            rx="12"
                                            fill="black"
                                        />
                                    )}
                                </mask>
                            </defs>
                            <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="rgba(0, 0, 0, 0.75)"
                                mask="url(#spotlight-mask)"
                            />
                            {/* Optional: Animated border around target */}
                            {targetRect && (
                                <motion.rect
                                    x={targetRect.left - 10}
                                    y={targetRect.top - 10}
                                    width={targetRect.width + 20}
                                    height={targetRect.height + 20}
                                    rx="12"
                                    fill="transparent"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                />
                            )}
                        </svg>
                    </motion.div>

                    {/* Card Content */}
                    <motion.div
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        style={popoverStyle}
                        className="z-50 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                                    {t('tour_step')} {currentStepIndex + 1} / {steps.length}
                                </span>
                            </div>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">{currentStep.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">{currentStep.content}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <button 
                                onClick={handlePrev}
                                disabled={currentStepIndex === 0}
                                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${currentStepIndex === 0 ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-300 hover:bg-zinc-800'}`}
                            >
                                {t('backButton')}
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-all"
                            >
                                {isLastStep ? t('tour_finish') : t('tour_next')}
                                {!isLastStep && <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></Icon>}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
