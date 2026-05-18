import os
import json

patterns = {
    "AI_KERNELS": ["gen_nn", "gen_math", "gen_array", "ops"],
    "DATA_CONTRACTS": ["generated", "schema", "flatbuffers"],
    "BOOT_SYSTEM": ["get-pip", "topics"],
    "DEBUG_INFRA": ["pydevd", "common_methods"]
}

report = {k: [] for k in patterns}
scripts_dir = 'c:\\EAR_OS_V2\\scripts'
for file in os.listdir(scripts_dir):
    if file.endswith('.py'):
        matched = False
        for category, keywords in patterns.items():
            if any(key in file for key in keywords):
                report[category].append(file)
                matched = True
                break
        if not matched: report.setdefault("UNCATEGORIZED", []).append(file)

output_path = 'c:\\EAR_OS_V2\\data_vault\\ear_os_infra_inventory.json'
with open(output_path, 'w') as f:
    json.dump(report, f, indent=4)

print(f"Inventory generation complete. Report saved to {output_path}")

print("Inventory generation complete.")
