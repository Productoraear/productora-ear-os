#!/usr/bin/env node
/**
 * ══════════════════════════════════════════════════════════════════════════════
 * ANTIGRAVITY BRIDGE MCP SERVER — EAR OS V2 (BARE-METAL CLINE/QWEN ORCHESTRATOR)
 * Protocol: Model Context Protocol (MCP) JSON-RPC 2.0 via Stdio Transport
 * ══════════════════════════════════════════════════════════════════════════════
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const WORKSPACE = process.env.WORKSPACE_ROOT || path.resolve(__dirname, "..", "..");
const QUEUE_FILE = path.join(WORKSPACE, ".antigravity", "tasks_queue.json");

const TOOLS = [
  {
    name: "get_pending_task",
    description: "Recupera la siguiente tarea crítica en estado PENDING desde la cola de Antigravity.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "execute_powershell_script",
    description: "Ejecuta un script PowerShell soberano en el entorno local de EAR OS.",
    inputSchema: {
      type: "object",
      properties: {
        scriptRelativePath: {
          type: "string",
          description: "Ruta relativa del script PowerShell desde la raíz del workspace (ej: scripts/gsc_coverage_extractor_and_purge.ps1)"
        }
      },
      required: ["scriptRelativePath"]
    }
  },
  {
    name: "execute_sovereign_script",
    description: "Alias de execute_powershell_script para ejecutar scripts de gobernanza o ingestión.",
    inputSchema: {
      type: "object",
      properties: {
        scriptRelativePath: { type: "string" }
      },
      required: ["scriptRelativePath"]
    }
  },
  {
    name: "update_task_status",
    description: "Actualiza el estado y logs de una tarea en la cola .antigravity/tasks_queue.json.",
    inputSchema: {
      type: "object",
      properties: {
        taskId: { type: "string", description: "Identificador de la tarea (ej: TAREA_14_GSC_EXTRACTOR_AND_SEO_PURGE o TAREA_15_INTENT_ROUTING_AND_CANONICAL_SHIELD)" },
        status: { type: "string", enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] },
        log: { type: "string", description: "Condensado o resumen de ejecución" }
      },
      required: ["taskId", "status"]
    }
  },
  {
    name: "report_execution_result",
    description: "Alias de update_task_status para registrar el resultado final de ejecución del obrero local.",
    inputSchema: {
      type: "object",
      properties: {
        taskId: { type: "string" },
        status: { type: "string", enum: ["COMPLETED", "FAILED"] },
        exitCode: { type: "number" },
        log: { type: "string" }
      },
      required: ["taskId", "status"]
    }
  }
];

function getPendingTask() {
  if (!fs.existsSync(QUEUE_FILE)) {
    return { error: `Cola no encontrada en ${QUEUE_FILE}` };
  }
  try {
    const raw = fs.readFileSync(QUEUE_FILE, "utf-8");
    const queue = JSON.parse(raw);

    let taskList = [];
    if (Array.isArray(queue)) {
      taskList = queue;
    } else if (queue && Array.isArray(queue.tasks)) {
      taskList = queue.tasks;
    } else if (queue && (queue.status === "PENDING")) {
      return queue;
    }

    const pending = taskList.find(t => t.status === "PENDING");
    if (pending) {
      return pending;
    }
    return { message: "NO_PENDING_TASKS", timestamp: new Date().toISOString() };
  } catch (err) {
    return { error: `Error leyendo tareas: ${err.message}` };
  }
}

function executeScript(scriptRelativePath) {
  const fullPath = path.resolve(WORKSPACE, scriptRelativePath);
  if (!fs.existsSync(fullPath)) {
    return `ERROR: El archivo no existe en ${fullPath}`;
  }
  try {
    const cmd = `powershell.exe -ExecutionPolicy Bypass -File "${fullPath}"`;
    const stdout = execSync(cmd, {
      cwd: WORKSPACE,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
      timeout: 300000
    });
    return stdout || "[SCRIPT EXECUTED WITHOUT OUTPUT]";
  } catch (err) {
    const errorDetails = err.stdout ? `\nSTDOUT: ${err.stdout}` : "";
    const stderrDetails = err.stderr ? `\nSTDERR: ${err.stderr}` : "";
    return `ERROR (Exit Code ${err.status || 1}): ${err.message}${errorDetails}${stderrDetails}`;
  }
}

function updateTaskStatus(taskId, status, log, exitCode) {
  if (!fs.existsSync(QUEUE_FILE)) {
    return `ERROR: Cola no encontrada en ${QUEUE_FILE}`;
  }
  try {
    const raw = fs.readFileSync(QUEUE_FILE, "utf-8");
    let queue = JSON.parse(raw);
    let found = false;

    let taskList = [];
    if (Array.isArray(queue)) {
      taskList = queue;
    } else if (queue && Array.isArray(queue.tasks)) {
      taskList = queue.tasks;
    } else if (queue && (queue.id === taskId || queue.task_id === taskId)) {
      queue.status = status;
      if (log) queue.last_log = log;
      if (exitCode !== undefined) queue.exit_code = exitCode;
      if (status === "COMPLETED") queue.completed_at = new Date().toISOString();
      found = true;
    }

    if (!found && taskList.length > 0) {
      const task = taskList.find(t => t.id === taskId || t.task_id === taskId);
      if (task) {
        task.status = status;
        if (log) task.last_log = log;
        if (exitCode !== undefined) task.exit_code = exitCode;
        if (status === "COMPLETED") {
          task.completed_at = new Date().toISOString();
          // Si existe array completed en el contenedor de cola, registramos resumen
          if (queue.completed && Array.isArray(queue.completed)) {
            const alreadyInCompleted = queue.completed.some(c => c.id === taskId);
            if (!alreadyInCompleted) {
              queue.completed.push({
                id: taskId,
                status: "COMPLETED",
                summary: log || task.title || "Ejecutado por Qwen 3.8 / Cline Local",
                completed_at: task.completed_at
              });
            }
          }
        }
        found = true;
      }
    }

    if (!found) {
      return `WARNING: Tarea ${taskId} no encontrada en la cola activa.`;
    }

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2), "utf-8");
    return `Task ${taskId} actualizada con éxito a ${status}.`;
  } catch (err) {
    return `ERROR actualizando estado de tarea: ${err.message}`;
  }
}

function handleToolCall(name, args) {
  switch (name) {
    case "get_pending_task": {
      const task = getPendingTask();
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }]
      };
    }
    case "execute_powershell_script":
    case "execute_sovereign_script": {
      const scriptPath = args.scriptRelativePath || args.script_path || args.path;
      if (!scriptPath) {
        return {
          isError: true,
          content: [{ type: "text", text: "ERROR: Falta el parámetro obligatorio 'scriptRelativePath'" }]
        };
      }
      const output = executeScript(scriptPath);
      return {
        content: [{ type: "text", text: output }]
      };
    }
    case "update_task_status":
    case "report_execution_result": {
      const taskId = args.taskId || args.task_id;
      const status = args.status;
      const log = args.log || args.logs;
      const exitCode = args.exitCode !== undefined ? args.exitCode : args.exit_code;
      if (!taskId || !status) {
        return {
          isError: true,
          content: [{ type: "text", text: "ERROR: Parámetros 'taskId' y 'status' son obligatorios" }]
        };
      }
      const res = updateTaskStatus(taskId, status, log, exitCode);
      return {
        content: [{ type: "text", text: res }]
      };
    }
    default:
      return {
        isError: true,
        content: [{ type: "text", text: `Herramienta desconocida: ${name}` }]
      };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN: Soporte híbrido SDK oficial o JSON-RPC 2.0 Stdio Nativo
// ══════════════════════════════════════════════════════════════════════════════
async function startWithOfficialSDK() {
  const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
  const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
  const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

  const server = new Server(
    { name: "antigravity-bridge", version: "2.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS
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
    terminal: false
  });

  function sendResponse(id, result, error = null) {
    const res = {
      jsonrpc: "2.0",
      id
    };
    if (error) {
      res.error = error;
    } else {
      res.result = result;
    }
    process.stdout.write(JSON.stringify(res) + "\n");
  }

  rl.on("line", (line) => {
    line = line.trim();
    if (!line) return;

    try {
      const msg = JSON.parse(line);

      // Notificaciones (sin 'id')
      if (msg.id === undefined || msg.id === null) {
        return;
      }

      const { id, method, params } = msg;

      switch (method) {
        case "initialize":
          sendResponse(id, {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: "antigravity-bridge",
              version: "2.0.0"
            }
          });
          break;

        case "tools/list":
          sendResponse(id, { tools: TOOLS });
          break;

        case "tools/call": {
          const toolName = params ? params.name : null;
          const toolArgs = params ? params.arguments || {} : {};
          const result = handleToolCall(toolName, toolArgs);
          sendResponse(id, result);
          break;
        }

        case "ping":
          sendResponse(id, {});
          break;

        default:
          sendResponse(id, null, {
            code: -32601,
            message: `Método no soportado: ${method}`
          });
          break;
      }
    } catch (parseErr) {
      sendResponse(null, null, {
        code: -32700,
        message: `Parse error: ${parseErr.message}`
      });
    }
  });

  process.stderr.write("[antigravity-bridge-mcp] Servidor MCP JSON-RPC activo en stdio (Modo Zero-Dependency Native)\n");
}

async function main() {
  try {
    await startWithOfficialSDK();
  } catch (err) {
    // Si @modelcontextprotocol/sdk no está instalado en node_modules,
    // opera inmediatamente con el transport nativo JSON-RPC 2.0 sin fallar.
    startNativeJsonRpcServer();
  }
}

main().catch((err) => {
  process.stderr.write(`[antigravity-bridge-mcp FATAL] ${err.stack || err}\n`);
  process.exit(1);
});
