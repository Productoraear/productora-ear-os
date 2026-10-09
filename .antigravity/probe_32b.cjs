const MODEL = 'ear-32b-arquitecto-sclass:latest';
const prompt = 'Eres el Arquitecto S-Class de EAR OS. En maximo 20 lineas, disena el plan de arquitectura para validar que la ruta /reservar/solista no tiene ninguna fachada: capas SSOT->seguridad->datos->API->webhook->UI->testing. Se conciso y tecnico.';

async function main() {
    const t0 = Date.now();
    const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
            options: { temperature: 0.2, num_ctx: 8192 }
        })
    });
    if (!res.ok) {
        const err = await res.text();
        console.error('HTTP', res.status, err.slice(0, 500));
        process.exit(1);
    }
    const data = await res.json();
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    console.log('── MODELO:', MODEL, '──');
    console.log('tiempo_total_s:', secs, '| eval_count:', data.eval_count, '| eval_duration_ns:', data.eval_duration);
    if (data.eval_count && data.eval_duration) {
        const tps = (data.eval_count / (data.eval_duration / 1e9)).toFixed(1);
        console.log('tokens_seg:', tps);
    }
    console.log('────────────────────────');
    console.log(data.response);
}
main().catch((e) => { console.error('FAIL:', e.message); process.exit(1); });