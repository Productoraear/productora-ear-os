# PROTOCOLO DE IGNICIÓN EAR_OS_GOLD_V2
# Objetivo: Automatización Total de Infraestructura y Saneamiento

Write-Host "🚀 Iniciando Protocolo de Resurrección S-Class..." -ForegroundColor Cyan

# --- FASE 1: INFRAESTRUCTURA MCP ---
Write-Host "📂 Configurando MCP Ollama en C:\Ollama-mcp..." -ForegroundColor Yellow
if (!(Test-Path "C:\Ollama-mcp")) {
    New-Item -ItemType Directory -Path "C:\Ollama-mcp" -Force
}
Set-Location "C:\Ollama-mcp"
git clone https://github.com/NightTrek/Ollama-mcp .
npm install
npm run build

# --- FASE 2: SANEAMIENTO DE DEPENDENCIAS ---
Write-Host "🧹 Saneando chasis de dependencias..." -ForegroundColor Yellow
Set-Location $PSScriptRoot # Regresa a la raíz del proyecto
npm uninstall react-is
npm install --save-dev @types/node@latest @types/react@latest @types/react-dom@latest zod @supabase/supabase-js

# --- FASE 3: INYECCIÓN DE NÚCLEOS S-CLASS ---
Write-Host "🧪 Inyectando Singleton de Supabase y EternalMemory..." -ForegroundColor Yellow

# 1. supabaseClient.ts
$supabaseClient = @"
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables de Supabase ausentes en .env.local');
}
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
"@
Set-Content -Path "src/lib/intelligence/supabaseClient.ts" -Value $supabaseClient -Force

# 2. EternalMemory.ts
$eternalMemory = @"
import { supabase } from './supabaseClient';
export const EternalMemory = {
  status: 'READY',
  save: async (key: string, value: any) => {
      const { error } = await supabase.from('events').insert([{ title: key, description: JSON.stringify(value) }]);
      return !error;
  },
  load: async (key: string) => {
      const { data } = await supabase.from('events').select('*').eq('title', key).single();
      return data;
  }
};
"@
Set-Content -Path "src/lib/intelligence/EternalMemory.ts" -Value $eternalMemory -Force

# 3. SovereignMemoryTest.tsx
$memoryTest = @"
'use client';
import React, { useEffect, useState } from 'react';
import { EternalMemory } from '../lib/intelligence/EternalMemory';

export default function SovereignMemoryTest({ active = true }) {
  const [status, setStatus] = useState('Verificando...');
  useEffect(() => {
    if (!active) return;
    EternalMemory.save('test_ping', 'ACTIVE').then(s => 
      setStatus(s ? 'Soberanía: 100%' : 'Error de Enlace')
    );
  }, [active]);
  if (!active) return null;
  return <div className="p-2 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">MEMORIA: {status}</div>;
}
"@
Set-Content -Path "src/components/SovereignMemoryTest.tsx" -Value $memoryTest -Force

Write-Host "✅ Fase de Inyección Completada. Estructura saneada." -ForegroundColor Green
Write-Host "👉 PRÓXIMO PASO: Ejecuta el SQL en el dashboard de Supabase y reinicia Cline." -ForegroundColor Cyan