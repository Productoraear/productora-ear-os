import os
import bs4
import re
import json

vault_path = r'H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT'
html_files = []
if os.path.exists(vault_path):
    for root, dirs, files in os.walk(vault_path):
        for f in files:
            if f.endswith('.html') or f.endswith('.htm'):
                html_files.append(os.path.join(root, f))
                
provider_pages = [f for f in html_files if '--e' in os.path.basename(f)]
print(f'Extracting from {len(provider_pages)} files...')

results = []
for i, target_file in enumerate(provider_pages):
    if i % 1000 == 0:
        print(f'Processed {i}/{len(provider_pages)} files...')
    try:
        with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            if 'Bodas.net' not in content and 'bodas.net' not in content: continue
            
            soup = bs4.BeautifulSoup(content, 'lxml')
            name = soup.find('h1')
            name_text = name.text.strip() if name else 'Unknown'
            
            telephone = None
            phones = re.findall(r'(?:\+34|0034)?[\s\-]?([6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{3})', content)
            unique_phones = list(set([p.strip().replace(' ', '').replace('-', '') for p in phones if len(p.strip().replace(' ', '').replace('-', '')) == 9]))
            if unique_phones: telephone = unique_phones[0]
                
            if not telephone:
                for script in soup.find_all('script', type='application/ld+json'):
                    if script.string and 'telephone' in script.string:
                        try:
                            data = json.loads(script.string)
                            if isinstance(data, list):
                                for item in data:
                                    if 'telephone' in item: telephone = item['telephone']
                            elif isinstance(data, dict) and 'telephone' in data:
                                telephone = data['telephone']
                        except: pass
            
            if telephone:
                results.append({'name': name_text, 'phone': telephone, 'file': target_file})
    except: pass

print(f'Done! Extracted {len(results)} phones.')
with open('scripts/nightcrawler_results/fast_extracted_phones.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, ensure_ascii=False, indent=2)
