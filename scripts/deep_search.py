import os
import fitz  # PyMuPDF
from docx import Document
import json

search_dirs = [r'H:\00_PRODUCTORA_EAR', r'H:\EAR_OS_V2']
keywords = ['universidad', 'médico', 'psicólogo', 'fondo europeo', 'viaje musical por la memoria', 'vimume', 'escucha activa', 'verdad', 'innegociable', 'mentira']

results = []
count = 0

for d in search_dirs:
    for root, dirs, files in os.walk(d):
        if 'node_modules' in dirs: dirs.remove('node_modules')
        if '.git' in dirs: dirs.remove('.git')
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            path = os.path.join(root, file)
            content = ''
            try:
                if ext in ['.md', '.txt']:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                elif ext == '.pdf':
                    doc = fitz.open(path)
                    for page in doc:
                        content += page.get_text() + ' '
                elif ext == '.docx':
                    doc = Document(path)
                    for p in doc.paragraphs:
                        content += p.text + ' '
                
                content_lower = content.lower()
                matches = [k for k in keywords if k in content_lower]
                if len(matches) > 0:
                    snippets = []
                    lines = content.split('\n')
                    for line in lines:
                        if any(k in line.lower() for k in keywords):
                            snippets.append(line.strip()[:300])
                    results.append({
                        'file': path,
                        'matches': matches,
                        'snippets': snippets[:5]
                    })
                    count += 1
            except Exception as e:
                pass

with open(r'H:\EAR_OS_V2\EAR_OS_V2\scratch\deep_search_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f'Search complete. Found {count} files. Results in scratch/deep_search_results.json')
