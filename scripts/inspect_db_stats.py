import json
import sys

with open('src/data/all_providers_database.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total providers in all_providers_database: {len(data)}")

partners = [x for x in data if 'partner fincas' in x.get('name', '').lower()]
print(f"Partner fincas count: {len(partners)}")

bosc = [x for x in data if 'masia pla del bosc' in x.get('name', '').lower()]
print(f"Masia Pla del Bosc count: {len(bosc)}")

zalacain = [x for x in data if 'zalacain' in x.get('name', '').lower()]
print(f"Zalacain count: {len(zalacain)}")

if bosc:
    print("\nMasia Pla del Bosc sample entries:")
    for idx, b in enumerate(bosc):
        print(f"Entry {idx}: id={b.get('id')}, name={b.get('name')}, img={b.get('img')}, phone={b.get('phone')}, price={b.get('basePrice') or b.get('priceRange')}, desc={str(b.get('description'))[:60]}")

if partners:
    print("\nPartner Fincas sample:")
    print(partners[0])
