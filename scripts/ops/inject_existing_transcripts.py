import os
import re
from pathlib import Path

vault = Path(r"D:\EAR_VAULT")
trans_files = list(vault.rglob("*_transcription.json"))
knowledge_root = Path(r"H:\EAR_VAULT_VELOCITY_KNOWLEDGE")

print("="*80)
print("🏛️ INYECTOR DE TRANSCRIPCIONES EXISTENTES A OBSIDIAN KNOWLEDGE VAULT")
print("="*80)

# Build a map of existing markdown files in knowledge_root
all_mds = {}
for root, dirs, files in os.walk(knowledge_root):
    for f in files:
        if f.endswith(".md") and not f.startswith("00_INDICE"):
            clean = f.replace(".md", "").lower().strip()
            # remove punctuation for matching
            clean = re.sub(r'[^\w\s]', '', clean)
            all_mds[clean] = Path(root) / f

injected_count = 0

for tf in trans_files:
    try:
        raw = tf.read_text(encoding="utf-8", errors="ignore")
        if len(raw) < 200 or "<html" in raw.lower():
            continue
        
        # Clean title of transcript file
        clean_name = tf.name.replace(".mp4_transcription.json", "")
        clean_name = clean_name.replace(".mp3_transcription.json", "")
        clean_name = clean_name.replace("_transcription.json", "")
        clean_name = re.sub(r'\(2\)', '', clean_name).strip()
        search_key = re.sub(r'[^\w\s]', '', clean_name).lower().strip()
        
        # Find matching markdown file
        target_md = None
        if search_key in all_mds:
            target_md = all_mds[search_key]
        else:
            # Substring match
            for k, p in all_mds.items():
                if len(search_key) > 5 and (search_key in k or k in search_key):
                    target_md = p
                    break
        
        if target_md and target_md.exists():
            curr_content = target_md.read_text(encoding="utf-8")
            if "[LISTO PARA TRANSCRIBIR CON GPU]" in curr_content:
                # Replace with real transcript
                updated_content = curr_content.replace(
                    "[LISTO PARA TRANSCRIBIR CON GPU]",
                    f"*(Transcripción Recuperada y Homologada)*\n\n{raw}"
                )
                target_md.write_text(updated_content, encoding="utf-8")
                injected_count += 1
                print(f"  -> ✅ Inyectada transcripción existente en: {target_md.name}")
    except Exception as e:
        pass

print("="*80)
print(f"🏆 INYECCIÓN CULMINADA: {injected_count} clases actualizadas con transcripción ya existente.")
print("="*80)
