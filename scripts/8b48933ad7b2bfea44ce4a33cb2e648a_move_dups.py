öimport json
import os
import shutil
from pathlib import Path

def move_duplicates():
    report_path = 'H:\\EAR_OS_MASTER_2026\\audit_report_forense.json'
    dest_dir = 'D:\\_PAPELERA_REVISION'
    
    if not os.path.exists(report_path):
        print("Error: No se encuentra el reporte de auditorÃ­a.")
        return

    with open(report_path, 'r', encoding='utf-8') as f:
        report = json.load(f)

    os.makedirs(dest_dir, exist_ok=True)
    
    hashes_seen = {}
    dups_moved = 0
    errors = 0

    # Primero identificamos los originales (el primer archivo encontrado con cada hash)
    # y los secundarios (duplicados)
    for f_hash, path in report['hashes'].items():
        # En el reporte, 'hashes' ya guarda un mapeo unico de hash -> path (el ultimo procesado)
        # Pero el script original contaba duplicados. 
        # Vamos a usar la lista de clasificacion para encontrar todos los archivos.
        pass

    # Re-escaneamos segun el reporte original para ser precisos
    # El reporte original guardaba en 'hashes' el UNICO archivo mapeado.
    # Necesitamos mover los que NO estan en esa lista de 'originales'.
    
    # Los originales son los valores de report['hashes']
    originals = set(os.path.normpath(p) for p in report['hashes'].values())
    print(f"NÃºmero de originales Ãºnicos identificados: {len(originals)}")
    
    # Recorremos todas las clasificaciones. Todo lo que estÃ© allÃ­ pero NO sea un original, es un duplicado.
    for vertical, files in report['classification'].items():
        print(f"Auditando vertical {vertical} ({len(files)} archivos total)...")
        for file_path in files:
            norm_path = os.path.normpath(file_path)
            
            if norm_path not in originals:
                try:
                    p = Path(norm_path)
                    if not p.exists():
                        continue
                    
                    # Generar nombre destino unico en la papelera
                    target_name = p.name
                    target_path = os.path.join(dest_dir, target_name)
                    
                    if os.path.exists(target_path):
                        # Si ya existe por nombre, le aÃ±adimos un indice
                        target_path = os.path.join(dest_dir, f"{p.stem}_{dups_moved}{p.suffix}")

                    shutil.move(norm_path, target_path)
                    dups_moved += 1
                except Exception as e:
                    print(f"Error moviendo {norm_path}: {e}")
                    errors += 1
            else:
                # Es un original, se queda donde estÃ¡.
                pass

    print(f"\nâœ… OPERACIÃ“N DE LIMPIEZA COMPLETADA.")
    print(f"Archivos movidos a 'D:\\_PAPELERA_REVISION': {dups_moved}")
    print(f"Archivos originales mantenidos en H:: {len(originals)}")
    if errors > 0:
        print(f"âš ï¸ Hubo {errors} errores durante el movimiento.")

if __name__ == "__main__":
    move_duplicates()
£	 *cascade08£	İ	*cascade08İ	í	 *cascade08í	Š
*cascade08Š
ª
 *cascade08ª
Ï
 *cascade08Ï
İ
*cascade08İ
÷
 *cascade08÷
£ *cascade08£¤*cascade08¤¥ *cascade08¥¨*cascade08¨¬ *cascade08¬²*cascade08²³ *cascade08³¶*cascade08¶¸ *cascade08¸¼*cascade08¼½ *cascade08½¾*cascade08¾¿ *cascade08¿Á*cascade08ÁÆ *cascade08ÆÊ*cascade08ÊÔ *cascade08ÔÖ*cascade08ÖØ *cascade08Øæ*cascade08æ¦ *cascade08¦¶ *cascade08¶¹*cascade08¹º *cascade08º»*cascade08»Ô *cascade08ÔÕ*cascade08Õê *cascade08êô*cascade08ôø *cascade08ø¥ *cascade08¥®*cascade08®¯ *cascade08¯Â*cascade08ÂË *cascade08Ëô*cascade08ô» *cascade08»¿*cascade08¿í *cascade08í‡*cascade08‡» *cascade08»Â*cascade08ÂÄ *cascade08ÄÊ*cascade08ÊÌ *cascade08ÌÓ*cascade08ÓÔ *cascade08ÔØ*cascade08ØÙ *cascade08Ùà*cascade08àâ *cascade08âş*cascade08şÿ *cascade08ÿ‚*cascade08‚… *cascade08…‹*cascade08‹¨ *cascade08¨©*cascade08©ª *cascade08ª¬*cascade08¬® *cascade08®³*cascade08³´ *cascade08´µ*cascade08µ¶ *cascade08¶º*cascade08º» *cascade08»¼*cascade08¼½ *cascade08½¿*cascade08¿À *cascade08ÀÁ*cascade08ÁÂ *cascade08ÂÄ*cascade08ÄÆ *cascade08ÆÌ*cascade08ÌÍ *cascade08ÍÔ*cascade08ÔÕ *cascade08ÕÖ*cascade08ÖØ *cascade08Øã*cascade08ãæ *cascade08æë*cascade08ë *cascade08¢*cascade08¢¾ *cascade08¾‰*cascade08‰ *cascade08”*cascade08”Ó *cascade08ÓÕ *cascade08Õõ *cascade08õù*cascade08ù† *cascade08†‹*cascade08‹‡ *cascade08‡‹*cascade08‹¹ *cascade08¹à *cascade08àä*cascade08äæ *cascade08æç*cascade08çé *cascade08éë*cascade08ëí *cascade08íñ*cascade08ñò *cascade08òõ*cascade08õ÷ *cascade08÷ø*cascade08øù *cascade08ùú*cascade08úü *cascade08üş*cascade08ş€ *cascade08€*cascade08‚ *cascade08‚…*cascade08…› *cascade08›« *cascade08«­*cascade08­± *cascade08±²*cascade08²³ *cascade08³»*cascade08»¼ *cascade08¼Ò*cascade08Òö *cascade08ö÷*cascade08÷ù *cascade08ù*cascade08¤ *cascade08¤ê*cascade08êŠ *cascade08Š˜*cascade08˜ *cascade08*cascade08  *cascade08 ¢*cascade08¢£ *cascade08£«*cascade08«­ *cascade08­³*cascade08³´ *cascade08´¸*cascade08¸¹ *cascade08¹»*cascade08»¼ *cascade08¼½*cascade08½ö *cascade08"(4f5c74d3144befb148bbcd87bc615425cbe331872Efile:///H:/EAR_OS_MASTER_2026/productora-ear-app/scripts/move_dups.py:0file:///H:/EAR_OS_MASTER_2026/productora-ear-app