"""Готовые ассеты (illustrations/people/icons) -> properties/<id>/assets с альфой.
Использование: python3 tools/prepare-assets.py sales1 <папка-комплекта>
Оригиналы не изменяются."""
import sys, shutil
from pathlib import Path
from PIL import Image
pid, src = sys.argv[1], Path(sys.argv[2])
out = Path('properties') / pid / 'assets'
(out / 'icons').mkdir(parents=True, exist_ok=True)
for f in (src / 'icons').glob('*.svg'):
    shutil.copy(f, out / 'icons' / f.name)
for f in (src / 'illustrations').glob('*.png'):
    im = Image.open(f).convert('RGBA'); im = im.crop(im.getchannel('A').getbbox())
    im.thumbnail((1100, 1100), Image.LANCZOS); im.save(out / (f.stem + '.webp'), quality=88, method=6)
im = Image.open(src / 'people' / 'manager-transparent.png').convert('RGBA'); im = im.crop(im.getchannel('A').getbbox())
im.thumbnail((1000, 1000), Image.LANCZOS); im.save(out / 'manager-transparent.webp', quality=88, method=6)
print('ok', sorted(p.name for p in out.iterdir()))
