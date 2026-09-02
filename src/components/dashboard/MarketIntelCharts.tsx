"use client";
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    Cell
} from 'recharts';

interface MarketData {
    category_distribution: Record<string, number>;
    historical_growth: Array<{ month: string; value: number }>;
}

export const MarketIntelCharts: React.FC<{ data: MarketData }> = ({ data }) => {
    // Transformamos los datos para Recharts
    const categoryData = Object.entries(data?.category_distribution || {}).map(([name, value]) => ({
        name: name.toUpperCase(),
        value
    }));

    const COLORS = ['#D4AF37', '#8E24AA', '#1E88E5', '#43A047', '#E53935'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-h-[400px]">
            {/* DISTRIBUCIÓN POR CATEGORÍA */}
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Saturación por Categoría (Saturation)</h4>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 8, fontWeight: 'bold' }}
                            />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000',
                                    border: '1px solid #333',
                                    borderRadius: '12px',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CRECIMIENTO HISTÓRICO (PROYECCIÓN) */}
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Trayectoria de Crecimiento (Growth)</h4>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.historical_growth || []}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }}
                            />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#000',
                                    border: '1px solid #333',
                                    borderRadius: '12px',
                                    fontSize: '10px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#D4AF37"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};