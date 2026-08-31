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
print(f'Found {len(provider_pages)} provider pages')

for target_file in provider_pages[:10]:
    print(f'Inspecting: {os.path.basename(target_file)}')
    with open(target_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
        # Check for JSON telephone
        numbers = re.findall(r'\"telephone\"\s*:\s*\"([^\"]+)\"', content)
        if numbers:
            print(f'  Found JSON telephone: {numbers}')
            
        # Check for ld+json
        soup = bs4.BeautifulSoup(content, 'lxml')
        for script in soup.find_all('script', type='application/ld+json'):
            if script.string and 'telephone' in script.string:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, list):
                        for item in data:
                            if 'telephone' in item:
                                print(f'  Found LD+JSON telephone: {item["telephone"]}')
                    elif isinstance(data, dict):
                         if 'telephone' in data:
                                print(f'  Found LD+JSON telephone: {data["telephone"]}')
                except Exception:
                    pass
                    
        # Check standard Spanish numbers
        phones = re.findall(r'(?:\+34|0034)?[\s\-]?([6789]\d{2}[\s\-]?\d{3}[\s\-]?\d{3})', content)
        unique_phones = list(set([p.strip() for p in phones]))
        if unique_phones:
            print(f'  Regex phones: {unique_phones}')
