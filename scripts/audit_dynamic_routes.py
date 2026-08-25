import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

import os

app_dir = 'src/app'
vulnerabilities = []

for root, dirs, files in os.walk(app_dir):
    for file in files:
        if file in ['page.tsx', 'page.jsx']:
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # 1. Acceso síncrono a params (Next.js 15) en server components
            if 'use client' not in content:
                if 'params.' in content and 'await params' not in content and 'Promise' not in content:
                    vulnerabilities.append((path, 'RIESGO HIGH: Acceso síncrono directo a params.x'))

                if 'searchParams.' in content and 'await searchParams' not in content and 'Promise' not in content:
                    vulnerabilities.append((path, 'RIESGO MEDIUM: Acceso síncrono a searchParams.x'))

            # 2. Fugas entre verticales
            if 'arsenal' in path and ('Vimume' in content or 'Mariachi' in content or 'Boda' in content):
                vulnerabilities.append((path, 'RIESGO CRÍTICO: Componente B2C/VIMUME inyectado en Arsenal B2B'))

            if 'b2g' in path and ('Wedding' in content or 'Novios' in content):
                vulnerabilities.append((path, 'RIESGO CRÍTICO: Contexto B2C inyectado en B2G Licitaciones'))

print('\n=== INFORME DE SALUD DE PLANTILLAS DINÁMICAS ===')
if not vulnerabilities:
    print('✅ El 100% de las rutas dinámicas cumplen con el estándar de aislamiento y params/searchParams asíncronos.')
else:
    for path, issue in vulnerabilities:
        print(f'❌ {path}\n   ↳ {issue}')

