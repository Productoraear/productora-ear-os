import React from 'react';
import type { ReactNode } from 'react';

interface EarLayoutProps {
    children: ReactNode;
}

/**
 * @deprecated The main layout is now managed globally in App.tsx. 
 * This component remains as a semantic wrapper for existing pages.
 */
export const EarLayout: React.FC<EarLayoutProps> = ({ children }) => {
    return (
        <div className="w-full relative">
            {children}
        </div>
    );
};

