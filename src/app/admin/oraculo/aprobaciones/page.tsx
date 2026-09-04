import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { ApproveDraftClient } from './ApproveDraftClient';

export default async function AprobacionesPage() {
    const basePath = path.join(process.cwd(), 'src', 'data');
    
    let bioDraft = null;
    let objDraft = null;
    
    try {
        const bioRaw = await fs.readFile(path.join(basePath, 'edwin-true-bio-ssot_draft.json'), 'utf-8');
        bioDraft = JSON.parse(bioRaw);
    } catch (e) {}

    try {
        const objRaw = await fs.readFile(path.join(basePath, 'oraculo-300-objeciones-ssot_draft.json'), 'utf-8');
        objDraft = JSON.parse(objRaw);
    } catch (e) {}

    return (
        <div className="min-h-screen bg-[#050507] text-white p-8">
            <h1 className="text-3xl font-black font-syne text-[#ecb613] mb-8">BANDEJA DE CUARENTENA: OMNI-DRIVE</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* BIO */}
                <div className="border border-white/10 rounded-xl p-6 bg-[#09090d]">
                    <h2 className="text-xl font-bold mb-4">Biografía Verdadera</h2>
                    {bioDraft ? (
                        <>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-white/70 overflow-auto max-h-96 mb-4">
                                <pre>{JSON.stringify(bioDraft, null, 2)}</pre>
                            </div>
                            <ApproveDraftClient target="bio" />
                        </>
                    ) : (
                        <p className="text-white/40 italic">No hay borradores en cuarentena.</p>
                    )}
                </div>
                
                {/* OBJ */}
                <div className="border border-white/10 rounded-xl p-6 bg-[#09090d]">
                    <h2 className="text-xl font-bold mb-4">300 Objeciones (Dani Aragón)</h2>
                    {objDraft ? (
                        <>
                            <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-white/70 overflow-auto max-h-96 mb-4">
                                <pre>{JSON.stringify(objDraft, null, 2)}</pre>
                            </div>
                            <ApproveDraftClient target="obj" />
                        </>
                    ) : (
                        <p className="text-white/40 italic">No hay borradores en cuarentena.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
