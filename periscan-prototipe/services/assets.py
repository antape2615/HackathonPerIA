# services/assets.py
import os
from PIL import Image, ImageDraw, ImageFont, UnidentifiedImageError

ASSETS_DIR = "assets"
BRAIN_NAME = "logo_pi_brain.png"
TEXT_NAME = "logo_pi_text.png"
PERIF_NAME = "logo_periferia.png"

def validate_image(path):
    """Try to open image with PIL. Return True if OK, False otherwise."""
    try:
        if not os.path.exists(path): 
            return False
        with Image.open(path) as im:
            im.verify()  # lanzar una excepción si no es una imagen
        return True
    except (UnidentifiedImageError, Exception):
        return False

def ensure_assets():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    brain_path = os.path.join(ASSETS_DIR, BRAIN_NAME)
    text_path = os.path.join(ASSETS_DIR, TEXT_NAME)
    perif_path = os.path.join(ASSETS_DIR, PERIF_NAME)

    # si existe pero es inválida, sobreescribir
    if not validate_image(brain_path):
        _create_brain_logo(brain_path)
    if not validate_image(text_path):
        _create_text_logo(text_path)
    if not validate_image(perif_path):
        _create_periferia_logo(perif_path)

def _load_font(size=24):
    candidates = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/Library/Fonts/Arial Bold.ttf"
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def _create_brain_logo(path):
    W,H = 420,120
    img = Image.new("RGBA",(W,H),(255,255,255,0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([(0,0),(W,H)], radius=12, fill=(247,249,255,255))
    coords = [(60,60),(110,40),(160,70),(210,45),(260,60)]
    for i,(x,y) in enumerate(coords):
        if i>0:
            px,py = coords[i-1]
            d.line([(px,py),(x,y)], fill=(75,3,255), width=4)
        d.ellipse([(x-10,y-10),(x+10,y+10)], fill=(122,31,246))
    d.polygon([(300,30),(320,40),(300,50)], fill=(91,192,255))
    font_big = _load_font(36)
    font_small = _load_font(14)
    d.text((330,22),"PI", fill=(0,36,82), font=font_big)
    d.text((330,62),"Periscan Insight", fill=(4,78,153), font=font_small)
    img.save(path, format="PNG")

def _create_text_logo(path):
    img = Image.new("RGBA",(360,80),(255,255,255,0))
    d = ImageDraw.Draw(img)
    font = _load_font(28)
    d.text((10,12),"Periscan Insight Platform", fill=(0,36,82), font=font)
    img.save(path, format="PNG")

def _create_periferia_logo(path):
    img = Image.new("RGBA",(260,60),(255,255,255,0))
    d = ImageDraw.Draw(img)
    font = _load_font(14)
    d.text((10,12),"Periferia IT Group", fill=(0,36,82), font=font)
    img.save(path, format="PNG")
