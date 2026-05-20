# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "Pillow>=10.0",
# ]
# ///
"""Сжатие крупных биографических фото без изменения путей и имён.

Логика:
- Сканирует public/images/biography/*.jpg.
- Если файл больше TARGET_KB или его длинная сторона больше MAX_LONG_SIDE,
  пережимает progressive JPEG quality=78 и при необходимости даунсайзит
  до MAX_LONG_SIDE по большей стороне через LANCZOS.
- Сохраняет на месте (тот же путь и имя) — никаких правок в JSX/TSX
  не требуется.

Запуск:
    uv run scripts/optimize-images.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "public" / "images" / "biography"

TARGET_KB = 450        # выше — пережимаем
MAX_LONG_SIDE = 1600   # пиксели; биография — статика, 1600 более чем достаточно
QUALITY = 78           # progressive JPEG, визуально неотличимо от исходника


def kb(p: Path) -> int:
    return p.stat().st_size // 1024


def process(p: Path) -> tuple[int, int] | None:
    before = kb(p)
    with Image.open(p) as im:
        # снимаем EXIF-ориентацию и приводим к RGB на всякий случай
        im = ImageOps.exif_transpose(im)
        if im.mode != "RGB":
            im = im.convert("RGB")

        long_side = max(im.size)
        needs_resize = long_side > MAX_LONG_SIDE
        needs_recompress = before > TARGET_KB

        if not (needs_resize or needs_recompress):
            return None

        if needs_resize:
            ratio = MAX_LONG_SIDE / long_side
            new_size = (round(im.size[0] * ratio), round(im.size[1] * ratio))
            im = im.resize(new_size, Image.LANCZOS)

        im.save(
            p,
            format="JPEG",
            quality=QUALITY,
            optimize=True,
            progressive=True,
        )

    after = kb(p)
    return before, after


def main() -> int:
    if not IMG_DIR.is_dir():
        print(f"!! not a directory: {IMG_DIR}", file=sys.stderr)
        return 1

    print(f"scanning {IMG_DIR.relative_to(ROOT)}")
    total_before = 0
    total_after = 0
    touched = 0
    for p in sorted(IMG_DIR.glob("*.jpg")):
        before = kb(p)
        total_before += before
        result = process(p)
        if result is None:
            total_after += before
            print(f"  skip   {p.name:32s} {before:5d} KB (already small)")
            continue
        b, a = result
        total_after += a
        touched += 1
        delta = b - a
        pct = 100.0 * delta / b if b else 0.0
        print(f"  shrunk {p.name:32s} {b:5d} -> {a:4d} KB  (-{delta:4d} KB, -{pct:4.1f}%)")

    print(
        f"done: {touched} file(s) recompressed, "
        f"total {total_before} -> {total_after} KB "
        f"(saved {total_before - total_after} KB)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
