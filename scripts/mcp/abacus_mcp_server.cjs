#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ABACUS.AI CHATLLM MCP BRIDGE — EAR OS V2 (APROVECHAMIENTO TOTAL DE SUSCRIPCIÓN)
 * Protocol: Model Context Protocol (MCP) JSON-RPC 2.0 via Stdio Transport
 * ══════════════════════════════════════════════════════════════════════════════
 * Expone la suscripción activa de Abacus.ai ChatLLM como herramientas MCP para
 * Cline/Roo. El endpoint OpenAI-compatible es configurable por variables de
 * entorno (ABACUS_BASE_URL / ABACUS_MODEL), con fallback a los valores canónicos
 * de EAR OS. Cero dependencias externas: usa `fetch` nativo de Node 18+.
 * ══════════════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const WORKSPACE = process.env.WORKSPACE_ROOT || path.resolve(__dirname, "..", "..");

/**
 * Lee variables de entorno desde los archivos .env / .env.local del workspace.
 * Prioridad: process.env > .env.local > .env. Nunca se exponen en cliente.
 */
function loadEnv() {
    const merged = {};
    const candidates = [
        path.join(WORKSPACE, ".env"),
        path.join(WORKSPACE, ".env.local"),
    ];
    for (const file of candidates) {
        if (!fs.existsSync(file)) continue;
        try {
            const lines = fs.readFileSync(file, "utf-8").split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith("#")) continue;
                const eq = trimmed.indexOf("=");
                if (eq === -1) continue;
                const key = trimmed.slice(0, eq).trim();
                let value = trimmed.slice(eq + 1).trim();
                if (
                    (value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))
                ) {
                    value = value.slice(1, -1);
                }
                if (key && value) merged[key] = value;
            }
        } catch (err) {
            // Ignorar archivos de entorno corruptos; el token sigue viniendo de process.env.
        }
    }
    return merged;
}

const ENV = loadEnv();

const ABACUS_API_KEY =
    process.env.ABACUS_API_KEY || ENV.ABACUS_API_KEY || "";
const ABACUS_BASE_URL =
    process.env.ABACUS_BASE_URL ||
    ENV.ABACUS_BASE_URL ||
    "https://apps.abacus.ai/api/chatllm/v1";
const ABACUS_MODEL =
    process.env.ABACUS_MODEL || ENV.ABACUS_MODEL || "deepseek-chat";

const TOOLS = [
    {
        name: "abacus_chat",
        description:
            "Genera una respuesta de texto con la suscripción Abacus.ai ChatLLM (OpenAI-compatible). Aprovecha el plan pagado para razonar, redactar, resumir o clasificar sin gastar tokens de Ollama local.",
        inputSchema: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: "Instrucción o mensaje del usuario (system opcional embebido).",
                },
                model: {
                    type: "string",
                    description:
                        "Modelo a usar (por defecto el de ABACUS_MODEL: deepseek-chat).",
                },
                system: {
                    type: "string",
                    description: "Prompt de sistema opcional para condicionar la respuesta.",
                },
                max_tokens: {
                    type: "number",
                    description: "Límite de tokens de salida (por defecto 2048).",
                },
                temperature: {
                    type: "number",
                    description: "Temperatura de muestreo entre 0 y 2 (por defecto 0.7).",
                },
            },
            required: ["prompt"],
        },
    },
    {
        name: "abacus_chat_json",
        description:
            "Genera una respuesta JSON estricta con Abacus.ai ChatLLM. Ideal para extraer datos estructurados y devolver resúmenes estadísticos compactos (< 300 tokens).",
        inputSchema: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: "Instrucción que exige una salida JSON válida.",
                },
                model: { type: "string" },
                schema_hint: {
                    type: "string",
                    description:
                        "Descripción del esquema JSON esperado (claves y tipos).",
                },
            },
            required: ["prompt"],
        },
    },
    {
        name: "abacus_list_models",
        description:
            "Lista los modelos disponibles en la suscripción Abacus.ai ChatLLM.",
        inputSchema: { type: "object", properties: {} },
    },
    {
        name: "abacus_status",
        description:
            "Devuelve el estado de configuración de la suscripción Abacus.ai (base URL, modelo por defecto, key presente).",
        inputSchema: { type: "object", properties: {} },
    },
];

function stripBearer(token) {
    return String(token || "").replace(/^Bearer\s+/i, "");
}

