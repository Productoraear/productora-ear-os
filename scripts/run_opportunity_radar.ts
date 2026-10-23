import { runOpportunityRadar, getRadarStore } from '../src/lib/services/opportunity-radar/opportunity-radar';

async function main() {
    const start = Date.now();
    const result = await runOpportunityRadar();
    const store = await getRadarStore();
    const elapsed = ((Date.now() - start) / 1000).toFixed(2);

    const topOpportunities = store.opportunities
        .filter((o) => o.matchScore >= 75)
        .slice(0, 5)
        .map((o) => ({
            title: o.title.slice(0, 80),
            categories: o.categories.join(', '),
            score: o.matchScore,
            vimume: o.vimumeCompatible,
            url: o.url,
        }));

    console.log(
        JSON.stringify({
            ok: result.ok,
            source: result.source,
            scannedFeeds: result.scannedFeeds,
            fetchedCount: result.fetchedCount,
            newCount: result.newCount,
            highMatchCount: result.highMatchCount,
            telegramDispatched: result.telegramDispatched,
            n8nDispatched: result.n8nDispatched,
            storedTotal: store.opportunities.length,
            elapsedSeconds: elapsed,
            error: result.error,
            topOpportunities,
        }),
    );
}

main().catch((err) => {
    console.error(JSON.stringify({ ok: false, error: err instanceof Error ? err.message : String(err) }));
    process.exit(1);
});
