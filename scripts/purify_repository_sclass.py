import os
import shutil

base_dir = os.path.abspath('.')
src_dir = os.path.join(base_dir, 'src')
cruft_dir = os.path.join(src_dir, '_archive_cruft_2026')
docs_dir = os.path.join(base_dir, 'docs')
logs_dir = os.path.join(base_dir, 'logs')

os.makedirs(cruft_dir, exist_ok=True)
os.makedirs(docs_dir, exist_ok=True)
os.makedirs(logs_dir, exist_ok=True)

print("1. MOVIENDO LOGS Y TXT DE LA RAIZ...")
for item in os.listdir(base_dir):
    item_path = os.path.join(base_dir, item)
    if os.path.isfile(item_path):
        if item.endswith('.log'):
            dest = os.path.join(logs_dir, item)
            shutil.move(item_path, dest)
            print(f"  [LOG] {item} -> logs/")
        elif item.endswith('.txt') and item not in ['README.md', 'LICENSE']:
            dest = os.path.join(docs_dir, item)
            shutil.move(item_path, dest)
            print(f"  [DOC] {item} -> docs/")

print("\n2. AISLANDO ARCHIVOS JS DUPLICADOS...")
js_isolated = 0
for root, dirs, files in os.walk(src_dir):
    if '_archive' in root:
        continue
    for file in files:
        if file.endswith('.js') and not file.endswith('.config.js'):
            base_name = file[:-3]
            has_ts = (base_name + '.ts' in files) or (base_name + '.tsx' in files)
            explicit_legacy = file in ['constants.js', 'types.js', '[...slug].js', 'styles.js']
            
            if has_ts or explicit_legacy:
                src_file = os.path.join(root, file)
                rel_path = os.path.relpath(src_file, src_dir)
                dest_file = os.path.join(cruft_dir, 'legacy_js', rel_path)
                os.makedirs(os.path.dirname(dest_file), exist_ok=True)
                shutil.move(src_file, dest_file)
                js_isolated += 1
                print(f"  [LEGACY JS] {rel_path} -> _archive_cruft_2026/legacy_js/")

print(f"Total archivos JS aislados: {js_isolated}")

print("\n3. REUBICANDO LAYOUTS Y LIMPIANDO APP ROUTER...")
# Reubicar MainLayout
old_layout = os.path.join(src_dir, 'app', 'layouts', 'MainLayout.tsx')
new_layout_dir = os.path.join(src_dir, 'components', 'layouts')
new_layout = os.path.join(new_layout_dir, 'MainLayout.tsx')

if os.path.exists(old_layout):
    os.makedirs(new_layout_dir, exist_ok=True)
    shutil.move(old_layout, new_layout)
    print("  [LAYOUT] src/app/layouts/MainLayout.tsx -> src/components/layouts/MainLayout.tsx")
    
    # Eliminar carpeta layouts en app si quedo vacia
    layouts_dir = os.path.join(src_dir, 'app', 'layouts')
    if os.path.exists(layouts_dir) and not os.listdir(layouts_dir):
        os.rmdir(layouts_dir)
        print("  [CLEAN] Eliminada carpeta vacia src/app/layouts/")

# Limpiar carpetas vacias no-route
for folder in ['pages-sclass', 'page-components']:
    p = os.path.join(src_dir, 'app', folder)
    if os.path.exists(p):
        if not os.listdir(p):
            os.rmdir(p)
            print(f"  [CLEAN] Eliminada carpeta vacia src/app/{folder}/")
        else:
            dest = os.path.join(cruft_dir, 'app_non_routes', folder)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.move(p, dest)
            print(f"  [QUARANTINE] src/app/{folder} -> _archive_cruft_2026/app_non_routes/")

print("\n4. UNIFICANDO PLURALES (contexts -> context, stores -> store)...")
plural_map = {
    os.path.join(src_dir, 'contexts'): os.path.join(src_dir, 'context'),
    os.path.join(src_dir, 'stores'): os.path.join(src_dir, 'store')
}

for src_plural, dest_singular in plural_map.items():
    if os.path.exists(src_plural):
        os.makedirs(dest_singular, exist_ok=True)
        for item in os.listdir(src_plural):
            s = os.path.join(src_plural, item)
            d = os.path.join(dest_singular, item)
            if not os.path.exists(d):
                shutil.move(s, d)
                print(f"  [MOVE] {item} -> {os.path.basename(dest_singular)}/")
            else:
                print(f"  [SKIP] {item} ya existe en {os.path.basename(dest_singular)}/")
        if not os.listdir(src_plural):
            os.rmdir(src_plural)
            print(f"  [CLEAN] Carpeta eliminada: {os.path.basename(src_plural)}/")

print("\n==================================================")
print("PURIFICACION S-CLASS COMPLETADA CON EXITO")
print("==================================================")
