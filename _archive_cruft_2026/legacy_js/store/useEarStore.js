import { create } from 'zustand';
export const useEarStore = create((set, get) => ({
    investments: [],
    projectedROI: 0,
    totalAura: 0,
    xpArtista: 0,
    addInvestment: (node) => {
        set((state) => ({ investments: [...state.investments, node] }));
        get().calculateMetrics();
    },
    removeInvestment: (id) => {
        set((state) => ({ investments: state.investments.filter(n => n.id !== id) }));
        get().calculateMetrics();
    },
    calculateMetrics: () => {
        const { investments } = get();
        // Cálculo de Oráculo Nivel OMEGA
        const roi = investments.reduce((acc, curr) => acc + curr.roiProjected, 0);
        const aura = investments.reduce((acc, curr) => acc + curr.auraLevel, 0);
        // Añadimos un multiplicador de sinergia de red si hay múltiples nodos
        const synergyMultiplier = investments.length > 2 ? 1.15 : 1.0;
        set({
            projectedROI: Number((roi * synergyMultiplier).toFixed(2)),
            totalAura: Number((aura * synergyMultiplier).toFixed(2))
        });
    },
    addXp: (amount) => set((state) => ({ xpArtista: state.xpArtista + amount })),
}));
