
import React from 'react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    ariaLabel: string; // Mandatory for accessibility
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

/**
 * A standard button component that enforces accessibility best practices.
 * - Ensures high contrast focus rings.
 * - Requires an aria-label.
 * - Handles disabled states correctly with aria-disabled.
 */
export const AccessibleButton: React.FC<AccessibleButtonProps> = ({ 
    ariaLabel, 
    className = '', 
    onClick, 
    disabled, 
    icon, 
    children, 
    ...props 
}) => {
    return (
        <button
            aria-label={ariaLabel}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${className}
            `}
            {...props}
        >
            {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
            {children}
        </button>
    );
};
