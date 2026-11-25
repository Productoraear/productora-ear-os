/**
 * Simulación en disco: negociación en caliente con Javier (DJ, Hacienda El Ternero, Haro, 220 pax).
 * Ejecuta el endpoint real /api/concierge/chat (motor determinista, sin LLM) y las
 * herramientas MCP de concierge-tools. Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/simulate_javier_negotiation.ts
 */
import { NextRequest } from 'next/server';

delete process.env.OPENROUTER_API_KEY; // fuerza el motor determinista (reproducible)

async function main(): Promise<void> {
  const { POST } = await import('../src/app/api/concierge/chat/route');
  const history = [
    { role: 'user', content: 'Busco sonido, iluminación y tarima para 220 pax en Hacienda El Ternero, Haro, el 18 de septiembre.' },
    { role: 'assistant', content: 'Te entiendo perfectamente, colega. Sin sorpresas de transporte y presupuesto cerrado de 1.850 € + IVA.' },
  ];
  const req = new NextRequest('http://localhost/api/concierge/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message: 'Te propongo algo mejor...',
      routeContext: { pathname: '/presupuesto' },
      history,
    }),
  });
  const res = await POST(req);
  const body = (await res.json()) as Record<string, unknown>;
  console.log('── ENDPOINT /api/concierge/chat ──');
  console.log('HTTP', res.status);
  console.log(JSON.stringify(body, null, 2));

  const tools = await import('../src/lib/mcp/concierge-tools');
  console.log('── concierge-tools exports ──');
  console.log(Object.keys(tools).filter((k) => /tool|dispatch|run|call/i.test(k)).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
