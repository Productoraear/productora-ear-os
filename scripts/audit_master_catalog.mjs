#!/usr/bin/env node
/**
 * 🛡️ EAR OS — AUDITOR DE INTEGRIDAD DEL CATÁLOGO MAESTRO (STREAMING)
 * Valida la sintaxis JSON completa, cuenta proveedores y audita la Doctrina del
 * Dato Verificado SIN cargar el archivo en memoria (apto para 100 MB+).
 *
 * Uso: node scripts/audit_master_catalog.mjs [ruta-al-json]
 * Salida: JSON de una línea (apto para parseo en CI).
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_FILE = path.resolve(__dirname, "..", "src", "data", "bodas-vendors-harvested.json");
const file = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_FILE;

const PLACEHOLDER_PHONE = "+34 693 693 048";

const WS = new Set([" ", "\t", "\r", "\n"]);
const HEX = /^[0-9a-fA-F]$/;

async function validateJson(target) {
  const stream = fs.createReadStream(target, { highWaterMark: 1 << 20 });
  const stack = [];
  let state = "value";
  let inString = false;
  let escaped = false;
  let hexLeft = 0;
  let afterString = "valueDone";
  let token = "";
  let line = 1;
  let providers = 0;
  let error = null;

  const fail = (msg) => {
    if (!error) error = `${msg} @linea ${line}`;
  };

  const finalizeNumber = () => {
    if (!/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(token)) fail(`número inválido "${token}"`);
    token = "";
  };

  const onChar = (c) => {
    if (error) return;
    if (inString) {
      if (hexLeft > 0) {
        if (!HEX.test(c)) fail("escape \\u con hex inválido");
        hexLeft--;
        return;
      }
      if (escaped) {
        if (!'"\\/bfnrtu'.includes(c)) fail(`escape inválido "\\${c}"`);
        else if (c === "u") hexLeft = 4;
        escaped = false;
        return;
      }
      if (c === "\\") escaped = true;
      else if (c === '"') {
        inString = false;
        state = afterString;
      } else if (c < " ") fail("carácter de control sin escapar en string");
      return;
    }

    switch (state) {
      case "value":
        if (WS.has(c)) return;
        if (c === "{") {
          stack.push({ type: "object" });
          state = "keyOrEnd";
        } else if (c === "[") {
          stack.push({ type: "array" });
          state = "valueOrEnd";
        } else if (c === '"') {
          inString = true;
          afterString = "valueDone";
        } else if (c === "-" || (c >= "0" && c <= "9")) {
          token = c;
          state = "number";
        } else if (c === "t" || c === "f" || c === "n") {
          token = c;
          state = "literal";
        } else {
          fail(`valor inesperado "${c}"`);
        }
        return;

      case "valueOrEnd":
        if (WS.has(c)) return;
        if (c === "]") {
          stack.pop();
          state = "valueDone";
        } else {
          state = "value";
          onChar(c);
        }
        return;

      case "keyOrEnd":
        if (WS.has(c)) return;
        if (c === "}") {
          stack.pop();
          state = "valueDone";
        } else if (c === '"') {
          inString = true;
          afterString = "colon";
        } else {
          fail(`clave inesperada "${c}"`);
        }
        return;

      case "key":
        if (WS.has(c)) return;
        if (c === '"') {
          inString = true;
          afterString = "colon";
        } else {
          fail(`clave inesperada "${c}"`);
        }
        return;

      case "colon":
        if (WS.has(c)) return;
        if (c === ":") state = "value";
        else fail(`se esperaba ':' y llegó "${c}"`);
        return;

      case "commaOrEnd": {
        if (WS.has(c)) return;
        const top = stack[stack.length - 1];
        if (top.type === "array") {
          if (c === ",") state = "value";
          else if (c === "]") {
            stack.pop();
            state = "valueDone";
          } else fail(`se esperaba ',' o ']' y llegó "${c}"`);
        } else {
          if (c === ",") state = "key";
          else if (c === "}") {
            stack.pop();
            state = "valueDone";
          } else fail(`se esperaba ',' o '}' y llegó "${c}"`);
        }
        return;
      }

      case "number":
        if (/[0-9eE+\-.]/.test(c)) {
          token += c;
          return;
        }
        finalizeNumber();
        state = "valueDone";
        onChar(c);
        return;

      case "literal":
        if (/[a-z]/.test(c)) {
          token += c;
          return;
        }
        if (!["true", "false", "null"].includes(token)) fail(`literal inválido "${token}"`);
        token = "";
        state = "valueDone";
        onChar(c);
        return;

      case "valueDone": {
        if (WS.has(c)) return;
        if (stack.length === 0) {
          state = "done";
          onChar(c);
          return;
        }
        state = "commaOrEnd";
        onChar(c);
        return;
      }

      case "done":
        if (!WS.has(c)) fail(`contenido tras el cierre del documento "${c}"`);
        return;

      default:
        fail(`estado desconocido ${state}`);
    }
  };

  await new Promise((resolve, reject) => {
    stream.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === "\n") line++;
        if (c === "}" && !inString && stack.length === 2 && stack[1].type === "object") providers++;
        onChar(c);
      }
    });
    stream.on("error", reject);
    stream.on("end", resolve);
  });

  if (inString) fail("string sin cerrar al final del archivo");
  if (stack.length > 0) fail(`${stack.length} contenedor(es) sin cerrar`);
  if (stack.length === 0 && state !== "done" && state !== "valueDone") fail(`documento incompleto (estado final: ${state})`);

  return { valid: error === null, error, providers: error === null ? providers : 0, lines: line };
}

async function collectStats(target) {
  const stats = { name: 0, slug: 0, province: 0, verifiedTrue: 0, verifiedFalse: 0, placeholder: 0 };
  const rl = readline.createInterface({
    input: fs.createReadStream(target, { encoding: "utf8", highWaterMark: 1 << 20 }),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (/^    "name": /.test(line)) stats.name++;
    else if (/^    "slug": /.test(line)) stats.slug++;
    else if (/^    "province": /.test(line)) stats.province++;
    else if (/^    "verified": true,?$/.test(line)) stats.verifiedTrue++;
    else if (/^    "verified": false,?$/.test(line)) stats.verifiedFalse++;
    else if (line.includes(`"phone": "${PLACEHOLDER_PHONE}"`)) stats.placeholder++;
  }
  return stats;
}

const run = async () => {
  if (!fs.existsSync(file)) {
    console.log(JSON.stringify({ file, exists: false, valid: false, error: "archivo inexistente" }));
    process.exitCode = 2;
    return;
  }
  const mb = +(fs.statSync(file).size / 1048576).toFixed(2);
  const started = Date.now();
  const json = await validateJson(file);
  const stats = await collectStats(file);
  const countsMatch = json.valid && stats.name === json.providers && stats.slug === json.providers && stats.province === json.providers;
  const verifiedFlagged = stats.verifiedTrue + stats.verifiedFalse;
  const doctrineOk = verifiedFlagged === json.providers && stats.placeholder <= stats.verifiedFalse;
  const report = {
    file,
    exists: true,
    sizeMB: mb,
    ms: Date.now() - started,
    valid: json.valid,
    error: json.error,
    providers: json.providers,
    countsMatch,
    stats,
    doctrine: doctrineOk ? "OK" : "REVISAR",
  };
  console.log(JSON.stringify(report));
  process.exitCode = countsMatch ? 0 : 1;
};

run().catch((err) => {
  console.error("❌ Auditoría fallida:", err);
  process.exit(2);
});
