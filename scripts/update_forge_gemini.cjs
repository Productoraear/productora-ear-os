const fs = require('fs');
const filePath = 'src/lib/compiler/prompt-maestro-forge.ts';
let code = fs.readFileSync(filePath, 'utf8');

const targetIndex = code.indexOf('if (isDeepSeekConfigured()) {');
if (targetIndex !== -1 && !code.includes('runGeminiForgeChat')) {
  // Ya importó runGeminiForgeChat arriba, revisamos si está en el cuerpo
}

const geminiCall = `    // 0) Google Gemini Flash (Cloud Edge Gratuito / Residual con GEMINI_API_KEY) — PRIORIDAD #1
    if (isGeminiConfigured()) {
        try {
            const gem = await runGeminiForgeChat({
                systemPrompt: FORGE_SYSTEM_PROMPT,
                userPrompt: userPrompt,
                modelName: 'gemini-1.5-flash',
                jsonMode: true,
                temperature: 0.15
            });
            if (gem.available && gem.content) {
                const parsed = extractJsonObject<ForgeLlmOutput>(gem.content);
                if (parsed?.masterPrompt) {
                    return assembleForgedResult(
                        parsed,
                        intent,
                        mode,
                        'Google Gemini 1.5 Flash (Cloud Edge)',
                        'GEMINI_CLOUD',
                        gem.latencyMs,
                        0,
                        'GEMINI_CLOUD (gemini-1.5-flash)'
                    );
                }
            }
        } catch {
            // Cae con elegancia al siguiente motor
        }
    }
`;

if (!code.includes('GEMINI_CLOUD (gemini-1.5-flash)')) {
  code = code.replace('if (isDeepSeekConfigured()) {', geminiCall + '\n    if (isDeepSeekConfigured()) {');
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('SUCCESS_INSERT_GEMINI_BODY');
} else {
  console.log('ALREADY_INSERTED');
}
