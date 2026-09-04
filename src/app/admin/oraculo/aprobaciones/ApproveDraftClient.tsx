'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ApproveDraftClient({ target }: { target: 'bio' | 'obj' }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const handleApprove = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/oraculo/approve', {
                method: 'POST',
                body: JSON.stringify({ target }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
                router.refresh();
            } else {
                alert("Error: " + data.error);
            }
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <button 
            disabled={loading}
            onClick={handleApprove}
            className="w-full bg-[#ecb613] text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-white transition-all disabled:opacity-50"
        >
            {loading ? "SELLANDO..." : "APROBAR Y SELLAR"}
        </button>
    );
}
