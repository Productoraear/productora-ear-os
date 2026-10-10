import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';

interface WalletTransaction {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    createdAt: Date;
}

interface WalletData {
    balance: number;
    currency: string;
    transactions: WalletTransaction[];
}

interface SplitEvent {
    id: string;
    date: Date;
    description: string;
    total: number;
    artist80: number;
    earOs10: number;
    vimume10: number;
}

async function getArtistWallet(artistSlug: string): Promise<WalletData | null> {
    try {
        const artist = await prisma.artistProfile.findUnique({
            where: { slug: artistSlug },
            include: {
                user: {
                    include: {
                        auraWallet: {
                            include: {
                                transactions: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 10,
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!artist?.user?.auraWallet) return null;

        const wallet = artist.user.auraWallet;
        return {
            balance: wallet.balance,
            currency: wallet.currency,
            transactions: wallet.transactions.map((t) => ({
                id: t.id,
                amount: t.amount,
                type: t.type,
                description: t.description,
                createdAt: t.createdAt,
            })),
        };
    } catch {
        return null;
    }
}

function formatEUR(amount: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function WalletSkeleton(): React.ReactElement {
    return (
        <div className="min-h-screen bg-[#030305] w-full overflow-x-hidden">
            <div className="max-w-5xl mx-auto px-6 py-16">
                <header className="mb-12">
                    <div className="h-6 w-48 rounded-full bg-white/5 animate-pulse mb-4" />
                    <div className="h-12 w-96 max-w-full rounded-2xl bg-white/5 animate-pulse mb-3" />
                    <div className="h-4 w-80 max-w-full rounded-lg bg-white/5 animate-pulse" />
                </header>
                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 mb-8">
                    <div className="h-3 w-32 rounded bg-white/5 animate-pulse mb-3" />
                    <div className="h-14 w-64 rounded-2xl bg-white/5 animate-pulse mb-4" />
                    <div className="h-3 w-56 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6">
                            <div className="h-3 w-24 rounded bg-white/5 animate-pulse mb-2" />
                            <div className="h-7 w-32 rounded-lg bg-white/5 animate-pulse" />
                        </div>
                    ))}
                </div>
                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <div className="h-4 w-48 rounded bg-white/5 animate-pulse" />
                    </div>
                    <div className="divide-y divide-white/5">
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="h-4 w-64 max-w-full rounded bg-white/5 animate-pulse mb-2" />
                                    <div className="h-3 w-40 rounded bg-white/5 animate-pulse" />
                                </div>
                                <div className="h-4 w-20 rounded bg-white/5 animate-pulse ml-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function WalletError({ message }: { message: string }): React.ReactElement {
    return (
        <div className="min-h-screen bg-[#030305] w-full overflow-x-hidden flex items-center justify-center px-6">
            <div className="max-w-md w-full rounded-3xl bg-[#09090d]/80 border border-[#FF2B44]/30 backdrop-blur-md p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FF2B44]/10 border border-[#FF2B44]/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#FF2B44]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <h2 className="text-lg font-bold font-syne text-white mb-2">
                    Error al cargar la bóveda
                </h2>
                <p className="text-sm text-zinc-400 font-light mb-4">
                    {message}
                </p>
                <p className="text-[10px] text-zinc-600 font-mono">
                    EAR OS · AuraWallet · Reintenta recargando la página
                </p>
            </div>
        </div>
    );
}

async function WalletContent(): Promise<React.ReactElement> {
    let wallet: WalletData | null = null;
    let errorMessage: string | null = null;

    try {
        wallet = await getArtistWallet('edwin-agudelo');
    } catch (err) {
        errorMessage = err instanceof Error ? err.message : 'Error desconocido al consultar el ledger.';
    }

    if (errorMessage) {
        return <WalletError message={errorMessage} />;
    }

    const hasTransactions = wallet !== null && wallet.transactions.length > 0;

    const splitByEvent: SplitEvent[] = hasTransactions && wallet
        ? wallet.transactions.map((t) => {
            const total = Math.abs(t.amount);
            return {
                id: t.id,
                date: t.createdAt,
                description: t.description ?? 'Evento',
                total,
                artist80: total * 0.8,
                earOs10: total * 0.1,
                vimume10: total * 0.1,
            };
        })
        : [];

    const totalArtist80 = splitByEvent.reduce((s, e) => s + e.artist80, 0);
    const totalEarOs10 = splitByEvent.reduce((s, e) => s + e.earOs10, 0);
    const totalVimume10 = splitByEvent.reduce((s, e) => s + e.vimume10, 0);

    return (
        <div className="min-h-screen bg-[#030305] w-full overflow-x-hidden">
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* Header */}
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-wider mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613] animate-pulse" />
                        AuraWallet · Ledger Inmutable
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black font-syne text-white tracking-tight">
                        Tu Bóveda Soberana
                    </h1>
                    <p className="text-sm text-zinc-400 font-light mt-3 max-w-lg">
                        Transparencia absoluta en cada liquidación. El 80% neto de tus contrataciones
                        se registra aquí de forma inmutable.
                    </p>
                </header>

                {/* Balance Card */}
                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#ecb613]/5 rounded-full blur-3xl" />
                    <div className="relative">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">
                            Balance Actual
                        </div>
                        <div className="text-5xl sm:text-6xl font-black font-mono text-[#ecb613] tracking-tight">
                            {hasTransactions && wallet ? formatEUR(wallet.balance) : '0,00 €'}
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Ledger sincronizado · Split 80/10/10 activo
                        </div>
                    </div>
                </div>

                {/* Split 80/10/10 Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1">
                            Artista (80%)
                        </div>
                        <div className="text-2xl font-black font-mono text-white">
                            {hasTransactions ? formatEUR(totalArtist80) : '0,00 €'}
                        </div>
                    </div>
                    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1">
                            EAR OS (10%)
                        </div>
                        <div className="text-2xl font-black font-mono text-white">
                            {hasTransactions ? formatEUR(totalEarOs10) : '0,00 €'}
                        </div>
                    </div>
                    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1">
                            VIMUME (10%)
                        </div>
                        <div className="text-2xl font-black font-mono text-white">
                            {hasTransactions ? formatEUR(totalVimume10) : '0,00 €'}
                        </div>
                    </div>
                </div>

                {/* Transactions Ledger */}
                <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                        <h2 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                            Últimas Transacciones
                        </h2>
                    </div>

                    {hasTransactions && wallet ? (
                        <div className="divide-y divide-white/5">
                            {wallet.transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-300"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium truncate">
                                            {tx.description ?? 'Transacción'}
                                        </div>
                                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                                            {formatDate(tx.createdAt)} · {tx.type.toUpperCase()}
                                        </div>
                                    </div>
                                    <div className={`font-mono font-bold text-sm ml-4 whitespace-nowrap ${tx.amount >= 0 ? 'text-emerald-400' : 'text-[#FF2B44]'}`}>
                                        {tx.amount >= 0 ? '+' : ''}{formatEUR(tx.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-16 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#ecb613]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm text-zinc-400 font-light">
                                Aún no tienes transacciones. Tu primer bolo aparecerá aquí.
                            </p>
                            <p className="text-[11px] text-zinc-600 font-mono mt-2">
                                Ledger inmutable · Split 80/10/10 · Price-Lock SHA-256
                            </p>
                        </div>
                    )}
                </section>

                {/* Split por Evento */}
                {hasTransactions && splitByEvent.length > 0 && (
                    <section className="mt-8 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5">
                            <h2 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                                Split 80/10/10 por Evento
                            </h2>
                        </div>
                        <div className="divide-y divide-white/5">
                            {splitByEvent.map((event) => (
                                <div key={event.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-white font-medium">{event.description}</span>
                                        <span className="text-[11px] text-zinc-500 font-mono">{formatDate(event.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden flex">
                                            <div className="h-full bg-[#ecb613] transition-all duration-500" style={{ width: '80%' }} />
                                            <div className="h-full bg-cyan-500/60 transition-all duration-500" style={{ width: '10%' }} />
                                            <div className="h-full bg-[#FF2B44]/60 transition-all duration-500" style={{ width: '10%' }} />
                                        </div>
                                        <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">
                                            {formatEUR(event.total)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] font-mono">
                                        <span className="text-[#ecb613]">80% = {formatEUR(event.artist80)}</span>
                                        <span className="text-cyan-400">10% EAR = {formatEUR(event.earOs10)}</span>
                                        <span className="text-[#FF2B44]">10% VIM = {formatEUR(event.vimume10)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="mt-12 text-center">
                    <p className="text-[10px] text-zinc-600 font-mono">
                        EAR OS · AuraWallet Ledger Inmutable · Split Soberano 80/10/10 · Price-Lock SHA-256
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default function ArtistWalletPage(): React.ReactElement {
    return (
        <Suspense fallback={<WalletSkeleton />}>
            <WalletContent />
        </Suspense>
    );
}