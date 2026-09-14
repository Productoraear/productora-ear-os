"""
Productora EAR OS :: Agent Skills Lifecycle Bootstrapper
Framework: addyosmani/agent-skills (Google Chrome / Addy Osmani)
Metodología: Spec -> Plan -> Build -> Test -> Review -> Simplify -> Ship
Integra las 24 skills de ingeniería senior en .agents/skills y .agents/rules
"""

import os
import sys
import json
import urllib.request
import zipfile
import shutil
from pathlib import Path

WORKSPACE_ROOT = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
AGENTS_DIR = WORKSPACE_ROOT / ".agents"
SKILLS_DIR = AGENTS_DIR / "skills"
RULES_DIR = AGENTS_DIR / "rules"
GLOBAL_CONFIG_SKILLS = Path(r"C:\Users\M2-W10\.gemini\config\skills")

GITHUB_REPO_ZIP = "https://github.com/addyosmani/agent-skills/archive/refs/heads/main.zip"

CORE_LIFECYCLE_SKILLS = {
    "spec-driven-development": {
        "command": "/spec",
        "phase": "Spec (Define)",
        "principle": "Spec before code. No implementation without unambiguous acceptance criteria.",
        "description": "Especificación exhaustiva antes de codificar. Define user stories, contratos de datos y casos límite.",
        "anti_rationalization": [
            ("Esta tarea es demasiado pequeña para una spec", "Las tareas pequeñas sin spec crecen en complejidad oculta y regresiones"),
            ("Prefiero escribir el código y documentarlo luego", "La spec define el límite de éxito comprobable. Si no hay spec, no hay definición de terminado.")
        ]
    },
    "planning-and-task-breakdown": {
        "command": "/plan",
        "phase": "Plan (Deconstruct)",
        "principle": "Small, atomic, dependency-ordered tasks. Max 20-30 min per execution slice.",
        "description": "Desglose atómico de tareas en orden estricto de dependencias. Sincronizado con tasks_queue.json.",
        "anti_rationalization": [
            ("Puedo hacer todo en un solo paso", "Los monolitos impiden la validación incremental y provocan colapso de contexto"),
            ("El plan es obvio", "Si es obvio, desglosarlo en 3 pasos atómicos lleva 30 segundos y garantiza exit code 0.")
        ]
    },
    "test-driven-development": {
        "command": "/build",
        "phase": "Build (Implement)",
        "principle": "Red-Green-Refactor. Implement one slice at a time with strict type checks.",
        "description": "Construcción incremental con comprobación de tipos y validación de interfaces.",
        "anti_rationalization": [
            ("Los tipos 'any' ahorran tiempo", "Los 'any' rompen la gobernanza TypeScript y causan fallos silenciosos en producción."),
            ("Probaré en el navegador al terminar", "La validación continua en terminal detecta errores antes de contaminar el árbol git.")
        ]
    },
    "verification-and-testing": {
        "command": "/test",
        "phase": "Test (Verify)",
        "principle": "Tests are proof. Zero tolerance for unverified assumptions.",
        "description": "Validación estricta de compilación: npx tsc --noEmit -> Exit Code 0 y tests unitarios.",
        "anti_rationalization": [
            ("No cambió nada importante, seguro compila", "Verificar cuesta 3 segundos con tsc. Asumir cuesta horas de depuración en CI/CD."),
            ("Los tests son redundantes", "Los tests garantizan que los contratos de negocio (80/10/10, 350€, <14.250€) no se degraden.")
        ]
    },
    "code-review-and-quality": {
        "command": "/review",
        "phase": "Review (Gate)",
        "principle": "Gate quality before merge. Senior engineer adversarial review.",
        "description": "Revisión crítica de arquitectura, higiene de dependencias, seguridad y ausencia de AI Slop.",
        "anti_rationalization": [
            ("El código funciona, no hace falta review", "El código que funciona pero no cumple la doctrina S-Class genera deuda técnica letal."),
            ("Lo revisaré en el siguiente commit", "La revisión ocurre ANTES de fusionar o commitear.")
        ]
    },
    "code-simplification": {
        "command": "/code-simplify",
        "phase": "Simplify (Refactor)",
        "principle": "Clarity over cleverness. Eliminate dead code, unused props and over-abstraction.",
        "description": "Simplificación y poda de código innecesario. Menos líneas, máxima legibilidad y cero bloat.",
        "anti_rationalization": [
            ("Podríamos necesitar esta abstracción en el futuro", "YAGNI (You Aren't Gonna Need It). Código no utilizado es pasivo técnico."),
            ("Es una solución muy elegante", "Si requiere un párrafo para entenderla, simplifícala.")
        ]
    },
    "safe-deployment-and-shipping": {
        "command": "/ship",
        "phase": "Ship (Deploy)",
        "principle": "Faster is safer with verified quality gates. Repo < 50 MB, zero leaked secrets.",
        "description": "Despliegue soberano a Edge (Netlify/Vercel). Auditoría git previa y verificación de rutas 200.",
        "anti_rationalization": [
            ("Usemos git add -A para terminar rápido", "git add -A sin filtrar puede arrastrar bases de 200MB y romper la cuota de Netlify."),
            ("Los secrets de Stripe pueden ir en un script temporal", "VETO ESTRATÉGICO: Jamás exponer claves de pago en cliente o scripts sin sanitizar.")
        ]
    },
    "web-performance-optimization": {
        "command": "/webperf",
        "phase": "Optimize (Audit)",
        "principle": "Measure before you optimize. Golden Path: <=3 clicks, <=45 seconds.",
        "description": "Auditoría de rendimiento web, Core Web Vitals, carga OLED profunda y respuesta instantánea.",
        "anti_rationalization": [
            ("El rendimiento en local parece rápido", "Los usuarios móviles en 4G sufren el peso de imágenes no optimizadas y bundle excesivo."),
            ("Next.js ya optimiza todo solo", "Las dependencias cliente innecesarias engordan el hidratado DOM.")
        ]
    }
}

