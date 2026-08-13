import React from 'react';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white antialiased selection:bg-amber-500 selection:text-black">
            {children}
        </div>
    );
}