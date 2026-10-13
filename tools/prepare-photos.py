"""Готовит фото сайта: берёт файлы из source/ и пишет webp (до 1600 px) в photos/.
Запуск: python3 -I tools/prepare-photos.py sales1
Список кадров и порядок задаются в SELECT ниже (первый кадр = hero)."""
import sys, glob, os
from PIL import Image, ImageOps

pid = sys.argv[1] if len(sys.argv) > 1 else 'sales1'
base = os.path.join('properties', pid)
src = glob.glob(os.path.join(base, 'source', 'STYE163*'))[0]
K = os.path.join(src, '01 - *', 'KÜÇÜK RESİM')
D = os.path.join(src, '02 - DA*', 'KÜÇÜK RESİM')

# (папка, файл, имя выходного файла)
SELECT = [
    (D, '8.jpeg', 'view'), (D, '2.jpeg', 'living'), (D, '1.jpeg', 'kitchen'),
    (K, '(3).jpg', 'complex-night'), (D, '3.jpeg', 'living-2'), (D, '9.jpeg', 'bedroom'),
    (D, '7.jpeg', 'terrace'), (D, '10.jpeg', 'bedroom-2'), (D, '15.jpeg', 'kids'),
    (D, '13.jpeg', 'bath'), (K, '(8).jpg', 'complex-pool'), (K, '(5).jpg', 'pool'),
    (K, '(14).jpg', 'aqua'), (K, '(13).jpg', 'playground'), (K, '(12).jpg', 'tennis'),
    (K, '(17).jpg', 'spa'), (K, '(10).jpg', 'lobby'), (K, '(7).jpg', 'aerial'),
]
out = os.path.join(base, 'photos')
os.makedirs(out, exist_ok=True)
for f in glob.glob(os.path.join(out, '*')):
    os.remove(f)
for folder, name, dst in SELECT:
    p = glob.glob(os.path.join(folder, name))[0]
    im = ImageOps.exif_transpose(Image.open(p)).convert('RGB')
    im.thumbnail((1600, 1600), Image.LANCZOS)
    im.save(os.path.join(out, dst + '.webp'), 'WEBP', quality=80, method=6)
    print(dst, im.size)