def create_local_skill(skill_dir: Path, skill_id: str, skill_meta: dict):
    os.makedirs(skill_dir, exist_ok=True)
    skill_file = skill_dir / "SKILL.md"
    
    rebuttals_table = "\n".join([
        f"| *\"{excuse}\"* | **{rebuttal}** |"
        for excuse, rebuttal in skill_meta["anti_rationalization"]
    ])

    content = f"""---
name: {skill_id}
description: {skill_meta["description"]}
lifecycle_phase: {skill_meta["phase"]}
command: {skill_meta["command"]}
framework: addyosmani/agent-skills
governance: ANTIGRAVITY OMEGA v7.0 (S-CLASS)
---

# {skill_meta["phase"]} :: {skill_id.replace('-', ' ').title()}

## 🎯 Principle
> **{skill_meta["principle"]}**

## ⚡ When to Use
Trigger this skill via the command `{skill_meta["command"]}` whenever entering the **{skill_meta["phase"]}** phase of an engineering task in Productora EAR OS.

## 📋 Step-by-Step Workflow
1. **Context Ingestion**: Read the relevant specification, tasks_queue.json objective, or affected files without loading heavy datasets into LLM context (ZTM Protocol).
2. **Execution Checkpoint**: Follow the defined engineering checklist without taking shortcuts.
3. **Validation & Quality Gate**: Verify that all constraints are satisfied.
4. **Handoff**: Document verified facts and transition cleanly to the next lifecycle stage.

## 🛡️ Anti-Rationalization Table (Excuses vs. Rebuttals)
Do NOT skip steps. Consult this table when tempted to bypass engineering rigor:

| Common Agent Excuse | Senior Engineer Rebuttal |
| :--- | :--- |
{rebuttals_table}

## ✅ Exit Criteria
- Output is verified with zero ambiguous assumptions.
- In Next.js / TypeScript code: `npx tsc --noEmit` returns **Exit Code 0**.
- Git repository size remains protected (< 50 MB total tree).
"""
    with open(skill_file, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  [OK] Skill creada: {skill_file.relative_to(WORKSPACE_ROOT)}")

def bootstrap():
    print("=" * 70)
    print("   PRODUCTORA EAR OS :: AGENT SKILLS BOOTSTRAPPER")
    print("   Framework: addyosmani/agent-skills (Spec -> Plan -> Build -> Test -> Review -> Simplify -> Ship)")
    print("=" * 70)

    # 1. Asegurar directorios
    os.makedirs(SKILLS_DIR, exist_ok=True)
    os.makedirs(RULES_DIR, exist_ok=True)

    # 2. Descargar o generar las 8 skills troncales
    print("\n[FASE 1/3] Desplegando Colección de Agent Skills en .agents/skills/...")
    for skill_id, meta in CORE_LIFECYCLE_SKILLS.items():
        target_folder = SKILLS_DIR / skill_id
        create_local_skill(target_folder, skill_id, meta)

    # 3. Crear Regla de Gobernanza .agents/rules/04-agent-skills-lifecycle.md
    print("\n[FASE 2/3] Integrando Doctrina Agent Skills en .agents/rules/...")
    rule_file = RULES_DIR / "04-agent-skills-lifecycle.md"
    rule_content = """# GOBERNANZA AGENT SKILLS :: CICLO DE VIDA DE INGENIERÍA S-CLASS
Basado en `addyosmani/agent-skills` (Addy Osmani, Google Chrome).

Toda tarea ejecutada en Productora EAR OS debe transitar por las 7 puertas de calidad:

```
[SPEC] -> [PLAN] -> [BUILD] -> [TEST] -> [REVIEW] -> [SIMPLIFY] -> [SHIP]
```

## 1. /spec (Especificación Rigurosa)
- Jamás comenzar a programar sin definir el contrato de entrada, salida y criterios de aceptación.
- Prohibido el "vibe coding" o suposiciones no contrastadas.

## 2. /plan (Desglose Atómico)
- Tareas de máxima granularidad en `.antigravity/tasks_queue.json`.
- Orden lógico de dependencias: interfaces y tipos primero, lógica de negocio después, vistas al final.

## 3. /build (Construcción Incremental)
- Implementar una sola rodaja (slice) a la vez.
- Cero tipos `any` implícitos. Next.js App Router con Server Components por defecto.

## 4. /test (Verificación Continua)
- Los tests y la telemetría son la prueba objetiva de funcionamiento.
- Cada tarea debe terminar con `npx tsc --noEmit` -> Exit Code 0.

## 5. /review (Auditoría Adversarial)
- Revisión de código enfocada en seguridad, HSTS, CSP y protección de claves (`STRIPE_SECRET_KEY`).
- Respeto inmutable de reglas de negocio: Split 80/10/10, Caché 350 €, Contrato Menor < 14.250 €.

## 6. /code-simplify (Poda y Claridad)
- Eliminar abstracciones prematuras y código muerto.
- Mantener los componentes limpios y legibles.

## 7. /ship (Despliegue Soberano)
- Verificación de estado Git (`git status`), protección de peso (<50 MB) y despliegue a Netlify/Vercel Edge.
"""
    with open(rule_file, "w", encoding="utf-8") as f:
        f.write(rule_content)
    print(f"  [OK] Regla de ciclo de vida creada: {rule_file.relative_to(WORKSPACE_ROOT)}")

    # 4. Intentar absorción en vivo desde el repo oficial de GitHub
    print("\n[FASE 3/3] Sincronizando con repositorio oficial addyosmani/agent-skills...")
    temp_zip = WORKSPACE_ROOT / ".agents" / "agent_skills_repo.zip"
    try:
        req = urllib.request.Request(
            GITHUB_REPO_ZIP,
            headers={"User-Agent": "Productora-EAR-OS-AgentSkills/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as response, open(temp_zip, 'wb') as out_file:
            shutil.copyfileobj(response, out_file)
        
        print("  [OK] Repositorio descargado. Extrayendo skills y referencias...")
        with zipfile.ZipFile(temp_zip, 'r') as zip_ref:
            for member in zip_ref.namelist():
                if "skills/" in member or "references/" in member:
                    # Extraer manteniendo estructura
                    parts = member.split('/', 1)
                    if len(parts) > 1 and parts[1]:
                        target_path = AGENTS_DIR / parts[1]
                        if member.endswith('/'):
                            os.makedirs(target_path, exist_ok=True)
                        else:
                            os.makedirs(target_path.parent, exist_ok=True)
                            with zip_ref.open(member) as source, open(target_path, "wb") as target:
                                shutil.copyfileobj(source, target)
        if temp_zip.exists():
            temp_zip.unlink()
        print("  [OK] Sincronización completa con addyosmani/agent-skills de GitHub.")
    except Exception as e:
        print(f"  [AVISO] Conexión directa a GitHub limitada ({e}). Las 8 skills maestras locales están 100% operativas.")

    print("\n" + "=" * 70)
    print("   AGENT SKILLS COMPLETAMENTE INSTALADO Y OPERATIVO EN EAR OS")
    print("   Comandos Disponibles: /spec, /plan, /build, /test, /review, /code-simplify, /ship")
    print("=" * 70)

if __name__ == "__main__":
    bootstrap()
