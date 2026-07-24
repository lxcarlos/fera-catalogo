import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
INPUT_DIR = ROOT / "assets"
OUTPUT_DIR = ROOT / "assets_webp"

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

OUTPUT_DIR.mkdir(exist_ok=True)

count = 0

for image_path in INPUT_DIR.rglob("*"):
    if not image_path.is_file():
        continue
    if image_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        continue

    rel_path = image_path.relative_to(INPUT_DIR)
    out_path = OUTPUT_DIR / rel_path
    out_path = out_path.with_suffix(".webp")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if out_path.exists():
        print(f"Ya existe, se omite: {out_path}")
        continue

    try:
        with Image.open(image_path) as img:
            img = img.convert("RGBA") if img.mode in {"RGBA", "LA", "P"} else img.convert("RGB")
            img.save(out_path, format="WEBP", quality=80, lossless=False)
            print(f"Convertido: {image_path} -> {out_path}")
            count += 1
    except Exception as e:
        print(f"Error al convertir {image_path}: {e}")

print(f"\nProceso terminado. {count} archivos convertidos.")
