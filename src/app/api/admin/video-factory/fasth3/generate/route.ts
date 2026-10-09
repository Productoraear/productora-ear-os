import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Endpoint S-Class: Despachador de Prompts hacia FastH3 / ComfyUI (Puerto 8190)
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { 
      prompt, 
      soundscape = "Cinematic acoustic ambiance, high-fidelity stereo room reverberation.",
      music = "Subtle acoustic classical guitar and piano chords with warm low-end resonance.",
      width = 1344, 
      height = 768, 
      durationSeconds = 5, 
      seed = Math.floor(Math.random() * 1000000000) 
    } = payload;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "El prompt cinematográfico es obligatorio." }, { status: 400 });
    }

    const workflowPath = path.join("H:", "ComfyUI", "workflows", "video_fastvideo_fasth3_t2v.json");
    if (!fs.existsSync(workflowPath)) {
      return NextResponse.json({ error: "Plantilla oficial video_fastvideo_fasth3_t2v.json no encontrada en H:\\ComfyUI." }, { status: 500 });
    }

    const workflowRaw = fs.readFileSync(workflowPath, "utf-8");
    const workflow = JSON.parse(workflowRaw);

    // Formatear el Prompt integral con audio y música como exige FastH3
    const fullIntegratedPrompt = `integrated_multimodal_description: ${prompt.trim()}\noverall_soundscape: ${soundscape.trim()}\nnon_diegetic_music: ${music.trim()}`;

    // Buscar y parchear el macro-nodo FastH3 (Node 105)
    let patched = false;
    if (Array.isArray(workflow.nodes)) {
      for (const node of workflow.nodes) {
        if (node.id === 105 && Array.isArray(node.widgets_values)) {
          node.widgets_values[0] = fullIntegratedPrompt;
          node.widgets_values[1] = Number(width);
          node.widgets_values[2] = Number(height);
          node.widgets_values[3] = Number(durationSeconds);
          node.widgets_values[4] = Number(seed);
          patched = true;
          break;
        }
      }
    }

    if (!patched) {
      return NextResponse.json({ error: "No se pudo localizar el nodo FastH3 (Node 105) en el workflow." }, { status: 500 });
    }

    // Comprobar que ComfyUI esté vivo en 8190
    const comfyUrl = "http://127.0.0.1:8190";
    try {
      const ping = await fetch(`${comfyUrl}/system_stats`, { signal: AbortSignal.timeout(3000) });
      if (!ping.ok) throw new Error("ComfyUI no responde");
    } catch {
      return NextResponse.json({ 
        error: "ComfyUI no está conectado en http://127.0.0.1:8190. Ejecuta H:\\ComfyUI\\START_FASTH3_COMFYUI.bat para iniciar el motor." 
      }, { status: 503 });
    }

    // Convertir workflow UI a formato ejecutable de ComfyUI Prompt API
    // En ComfyUI, podemos enviar el workflow directamente o la estructura /prompt
    const promptPayload = {
      extra_data: { extra_pnginfo: { workflow } },
      workflow: workflow
    };

    console.log(`[FASTH3_DISPATCH] Enviando prompt a ComfyUI 8190 (Seed: ${seed})...`);

    const response = await fetch(`${comfyUrl}/api/workflow/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow,
        inputs: {
          prompt: fullIntegratedPrompt,
          width,
          height,
          duration: durationSeconds,
          seed
        }
      }),
    }).catch(async () => {
      // Fallback a POST /prompt estándar
      return await fetch(`${comfyUrl}/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptPayload),
      });
    });

    const resData = await response.json().catch(() => ({}));

    return NextResponse.json({
      success: true,
      message: "Prompt inyectado con éxito en el motor FastH3 (AMD RX 7900 XTX).",
      promptId: resData.prompt_id || `FH3-${Date.now()}`,
      seed,
      fullPrompt: fullIntegratedPrompt,
      comfyUrl: "http://127.0.0.1:8190"
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error interno";
    console.error("[FASTH3_API_ERROR]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
