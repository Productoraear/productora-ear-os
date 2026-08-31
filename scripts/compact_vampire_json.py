import json
import os
import shutil

def compact_json():
    src_path = os.path.join("src", "data", "vampirized_providers.json")
    if not os.path.exists(src_path):
        print("Source file not found")
        return

    with open(src_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Total records in source: {len(data)}")
    compacted = []
    for p in data:
        name = p.get("name") or ""
        item = {
            "id": p.get("id") or p.get("shaHash") or "",
            "name": name,
            "category": p.get("category") or "Música & Sonido",
            "province": p.get("province") or p.get("provincia") or "Madrid",
            "municipality": p.get("municipality") or "",
            "telephone": p.get("telephone") or p.get("phone") or "",
            "priceRange": p.get("priceRange") or p.get("price_range") or "",
            "rating": p.get("rating") or 4.9,
            "reviewsCount": p.get("reviewsCount") or p.get("reviews_count") or p.get("reviews") or 24,
            "description": (p.get("description") or p.get("description_full") or "")[:350],
            "imageUrls": (p.get("imageUrls") or p.get("image_urls") or p.get("images") or [])[:3],
            "claimToken": p.get("claimToken") or "",
            "slug": p.get("slug") or ""
        }
        compacted.append(item)

    orig_size_mb = os.path.getsize(src_path) / (1024 * 1024)

    # Save backup first
    backup_path = os.path.join("src", "data", "vampirized_providers.backup.json")
    if not os.path.exists(backup_path):
        shutil.copy(src_path, backup_path)

    with open(src_path, "w", encoding="utf-8") as f:
        json.dump(compacted, f, ensure_ascii=False, separators=(',', ':'))

    new_size_mb = os.path.getsize(src_path) / (1024 * 1024)
    print(f"Original size: {orig_size_mb:.2f} MB")
    print(f"New compacted size: {new_size_mb:.2f} MB (Reduced by {((orig_size_mb - new_size_mb)/orig_size_mb)*100:.1f}%)")

if __name__ == "__main__":
    compact_json()
