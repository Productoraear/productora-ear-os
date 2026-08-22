import os
import re

tools_dir = 'src/features/astra/components/tools'
for f in os.listdir(tools_dir):
    if f.endswith('.tsx') or f.endswith('.ts'):
        p = os.path.join(tools_dir, f)
        with open(p, 'r', encoding='utf-8') as fl:
            content = fl.read()
            imports = re.findall(r'from\s+[\'"]([^\'"]+)[\'"]', content)
            print(f'=== {f} ===')
            for imp in imports:
                if imp.startswith('.'):
                    target = os.path.normpath(os.path.join(tools_dir, imp))
                    exists = os.path.exists(target + '.tsx') or os.path.exists(target + '.ts') or os.path.exists(target)
                    print(f'  {imp} -> {target} (exists: {exists})')
                else:
                    print(f'  {imp} (package)')
