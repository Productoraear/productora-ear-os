import os
import glob
import json
import csv

# 1. Localizar el archivo de 150 MB
search_dirs = ["scripts/reports", "C:/Users/M2-W10/Desktop", "."]
target_file = None

for d in search_dirs:
    if os.path.exists(d):
        for f in glob.glob(os.path.join(d, "*auditoria*.csv")) + glob.glob(os.path.join(d, "*wiztree*.csv")) + glob.glob(os.path.join(d, "*.csv")):
            try:
                size_mb = os.path.getsize(f) / (1024 * 1024)
                if size_mb > 30:  # Archivo masivo
                    target_file = f
                    break
            except:
                pass
    if target_file:
        break

if not target_file:
    print("[!] No se detectó automáticamente el archivo masivo. Comprobando directorio actual...")
    for f in glob.glob("*.csv") + glob.glob("scripts/reports/*.csv"):
        if os.path.getsize(f) > 10 * 1024 * 1024:
            target_file = f
            break

if not target_file:
    print("[!] Error: No se ha encontrado el archivo de ~150 MB.")
    exit(1)

print(f">> [*] Procesando archivo masivo: {target_file}")
print(f">> [*] Tamano real: {os.path.getsize(target_file) / (1024*1024):.2f} MB")

# Estructura del Resumen de Inteligencia
summary = {
    "archivo_origen": target_file,
    "tamano_csv_mb": round(os.path.getsize(target_file) / (1024 * 1024), 2),
    "total_archivos_registrados": 0,
    "peso_total_gb": 0.0,
    "distribucion_por_categoria": {},
    "top_carpetas_raiz_peso_mb": {},
    "top_extensiones": {},
    "archivos_desviados_criticos": []
}

with open(target_file, 'r', encoding='latin1', errors='ignore') as f:
    reader = csv.reader(f)
    header = next(reader, None)
    
    for row in reader:
        if not row:
            continue
        summary["total_archivos_registrados"] += 1
        
        # Extracción flexible según columnas detectadas
        nombre = row[1] if len(row) > 1 else ""
        ext = row[2] if len(row) > 2 else ""
        tamano_mb = 0.0
        try:
            tamano_mb = float(row[3]) if len(row) > 3 else 0.0
        except:
            tamano_mb = 0.0
            
        ruta = row[4] if len(row) > 4 else ""
        categoria = row[5] if len(row) > 5 else "GENERAL"
        estado = row[7] if len(row) > 7 else ""

        summary["peso_total_gb"] += (tamano_mb / 1024.0)

        # 1. Conteo por Categoría
        summary["distribucion_por_categoria"][categoria] = summary["distribucion_por_categoria"].get(categoria, 0) + 1

        # 2. Conteo por Extensión
        if ext:
            summary["top_extensiones"][ext] = summary["top_extensiones"].get(ext, 0) + 1

        # 3. Peso por Carpeta Raíz
        partes = ruta.split("\\")
        if len(partes) > 1:
            raiz = partes[0] + "\\" + partes[1] if len(partes) > 2 else partes[0]
            summary["top_carpetas_raiz_peso_mb"][raiz] = round(summary["top_carpetas_raiz_peso_mb"].get(raiz, 0.0) + tamano_mb, 2)

        # 4. Aislar desviados de alto valor (muestras clave)
        if estado == "DESVIADO" and len(summary["archivos_desviados_criticos"]) < 25:
            summary["archivos_desviados_criticos"].append({
                "archivo": nombre,
                "tamano_mb": tamano_mb,
                "ruta_actual": ruta,
                "categoria": categoria
            })

summary["peso_total_gb"] = round(summary["peso_total_gb"], 2)

# Ordenar diccionarios por volumen
summary["top_extensiones"] = dict(sorted(summary["top_extensiones"].items(), key=lambda x: x[1], reverse=True)[:15])
summary["top_carpetas_raiz_peso_mb"] = dict(sorted(summary["top_carpetas_raiz_peso_mb"].items(), key=lambda x: x[1], reverse=True)[:15])

# Guardar destilado ligero
output_json = "scripts/reports/RESUMEN_EJECUTIVO_H.json"
os.makedirs("scripts/reports", exist_ok=True)

with open(output_json, 'w', encoding='utf-8') as out_f:
    json.dump(summary, out_f, indent=2, ensure_ascii=False)

print("\n" + "="*70)
print("   [OK] CONDENSACIÓN COMPLETADA: 150 MB -> 30 KB")
print("="*70)
print(f"Total Archivos Mapeados: {summary['total_archivos_registrados']}")
print(f"Peso Total Analizado:    {summary['peso_total_gb']} GB")
print(f"Destilado Ejecutivo en:  {output_json}")
