/**
 * test_n8n_commercial_fleet.cjs
 * W23_T01_N8N_COMMERCIAL_FLEET — Validación de esquema n8n v1 para la Flota Comercial.
 *
 * Verifica sobre los 3 workflows comercial-*.json:
 *   1) Estructura estándar n8n: { name, nodes[], connections{}, active:true, settings{} }
 *   2) Presencia de nodos: webhook, code, respondToWebhook
 *   3) Sintaxis JS válida en cada nodo Code (vm.Script compile check)
 *   4) Integridad de conexiones (origen/destino existen en nodes)
 *
 * Salida: resumen JSON < 300 tokens. Exit Code 0 = flota lista para importar.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const WF_DIR = path.join(__dirname, "..", "n8n-workflows");
const FILES = [
  "comercial-b2b-quote.json",
  "comercial-stripe-price-lock.json",
  "comercial-finca-partnership.json"
];
const REQUIRED_TYPES = [
  "n8n-nodes-base.webhook",
  "n8n-nodes-base.code",
  "n8n-nodes-base.respondToWebhook"
];

const results = [];
let allPass = true;

for (const file of FILES) {
  const abs = path.join(WF_DIR, file);
  const r = { file, ok: true, errors: [] };
  try {
    const parsed = JSON.parse(fs.readFileSync(abs, "utf8"));

    // 1) Estructura estándar n8n v1
    if (typeof parsed.name !== "string" || parsed.name.trim() === "") {
      r.ok = false;
      r.errors.push("name no es string no vacío");
    }
    if (!Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
      r.ok = false;
      r.errors.push("nodes no es array no vacío");
    }
    if (typeof parsed.connections !== "object" || parsed.connections === null) {
      r.ok = false;
      r.errors.push("connections no es objeto");
    }
    if (parsed.active !== true) {
      r.ok = false;
      r.errors.push("active !== true (debe importarse activo)");
    }
    if (typeof parsed.settings !== "object" || parsed.settings === null) {
      r.ok = false;
      r.errors.push("settings no es objeto");
    }

    // 2) Tipos de nodo requeridos
    const types = parsed.nodes.map((n) => n.type);
    for (const t of REQUIRED_TYPES) {
      if (!types.includes(t)) {
        r.ok = false;
        r.errors.push("falta nodo tipo " + t);
      }
    }

    // 2bis) Webhook trigger configurado correctamente
    const webhook = parsed.nodes.find((n) => n.type === "n8n-nodes-base.webhook");
    if (webhook) {
      const p = webhook.parameters || {};
      if (p.httpMethod !== "POST") {
        r.ok = false;
        r.errors.push("webhook httpMethod != POST");
      }
      if (p.responseMode !== "responseNode") {
        r.ok = false;
        r.errors.push("webhook responseMode != responseNode (requiere Respond to Webhook node)");
      }
      if (typeof p.path !== "string" || p.path.trim() === "") {
        r.ok = false;
        r.errors.push("webhook path vacío");
      }
    }

    // 3) Sintaxis JS de los nodos Code
    // n8n envuelve el código dentro de una función; compilar sin wrapper daría
    // "Illegal return statement". Reproducimos el sandbox real de n8n.
    for (const n of parsed.nodes) {
      if (n.type === "n8n-nodes-base.code" && n.parameters && typeof n.parameters.jsCode === "string") {
        try {
          new vm.Script("(function () {\n" + n.parameters.jsCode + "\n})");
        } catch (e) {
          r.ok = false;
          r.errors.push("jsCode de \"" + n.name + "\" no compila: " + e.message);
        }
      }
    }

    // 4) Conexiones referencian nodos existentes
    const names = new Set(parsed.nodes.map((n) => n.name));
    for (const [src, conns] of Object.entries(parsed.connections || {})) {
      if (!names.has(src)) {
        r.ok = false;
        r.errors.push("conexión origen inexistente: " + src);
      }
      const mains = conns.main || [];
      for (const outputs of mains) {
        for (const out of outputs) {
          if (!names.has(out.node)) {
            r.ok = false;
            r.errors.push("conexión destino inexistente: " + out.node);
          }
        }
      }
    }
  } catch (e) {
    r.ok = false;
    r.errors.push("JSON parse error: " + e.message);
  }
  if (!r.ok) allPass = false;
  results.push(r);
}

const summary = {
  test: "test_n8n_commercial_fleet",
  workflowsValidated: FILES.length,
  pass: allPass,
  results
};

console.log(JSON.stringify(summary, null, 2));
process.exit(allPass ? 0 : 1);
