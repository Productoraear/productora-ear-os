import os
import re
import json
from pathlib import Path

# Paths
catalog_path = Path("reports/velocity_media_master_catalog.json")
with open(catalog_path, "r", encoding="utf-8") as f:
    web_catalog = json.load(f)

media_root = Path(r"D:\02_PERSONAL_EDWIN\06_Video_y_Media")

# Collect all files from media_root
all_local_files = []
for root, dirs, files in os.walk(media_root):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in [".mp4", ".mov", ".m4a", ".mp3", ".mts", ".mkv"]:
            p = os.path.join(root, f)
            try:
                sz = os.path.getsize(p)
                all_local_files.append({
                    "filename": f,
                    "clean_name": re.sub(r'(_reparado|\(2\)|\.mp4|\.mov|\.mts).*$', '', f, flags=re.IGNORECASE).strip(),
                    "path": p,
                    "size_mb": round(sz / (1024 * 1024), 2)
                })
            except Exception:
                pass

print(f"Total archivos multimedia analizados en 06_Video_y_Media: {len(all_local_files)}")

# Build smart matching rules for Velocity Courses
# Course keywords & themes
course_match_rules = {
    "Funnels": ["funnel", "funnels", "visión estratégica de los funnels", "los 4 pilares de un funnel", "creando el modelo económico"],
    "Copywriting": ["copy", "copywriting", "gancho", "anuncio", "persuasión", "comunicación de impacto"],
    "Metodología de Atención": ["atención", "marketing de atención", "hook marketing", "tipos de atención", "la atención y el cerebro", "vídeos de descubrimiento", "vídeos de cultivación"],
    "Oportunidades Rápidas": ["oportunidades internas", "oportunidades externas", "tu mejor oportunidad", "ice score", "análisis de diana"],
    "Estrategias en Facebook Ads": ["facebook", "campañas rentables", "anuncios más impactantes", "anuncio en youtube"],
    "De la A a la Z para crear tu negocio de info producto": ["infoproducto", "la hipótesis de producto validado", "la ruta de producto"],
    "Sprint IA para emprendedores": ["inteligencia artificial", "taller de inteligencia artificial", "ia para emprendedores", "seo e inteligencia artificial"],
    "Workshops": ["workshop", "apalancamiento", "taller"],
    "El Mentalista": ["mentalista", "neurobranding", "psicología del consumidor", "arquetipos de marca", "narrativa de marca"],
    "El Estratega": ["estratega", "estrategia", "posicionamiento", "vídeo marketing", "las fases de una estrategia"],
    "La Máquina de las Ideas": ["máquina de las ideas", "generación de grandes ideas", "las ideas en tu planificación"],
    "La Venta Elegante": ["venta elegante", "llamada de venta", "la propuesta", "las rutas de venta"]
}

course_inventory = {c["title"]: {"meta": c, "matched_files": []} for c in web_catalog}
unassigned_files = []

for file_info in all_local_files:
    fname_lower = file_info["filename"].lower()
    matched = False
    
    for course_title, keywords in course_match_rules.items():
        if any(kw in fname_lower for kw in keywords):
            if course_title in course_inventory:
                course_inventory[course_title]["matched_files"].append(file_info)
                matched = True
                break
            else:
                # Find matching course in catalog
                for c_title in course_inventory:
                    if course_title.lower() in c_title.lower():
                        course_inventory[c_title]["matched_files"].append(file_info)
                        matched = True
                        break
    if not matched:
        # Check direct title match
        for c_title in course_inventory:
            if c_title.lower() in fname_lower:
                course_inventory[c_title]["matched_files"].append(file_info)
                matched = True
                break
        if not matched:
            unassigned_files.append(file_info)

# Generate final cross report
covered_courses = []
missing_courses = []

for c_title, data in course_inventory.items():
    m_files = data["matched_files"]
    total_mb = sum(f["size_mb"] for f in m_files)
    info = {
        "title": c_title,
        "category": data["meta"].get("category", "N/A"),
        "expected_classes": data["meta"].get("clases", "?"),
        "duration": data["meta"].get("duracion", "?"),
        "url": data["meta"].get("url", "N/A"),
        "found_files_count": len(m_files),
        "total_size_mb": round(total_mb, 1),
        "files": [f["filename"] for f in m_files]
    }
    if len(m_files) > 0:
        covered_courses.append(info)
    else:
        missing_courses.append(info)

final_report = {
    "summary": {
        "total_catalog_programs": len(web_catalog),
        "programs_with_local_files": len(covered_courses),
        "programs_missing": len(missing_courses),
        "coverage_rate_percent": round((len(covered_courses) / len(web_catalog)) * 100, 1),
        "total_matched_videos": sum(c["found_files_count"] for c in covered_courses),
        "total_local_size_gb": round(sum(c["total_size_mb"] for c in covered_courses) / 1024, 2)
    },
    "covered": covered_courses,
    "missing": missing_courses
}

out_rep = Path("reports/velocity_forensic_cross_match.json")
with open(out_rep, "w", encoding="utf-8") as f:
    json.dump(final_report, f, indent=2, ensure_ascii=False)

print("\n" + "="*80)
print(f"📊 MATRIZ DE CRUCE FORENSE VELOCITY MEDIA (WEB vs DISCO LOCAL)")
print("="*80)
print(f"Total Programas en Catálogo: {final_report['summary']['total_catalog_programs']}")
print(f"Programas con Archivos en PC: {final_report['summary']['programs_with_local_files']} ({final_report['summary']['coverage_rate_percent']}%)")
print(f"Programas Faltantes:          {final_report['summary']['programs_missing']}")
print(f"Total Videos/Audios en PC:    {final_report['summary']['total_matched_videos']} archivos")
print(f"Espacio Ocupado en PC:        {final_report['summary']['total_local_size_gb']} GB")

print("\n--- 🟢 PROGRAMAS ENCONTRADOS EN TU PC ---")
for c in covered_courses:
    print(f" ✅ [{c['category']}] {c['title']} -> {c['found_files_count']} clases ({c['total_size_mb']} MB)")
    for fn in c["files"][:2]:
        print(f"     • {fn}")

print("\n--- 🔴 PROGRAMAS QUE FALTAN POR DESCARGAR ---")
for c in missing_courses:
    print(f" ❌ [{c['category']}] {c['title']} ({c['expected_classes']} | {c['duration']}) -> {c['url']}")
