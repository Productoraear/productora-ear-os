
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    fallbackIcon?: React.ReactNode;
}

/**
 * Astra Optimized Image Component
 * - Forces lazy loading
 * - Async decoding
 * - Handles loading states and errors gracefully
 * - Fades in upon load
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
    src, 
    alt, 
    className = '', 
    fallbackIcon,
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className} bg-zinc-800`}>
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 animate-pulse z-10">
                    <Icon className="w-6 h-6 text-zinc-600"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></Icon>
                </div>
            )}
            
            {hasError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-zinc-500">
                    {fallbackIcon || <span className="text-xs">Img Error</span>}
                </div>
            ) : (
                <motion.img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`w-full h-full object-cover ${className}`}
                    {...props as any}
                />
            )}
        </div>
    );
};