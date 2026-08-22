import os
import re

patterns = {
    'contexts': r'from [\'\"].*contexts.*[\'\"]',
    'stores': r'from [\'\"].*stores.*[\'\"]',
    'page-components': r'from [\'\"].*page-components.*[\'\"]',
    'pages-sclass': r'from [\'\"].*pages-sclass.*[\'\"]',
    'layouts': r'from [\'\"].*layouts.*[\'\"]',
    'fincas-landing': r'from [\'\"].*fincas-landing.*[\'\"]',
    'sandbox': r'from [\'\"].*sandbox.*[\'\"]'
}

results = {k: [] for k in patterns}

for root, dirs, files in os.walk('src'):
    if '_archive' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
            fp = os.path.join(root, file)
            try:
                with open(fp, 'r', encoding='utf-8') as f:
                    content = f.read()
                    for k, p in patterns.items():
                        if re.search(p, content):
                            results[k].append(fp)
            except Exception:
                pass

for k, matches in results.items():
    print(f'Pattern: {k} -> {len(matches)} files')
    for m in matches[:5]:
        print('   ', m)

print('\nChecking route pages inside folders:')
for folder in ['sandbox', 'fincas-landing', 'pages-sclass', 'layouts', 'page-components']:
    p = os.path.join('src', 'app', folder)
    if os.path.exists(p):
        contents = os.listdir(p)
        print(f'src/app/{folder} -> {contents}')