async function abacusRequest(endpoint, { method = "GET", body } = {}) {
    const token = stripBearer(ABACUS_API_KEY);
    if (!token) {
        throw new Error(
            "ABACUS_API_KEY no configurado. Asegúrate de que exista en .env.local."
        );
    }
    const base = ABACUS_BASE_URL.replace(/\/+$/, "");
    const url = `${base}${endpoint}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    if (!res.ok) {
        throw new Error(`Abacus API ${res.status}: ${text.slice(0, 500)}`);
    }
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
}

function chatCompletion({ prompt, model, system, max_tokens, temperature }) {
    const messages = [];
    if (system) messages.push({ role: "system", content: system });
    messages.push({ role: "user", content: prompt });

    return abacusRequest("/chat/completions", {
        method: "POST",
        body: {
            model: model || ABACUS_MODEL,
            messages,
            max_tokens: max_tokens || 2048,
            temperature: temperature === undefined ? 0.7 : temperature,
        },
    });
}

async function handleToolCall(name, args) {
    try {
        switch (name) {
            case "abacus_status": {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(
                                {
                                    abacus_api_key_present: Boolean(stripBearer(ABACUS_API_KEY)),
                                    abacus_base_url: ABACUS_BASE_URL,
                                    abacus_model: ABACUS_MODEL,
                                    active: Boolean(stripBearer(ABACUS_API_KEY)),
                                },
                                null,
                                2
                            ),
                        },
                    ],
                };
            }
            case "abacus_list_models": {
                const data = await abacusRequest("/models");
                const models = Array.isArray(data?.data)
                    ? data.data.map((m) => m.id || m.name || m)
                    : data;
                return {
                    content: [{ type: "text", text: JSON.stringify(models, null, 2) }],
                };
            }
            case "abacus_chat": {
                const data = await chatCompletion(args || {});
                const text =
                    data?.choices?.[0]?.message?.content ??
                    data?.raw ??
                    JSON.stringify(data);
                return { content: [{ type: "text", text }] };
            }
            case "abacus_chat_json": {
                const schemaHint = args.schema_hint
                    ? `\n\nEsquema JSON esperado: ${args.schema_hint}`
                    : "";
                const data = await chatCompletion({
                    prompt:
                        (args.prompt || "") +
                        '\n\nResponde EXCLUSIVAMENTE con JSON válido, sin texto adicional. No uses cercas de código.' +
                        schemaHint,
                    model: args.model,
                    system: "Eres un extractor. Devuelve SOLO JSON válido, sin markdown.",
                });
                const text =
                    data?.choices?.[0]?.message?.content ??
                    data?.raw ??
                    JSON.stringify(data);
                return { content: [{ type: "text", text }] };
            }
            default:
                return {
                    isError: true,
                    content: [{ type: "text", text: `Herramienta desconocida: ${name}` }],
                };
        }
    } catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: `ERROR: ${err.message}` }],
        };
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN: Soporte híbrido SDK oficial o JSON-RPC 2.0 Stdio Nativo
// ══════════════════════════════════════════════════════════════════════════════
async function startWithOfficialSDK() {
    const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
    const {
        StdioServerTransport,
    } = require("@modelcontextprotocol/sdk/server/stdio.js");
    const {
        CallToolRequestSchema,
        ListToolsRequestSchema,
    } = require("@modelcontextprotocol/sdk/types.js");

    const server = new Server(
        { name: "abacus-chatllm", version: "1.0.0" },
        { capabilities: { tools: {} } }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: TOOLS,
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        return handleToolCall(name, args || {});
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

function startNativeJsonRpcServer() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    function sendResponse(id, result, error = null) {
        const res = { jsonrpc: "2.0", id };
        if (error) res.error = error;
        else res.result = result;
        process.stdout.write(JSON.stringify(res) + "\n");
    }

    rl.on("line", (line) => {
        line = line.trim();
        if (!line) return;
        try {
            const msg = JSON.parse(line);
            if (msg.id === undefined || msg.id === null) return;
            const { id, method, params } = msg;
            switch (method) {
                case "initialize":
                    sendResponse(id, {
                        protocolVersion: "2024-11-05",
                        capabilities: { tools: {} },
                        serverInfo: { name: "abacus-chatllm", version: "1.0.0" },
                    });
                    break;
                case "tools/list":
                    sendResponse(id, { tools: TOOLS });
                    break;
                case "tools/call": {
                    const toolName = params ? params.name : null;
                    const toolArgs = params ? params.arguments || {} : {};
                    handleToolCall(toolName, toolArgs).then((result) =>
                        sendResponse(id, result)
                    );
                    break;
                }
                case "ping":
                    sendResponse(id, {});
                    break;
                default:
                    sendResponse(id, null, {
                        code: -32601,
                        message: `Método no soportado: ${method}`,
                    });
                    break;
            }
        } catch (parseErr) {
            sendResponse(null, null, {
                code: -32700,
                message: `Parse error: ${parseErr.message}`,
            });
        }
    });

    process.stderr.write(
        "[abacus-chatllm-mcp] Servidor MCP JSON-RPC activo en stdio (Zero-Dependency Native)\n"
    );
}

async function main() {
    try {
        await startWithOfficialSDK();
    } catch (err) {
        startNativeJsonRpcServer();
    }
}

main().catch((err) => {
    process.stderr.write(`[abacus-chatllm-mcp FATAL] ${err.stack || err}\n`);
    process.exit(1);
});