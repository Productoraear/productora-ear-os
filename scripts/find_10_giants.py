import os

search_dirs = [
    'H:\\EAR_OS_V2\\EAR_OS_V2',
    'H:\\incubadora despegue'
]

matches = []
giants = ['bodas.net', 'the knot', 'weddingwire', 'zola', 'hitched', 'matrimonio.com', 'mariages.net', 'withjoy', 'minted', 'junebug', 'bark', 'gigsalad', 'pronto pro', 'tagvenue']

for sdir in search_dirs:
    if not os.path.exists(sdir):
        continue
    for root, dirs, files in os.walk(sdir):
        if any(ign in root for ign in ['.git', 'node_modules', '.next', '.turbo']):
            continue
        for f in files:
            if f.endswith(('.md', '.txt', '.json', '.pdf')):
                p = os.path.join(root, f)
                try:
                    if f.endswith(('.md', '.txt', '.json')):
                        with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                            txt = fl.read()
                            txt_lower = txt.lower()
                            
                            found_giants = [g for g in giants if g in txt_lower]
                            has_10_phrase = '10 gigantes' in txt_lower or 'diez gigantes' in txt_lower or 'top 10' in txt_lower or 'comparativa' in txt_lower
                            
                            if len(found_giants) >= 3 or has_10_phrase:
                                matches.append({
                                    'path': p,
                                    'size': len(txt),
                                    'has_phrase': has_10_phrase,
                                    'giants_count': len(found_giants),
                                    'giants': found_giants
                                })
                except Exception as e:
                    pass

matches.sort(key=lambda x: (x['has_phrase'], x['giants_count'], x['size']), reverse=True)

with open('scratch_giants_results.txt', 'w', encoding='utf-8') as out:
    out.write(f"Found {len(matches)} matching documents:\n\n")
    for m in matches[:30]:
        out.write(f"File: {m['path']}\n")
        out.write(f"  Giants matched ({m['giants_count']}): {m['giants']}\n")
        out.write(f"  Has phrase: {m['has_phrase']}\n")
        out.write(f"  Size: {m['size']:,} bytes\n\n")

print("Done. Wrote results to scratch_giants_results.txt")
