import os
import re

files = [
    r'H:\EAR_OS_V2\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\EAR_OS_MAESTRO_PROMPTS_PARTE_36.md',
    r'H:\EAR_OS_V2\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\EAR_OS_MAESTRO_PROMPTS_PARTE_110.md',
    r'H:\incubadora despegue\ESTRATEGIAS_Y_FRAMEWORKS\EAR_OS_MAESTRO_PROMPTS_PARTE_110.md',
    r'H:\EAR_OS_V2\EAR_OS_V2\src\infrastructure\docs\archive\EAR_OS_OMEGA_CODEX.md'
]

output_file = 'extracted_giants_summary.txt'

with open(output_file, 'w', encoding='utf-8') as out:
    for fp in files:
        if not os.path.exists(fp):
            continue
        out.write(f"======================================================================\n")
        out.write(f"FILE: {fp}\n")
        out.write(f"======================================================================\n\n")
        
        with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        for i, line in enumerate(lines):
            line_l = line.lower()
            if any(term in line_l for term in ['10 gigantes', 'diez gigantes', 'tabla comparativa', 'bodas.net vs', 'the knot vs', 'zola vs', 'matriz de competidores']):
                out.write(f"--- MATCH AT LINE {i+1} ---\n")
                start = max(0, i - 5)
                end = min(len(lines), i + 60)
                out.write("".join(lines[start:end]))
                out.write("\n\n" + "-"*50 + "\n\n")

print("Done extracting to extracted_giants_summary.txt")
